package com.induwara.portfolio.service.storage;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.induwara.portfolio.exception.BadRequestException;
import com.induwara.portfolio.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
@SuppressWarnings("null")
public class SupabaseStorageService {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseStorageService.class);
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    public SupabaseStorageService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String uploadFile(String bucketName, MultipartFile file, List<String> allowedContentTypes) {
        validateFile(file, allowedContentTypes);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Filename contains invalid path sequence: " + originalFilename);
        }

        String extension = getFileExtension(originalFilename);
        String safeFileName = UUID.randomUUID().toString() + (extension.isEmpty() ? "" : "." + extension);
        String storagePath = safeFileName;

        try {
            String uploadUrl = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucketName, storagePath);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apiKey", serviceRoleKey)
                    .header("Content-Type", file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                logger.error("Supabase Storage upload failed with status {}: {}", response.statusCode(), response.body());
                throw new FileStorageException("Failed to upload file to Supabase Storage: " + response.body());
            }

            logger.info("Successfully uploaded file {} to bucket {}", storagePath, bucketName);

            if ("cv-files".equalsIgnoreCase(bucketName)) {
                return storagePath;
            } else {
                return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucketName, storagePath);
            }

        } catch (Exception e) {
            if (e instanceof FileStorageException || e instanceof BadRequestException) {
                throw (RuntimeException) e;
            }
            throw new FileStorageException("Error uploading file to Supabase Storage", e);
        }
    }

    public String createSignedUrl(String bucketName, String filePath, int expiresInSeconds) {
        try {
            String signUrl = String.format("%s/storage/v1/object/sign/%s/%s", supabaseUrl, bucketName, filePath);
            String requestBody = objectMapper.writeValueAsString(java.util.Map.of("expiresIn", expiresInSeconds));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(signUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apiKey", serviceRoleKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode json = objectMapper.readTree(response.body());
                String signedPath = json.path("signedURL").asText();
                if (StringUtils.hasText(signedPath)) {
                    if (signedPath.startsWith("http")) {
                        return signedPath;
                    }
                    return supabaseUrl + "/storage/v1" + signedPath;
                }
            }
            logger.warn("Failed to generate signed URL from Supabase Storage response: {}", response.body());
            return String.format("%s/storage/v1/object/authenticated/%s/%s", supabaseUrl, bucketName, filePath);
        } catch (Exception e) {
            logger.error("Error creating signed URL for file {}", filePath, e);
            return null;
        }
    }

    public byte[] downloadFileBytes(String bucketName, String filePath) {
        try {
            String downloadUrl = String.format("%s/storage/v1/object/authenticated/%s/%s", supabaseUrl, bucketName, filePath);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(downloadUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apiKey", serviceRoleKey)
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return response.body();
            } else {
                throw new FileStorageException("Failed to download file from Supabase Storage: HTTP " + response.statusCode());
            }
        } catch (Exception e) {
            throw new FileStorageException("Error downloading file bytes from Supabase Storage", e);
        }
    }

    public void deleteFile(String bucketName, String filePath) {
        try {
            String deleteUrl = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucketName, filePath);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(deleteUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apiKey", serviceRoleKey)
                    .DELETE()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("Successfully deleted file {} from bucket {}", filePath, bucketName);
            } else {
                logger.warn("Failed to delete file {} from bucket {}: {}", filePath, bucketName, response.body());
            }
        } catch (Exception e) {
            logger.error("Error deleting file {} from bucket {}", filePath, bucketName, e);
        }
    }

    private void validateFile(MultipartFile file, List<String> allowedContentTypes) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String contentType = file.getContentType();
        if (allowedContentTypes != null && !allowedContentTypes.isEmpty()) {
            boolean isAllowed = allowedContentTypes.stream()
                    .anyMatch(type -> type.equalsIgnoreCase(contentType));
            if (!isAllowed) {
                throw new BadRequestException("File type '" + contentType + "' is not supported. Allowed types: " + allowedContentTypes);
            }
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
