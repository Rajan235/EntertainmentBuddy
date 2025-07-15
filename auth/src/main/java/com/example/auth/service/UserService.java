package com.example.auth.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {


     private final UserRepository userRepository;
     private final PasswordEncoder passwordEncoder;
    //  private final KafkaTemplate<String, String> kafkaTemplate;
    // private final ObjectMapper objectMapper;
    //  @Value("${kafka.topics.user-created}")
    // private String userCreatedTopic;

    
     public User saveUser(User user) {
         if (userRepository.existsByEmail(user.getEmail())) {
             throw new RuntimeException("Email already exists");
         }
         // Check if username already exists
 
         if (userRepository.existsByUsername(user.getUsername())) {
             throw new RuntimeException("Username already exists");
         }
        // Password encoding
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);

        // try {
        //     // UserCreatedEventDto event = new UserCreatedEventDto(
        //     //     savedUser.getUserId(),
        //     //     savedUser.getEmail(),
        //     //     savedUser.getRole()
        //     // );

        //     // String json = objectMapper.writeValueAsString(event);
        //     // JsonSchemaValidator.validate(json, schemaPath);
        //     // if (kafkaTemplate != null) {
        //     //     kafkaTemplate.send(userCreatedTopic, json);
        //     //     System.out.println("✅ Published user-created event: " + json);
        //     // } else {
        //     //     System.out.println("⚠️ Kafka is disabled. Skipping event publishing.");
        //     // }

        //     // System.out.println("✅ Published user-created event: " + json);
        // } catch (Exception e) {
        //     System.err.println("❌ Failed to publish user-created event: " + e.getMessage());
        // }

        return savedUser;
    }
    
}
