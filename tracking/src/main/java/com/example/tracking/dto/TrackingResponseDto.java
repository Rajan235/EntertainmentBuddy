package com.example.tracking.dto;




import lombok.Builder;
import lombok.Data;

import java.util.UUID;


import com.example.tracking.models.ProgressStatus;
import com.example.tracking.models.Category;
import com.example.tracking.models.TrackingEntry;

@Data
@Builder
public class TrackingResponseDto {
    private UUID id;
    private UUID userId;
    private String title;
    private Category category;
    private ProgressStatus status;
    private Integer rating;
    private String notes;

    public static TrackingResponseDto from(TrackingEntry entry) {
        return TrackingResponseDto.builder()
                .id(entry.getId())
                .userId(entry.getUserId())
                .title(entry.getTitle())
                .category(entry.getCategory())
                .status(entry.getStatus())
                .rating(entry.getRating())
                .notes(entry.getNotes())
                .build();
    }
}
