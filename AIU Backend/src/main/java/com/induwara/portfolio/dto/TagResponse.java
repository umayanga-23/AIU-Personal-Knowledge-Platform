package com.induwara.portfolio.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagResponse {
    private UUID id;
    private String name;
    private String slug;
}
