package com.example.tracking.services;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.tracking.dto.TrackingRequestDto;
import com.example.tracking.dto.TrackingResponseDto;
import com.example.tracking.models.Category;
import com.example.tracking.models.ProgressStatus;
import com.example.tracking.models.TrackingEntry;
import com.example.tracking.repository.UserProgressRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Default is read-only
public class UserProgressService {  
    // This class will handle user progress tracking logic
    // Add methods to track, update, and retrieve user progress here

    private final UserProgressRepository repository;

     @Transactional
    public TrackingResponseDto createEntry(UUID userId, TrackingRequestDto requestDto) {
        TrackingEntry entry = TrackingEntry.builder()
                .userId(userId)
                .title(requestDto.getTitle())
                .category(requestDto.getCategory())
                .status(requestDto.getStatus())
                .rating(requestDto.getRating())
                .notes(requestDto.getNotes())
                .timestamp(Instant.now())
                .build();

        return TrackingResponseDto.from(repository.save(entry));
    }

    public List<TrackingResponseDto> getAll(UUID userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(TrackingResponseDto::from)
                .collect(Collectors.toList());
    }

    public TrackingResponseDto getTrackingEntryById(UUID userId, UUID entryId) {
        // SECURITY FIX: Must check ownership using findByIdAndUserId
        TrackingEntry entry = repository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Tracking entry not found for user: " + entryId));
        return TrackingResponseDto.from(entry);
    }

    @Transactional
    public TrackingResponseDto updateEntry(UUID userId, UUID entryId, TrackingRequestDto requestDto) {
        // SECURITY FIX: Must find by ID and UserID
        TrackingEntry entry = repository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Tracking entry not found for user: " + entryId));

        // Full update logic
        entry.setTitle(requestDto.getTitle());
        entry.setCategory(requestDto.getCategory());
        entry.setStatus(requestDto.getStatus());
        entry.setRating(requestDto.getRating());
        entry.setNotes(requestDto.getNotes());
        entry.setTimestamp(Instant.now());

        return TrackingResponseDto.from(repository.save(entry));
    }

    @Transactional
    public void deleteEntry(UUID userId, UUID entryId) {
        // SECURITY FIX: Must find by ID and UserID before deleting
        TrackingEntry entry = repository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Tracking entry not found for user: " + entryId));
        repository.delete(entry);
    }

    public List<TrackingResponseDto> getAllByCategory(UUID userId, Category category) {
        // SECURITY FIX: Uses the correct userId-filtered repository method
        return repository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(TrackingResponseDto::from)
                .collect(Collectors.toList());
    }

    public List<TrackingResponseDto> getByStatus(UUID userId, Category category, ProgressStatus status) {
        // SECURITY FIX: Uses the correct userId-filtered repository method
        return repository.findByUserIdAndCategoryAndStatus(userId, category, status)
                .stream()
                .map(TrackingResponseDto::from)
                .collect(Collectors.toList());
    }
    
    public List<TrackingResponseDto> getAllByStatus(UUID userId, ProgressStatus status) {
        // Since no findByUserIdAndStatus exists, we fetch all by user and filter, or
        // ideally, you would add `findByUserIdAndStatus` to the repository.
        // Assuming the repository method `findByUserIdAndStatus` is added for best performance:
        // return repository.findByUserIdAndStatus(userId, status)
        // ...
        
        // As a temporary fix relying on findByUserId and filtering in memory (less ideal performance):
        return repository.findByUserId(userId)
                .stream()
                .filter(e -> e.getStatus() == status)
                .map(TrackingResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TrackingResponseDto patchEntry(UUID userId, UUID entryId, TrackingRequestDto requestDto) {
        // SECURITY FIX: Must find by ID and UserID
        TrackingEntry entry = repository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Tracking entry not found for user: " + entryId));

        // Partial update logic: only update fields that are not null in the request DTO
        if (requestDto.getTitle() != null) entry.setTitle(requestDto.getTitle());
        if (requestDto.getCategory() != null) entry.setCategory(requestDto.getCategory());
        if (requestDto.getStatus() != null) entry.setStatus(requestDto.getStatus());
        if (requestDto.getRating() != null) entry.setRating(requestDto.getRating());
        if (requestDto.getNotes() != null) entry.setNotes(requestDto.getNotes());
        
        entry.setTimestamp(Instant.now());

        return TrackingResponseDto.from(repository.save(entry));
    }

    
    

    

   

    public long countByStatus(UUID userId, Category category, ProgressStatus status) {
        return repository.countByUserIdAndCategoryAndStatus(userId, category, status);
    }

    
   
}
