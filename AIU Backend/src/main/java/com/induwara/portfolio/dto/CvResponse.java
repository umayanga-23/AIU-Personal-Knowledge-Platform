package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvResponse {
    private UUID id;
    private String title;
    private String fileName;
    private String fileUrl;
    private String downloadUrl;
    private String version;
    private ContentStatus status;
    private Boolean isCurrent;
    private LocalDateTime uploadedAt;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
