package com.induwara.portfolio.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AboutResponse {
    private String name;
    private String title;
    private String bio;
    private String location;
    private List<String> highlights;
    private List<TechnologyResponse> topTechnologies;
    private CvResponse currentCv;
}
