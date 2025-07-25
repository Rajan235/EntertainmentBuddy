package com.example.tracking.dto;



import com.example.tracking.models.Category;
import com.example.tracking.models.ProgressStatus;

import jakarta.validation.constraints.*;
import lombok.Data;


@Data
public class TrackingRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Status is required")
    private ProgressStatus status;

    @Min(value = 0, message = "Rating must be between 0 and 10")
    @Max(value = 10, message = "Rating must be between 0 and 10")
    private Integer rating;

    private String notes;
}

