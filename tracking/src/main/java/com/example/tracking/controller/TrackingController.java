package com.example.tracking.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tracking.dto.TrackingRequestDto;
import com.example.tracking.dto.TrackingResponseDto;
import com.example.tracking.services.UserProgressService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@Tag(name = "Tracking", description = "Manage user progress tracking for learning & activities")

public class TrackingController {
    private final UserProgressService userProgressService;
    
    private UUID getCurrentUserId() {
        return (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
    // Add methods to handle HTTP requests for tracking user progress
    @PostMapping
    @Operation(summary = "Create a new tracking entry for the authenticated user")
    public ResponseEntity<TrackingResponseDto> createEntry(
            @Valid @RequestBody TrackingRequestDto requestDto) {

        UUID userId = getCurrentUserId();
        TrackingResponseDto createdEntry = userProgressService.createEntry(userId, requestDto);
        return ResponseEntity.ok(createdEntry);
    }

    @GetMapping
    @Operation(summary = "Get all tracking entries for the authenticated user")
    public ResponseEntity<List<TrackingResponseDto>> getAllEntries() {
        UUID userId = getCurrentUserId();
        List<TrackingResponseDto> entries = userProgressService.getAll(userId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific tracking entry by ID")
    public ResponseEntity<TrackingResponseDto> getEntryById(@PathVariable UUID id) {
        UUID userId = getCurrentUserId();
        TrackingResponseDto entry = userProgressService.getTrackingEntryById(userId, id);
        return ResponseEntity.ok(entry);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing tracking entry by ID")
    public ResponseEntity<TrackingResponseDto> updateEntry(
            @PathVariable UUID id,
            @Valid @RequestBody TrackingRequestDto requestDto) {

        UUID userId = getCurrentUserId();
        TrackingResponseDto updated = userProgressService.updateEntry(userId, id, requestDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tracking entry by ID")
    public ResponseEntity<Void> deleteEntry(@PathVariable UUID id) {
        UUID userId = getCurrentUserId();
        userProgressService.deleteEntry(userId, id);
        return ResponseEntity.noContent().build();
    }



    
}
