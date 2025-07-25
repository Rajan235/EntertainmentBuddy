package com.example.tracking.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tracking_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingEntry {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String title; // e.g. Anime name, Book title

    @Column(nullable = true)
    private UUID itemId; // optional — if linked to a centralized item DB

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category; // GAME, ANIME, MUSIC, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressStatus status; // PLANNED, COMPLETED, DROPPED, etc.

    @Column
    private Integer rating; // optional rating by user

    @Column(length = 1000)
    private String notes; // optional review/notes

    @Column(nullable = false)
    private Instant timestamp; // when this was added or updated
}
