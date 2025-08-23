package com.example.tracking.services;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.tracking.dto.TrackingRequestDto;
import com.example.tracking.dto.TrackingResponseDto;
import com.example.tracking.models.Category;
import com.example.tracking.models.ProgressStatus;
import com.example.tracking.models.TrackingEntry;
import com.example.tracking.repository.UserProgressRepository;





import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


import java.util.List;
import java.util.UUID;


@Service
public class UserProgressService {
    // This class will handle user progress tracking logic
    // Add methods to track, update, and retrieve user progress here

    UserProgressRepository userProgressRepository;

    public TrackingResponseDto createEntry(UUID userId, TrackingRequestDto request) {
        // TODO: validate duplicate titles per user+category
        TrackingEntry entry = TrackingEntry.builder()
                .userId(userId)
                .title(request.getTitle())
                .category(request.getCategory())
                .status(request.getStatus())
                .rating(request.getRating())
                .notes(request.getNotes())
                .build();
        TrackingEntry saved = userProgressRepository.save(entry);
        return TrackingResponseDto.from(saved);
    }

    public List<TrackingResponseDto> getAllByCategory(UUID userId, Category category) {
        return userProgressRepository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(TrackingResponseDto::from)
                .collect(Collectors.toList());
    }

    public List<TrackingResponseDto> getByStatus(UUID userId, Category category, ProgressStatus status) {
        return userProgressRepository.findByUserIdAndCategoryAndStatus(userId, category, status)
                .stream()
                .map(TrackingResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteEntry(UUID userId, UUID entryId) {
        TrackingEntry entry = userProgressRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));
        userProgressRepository.delete(entry);
    }

    @Transactional
    public TrackingResponseDto updateEntry(UUID userId, UUID entryId, TrackingRequestDto request) {
        TrackingEntry entry = userProgressRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        entry.setStatus(request.getStatus());
        entry.setRating(request.getRating());
        entry.setNotes(request.getNotes());
        return TrackingResponseDto.from(entry);
    }

    @Transactional
public TrackingResponseDto patchEntry(UUID userId, UUID entryId, TrackingRequestDto request) {
    TrackingEntry entry = userProgressRepository.findByIdAndUserId(entryId, userId)
            .orElseThrow(() -> new RuntimeException("Entry not found"));

    // Update only non-null fields from request DTO
    if (request.getStatus() != null) {
        entry.setStatus(request.getStatus());
    }
    if (request.getRating() != null) {
        entry.setRating(request.getRating());
    }
    if (request.getNotes() != null) {
        entry.setNotes(request.getNotes());
    }
    if (request.getTitle() != null) {
        entry.setTitle(request.getTitle());
    }
    if (request.getCategory() != null) {
        entry.setCategory(request.getCategory());
    }

    // Save the updated entry
    TrackingEntry saved = userProgressRepository.save(entry);

    return TrackingResponseDto.from(saved);
}

    public long countByStatus(UUID userId, Category category, ProgressStatus status) {
        return userProgressRepository.countByUserIdAndCategoryAndStatus(userId, category, status);
    }

    public List<TrackingResponseDto> getAll(UUID userId) {
        return userProgressRepository.findByUserId(userId)
                .stream()
                .map(TrackingResponseDto::from)
                .collect(Collectors.toList());
    }
    public TrackingResponseDto getTrackingEntryById(UUID userId , UUID entryId) {
        return userProgressRepository.findByIdAndUserId(userId, entryId)
                .stream()
                .map(TrackingResponseDto::from)
                .orElseThrow(() -> new RuntimeException("Entry not found"));
    }
}
