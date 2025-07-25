package com.example.tracking.config;




import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.UUID;

public class TrackingAuthentication extends AbstractAuthenticationToken {

    private final UUID userId;

    public TrackingAuthentication(UUID userId) {
        super(null);
        this.userId = userId;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public UUID getPrincipal() {
        return userId;
    }
}
