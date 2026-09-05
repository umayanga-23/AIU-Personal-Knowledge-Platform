package com.induwara.portfolio.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {
    private String email;
    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;
    private String youtubeUrl;
}
