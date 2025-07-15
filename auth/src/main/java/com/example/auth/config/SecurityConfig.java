package com.example.auth.config;

import com.example.auth.service.MyUserDetailService;
import com.example.auth.config.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration  
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	// it is the object of myuserdetailesService which implements UserDetailsService
	private final MyUserDetailService userDetailsService;
    private final JwtFilter jwtFilter;
	
	
	

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http
         .csrf(csrf -> csrf.disable())
		 .authorizeHttpRequests(auth -> auth
			.requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()
                .anyRequest().authenticated()
        )
		.sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(exception -> exception
            .authenticationEntryPoint((request, response, authException) -> {
                 response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\": \"Unauthorized\"}");
                })
            .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Access Denied\"}");
                })
            )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);


		return http.build();
	}

	
    @Bean
    public AuthenticationProvider authProvider() {
    	// This method configures the authentication provider with the user details service and password encoder
    	// It is used to authenticate users based on their credentials
    	
    	// Create a DaoAuthenticationProvider instance          
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService); 
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
	
	

	
	/*
	 * @Bean public UserDetailsService userDetailsService() {
	 * 
	 * UserDetails user=User .withDefaultPasswordEncoder() .username("navin")
	 * .password("n@123") .roles("USER") .build();
	 * 
	 * UserDetails admin=User .withDefaultPasswordEncoder() .username("admin")
	 * .password("admin@789") .roles("ADMIN") .build();
	 * 
	 * return new InMemoryUserDetailsManager(user,admin); }
	 */

}
