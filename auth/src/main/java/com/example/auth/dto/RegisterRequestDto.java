package com.example.auth.dto;

import com.example.auth.model.Role;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequestDto {
    @NotBlank(message = "Username is required" )
    private String username;

    @Email(message = "Email is invalid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotNull(message = "Role must be specified")
    
    private Role role; // Assuming role is a string, you might want to change this to an enum or a specific type if needed
    
}
