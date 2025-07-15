package com.example.auth.service;

import com.example.auth.model.User;
import com.example.auth.model.UserPrincipal;
import com.example.auth.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService{
    // Implement the methods required by UserDetailsService
    // For example, loadUserByUsername(String username) to fetch user details from the database
    // This method should return a UserDetails object containing user information
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Fetch user from the repository
        User user = userRepository.findByUsername(usernameOrEmail);
        if (user == null) {
            user = userRepository.findByEmail(usernameOrEmail);
        }
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + usernameOrEmail);
        }
        return new UserPrincipal(user);



}
}