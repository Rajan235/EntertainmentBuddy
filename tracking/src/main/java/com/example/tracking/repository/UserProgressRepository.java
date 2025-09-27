package com.example.tracking.repository;

import com.example.tracking.models.Category;
import com.example.tracking.models.ProgressStatus;
import com.example.tracking.models.TrackingEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserProgressRepository extends JpaRepository<
        TrackingEntry, UUID> {
    // Custom query methods can be defined here if needed
    List<TrackingEntry> findByUserId(UUID userId);
    List<TrackingEntry> findByCategory(Category category);
    List<TrackingEntry> findByStatus(ProgressStatus status);
    List<TrackingEntry> findByUserIdAndCategory(UUID userId, Category category);
    List<TrackingEntry> findByUserIdAndCategoryAndStatus(UUID userId, Category category, ProgressStatus status);
    Optional<TrackingEntry> findByIdAndUserId(UUID entryId, UUID userId);
    long countByUserIdAndCategoryAndStatus(UUID userId, Category category, ProgressStatus status);
    
    

   

}
