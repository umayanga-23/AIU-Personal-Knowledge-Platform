package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


public class TechnologyRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrUpdate {
        @NotBlank(message = "Technology name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        private String name;

        private String slug;

        private String description;
        private String category;
        private String iconUrl;
        private String websiteUrl;
        private ContentStatus status;
    }
}
