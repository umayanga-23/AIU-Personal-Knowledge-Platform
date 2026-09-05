package com.induwara.portfolio.entity;

import com.induwara.portfolio.enums.ContentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "research")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Research {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "abstract", columnDefinition = "TEXT")
    private String abstractText;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(columnDefinition = "TEXT")
    private String methodology;

    @Column(columnDefinition = "TEXT")
    private String results;

    @Column(columnDefinition = "TEXT")
    private String conclusion;

    private String authors;

    @Column(name = "publication_date")
    private LocalDateTime publicationDate;

    @Column(name = "publication_url")
    private String publicationUrl;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ContentStatus status = ContentStatus.DRAFT;

    @Column(name = "published_at")
    private LocalDateTime publishedDate;

    @ManyToMany
    @JoinTable(
        name = "research_technologies",
        joinColumns = @JoinColumn(name = "research_id"),
        inverseJoinColumns = @JoinColumn(name = "technology_id")
    )
    @Builder.Default
    private Set<Technology> technologies = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "research_tags",
        joinColumns = @JoinColumn(name = "research_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "research_articles",
        joinColumns = @JoinColumn(name = "research_id"),
        inverseJoinColumns = @JoinColumn(name = "article_id")
    )
    @Builder.Default
    private Set<KnowledgeArticle> articles = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
