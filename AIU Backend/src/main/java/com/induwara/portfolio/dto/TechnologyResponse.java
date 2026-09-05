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
public class TechnologyResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String category;
    private String iconUrl;
    private String websiteUrl;
    private ContentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
