package com.example.auth.dto;

import java.util.UUID;

import com.example.auth.model.Role;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor

public class UserDto {
    private UUID userId;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;   

    @NotNull(message = "Role must be specified")
    
    private Role role; // Assuming role is a string, you might want to change this to an enum or a specific type if needed
}
