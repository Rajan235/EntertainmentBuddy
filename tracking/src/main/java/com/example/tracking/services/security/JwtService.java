package com.example.tracking.services.security;

import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.JWKSelector;
import com.nimbusds.jose.jwk.JWKMatcher;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.util.DefaultResourceRetriever;
// import com.nimbusds.jose.jwk.source.SecurityContext; // Removed, not needed
import io.jsonwebtoken.*;
import io.jsonwebtoken.SigningKeyResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.security.Key;
import java.security.PublicKey;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {

    // Store the JWKS client, configured with the Auth Service URL
    private final JWKSource<?> jwkSource;
    
    // In-memory cache for resolved PublicKeys
    private final ConcurrentHashMap<String, PublicKey> keyCache = new ConcurrentHashMap<>();

    // The key ID for the User ID claim used by the Auth Service
    private static final String USER_ID_CLAIM = "id"; 

    // Inject the base URL of your Authorization Server (Auth Service)
    public JwtService(@Value("${auth.jwks.url}") String jwksUrl) throws Exception {
        // 1. Configure the JWKS source to fetch keys from the Auth Service's JWKS endpoint
        URL jwksURL = new URL(jwksUrl);
        
        // Optional: configure resource retriever for timeouts/headers
        DefaultResourceRetriever resourceRetriever = new DefaultResourceRetriever(
                10000, // Connect timeout (10 seconds)
                10000  // Read timeout (10 seconds)
        );
        
        // RemoteJWKSet handles key fetching, parsing, and caching.
        this.jwkSource = new RemoteJWKSet<>(jwksURL, resourceRetriever);
    }

    // A SigningKeyResolver implementation that handles fetching and caching the key
    private final SigningKeyResolver signingKeyResolver = new SigningKeyResolver() {
        
        @Override
        public Key resolveSigningKey(JwsHeader header, Claims claims) {
            String kid = header.getKeyId();
            if (kid == null) {
                throw new JwtException("Token must contain a Key ID (kid) in its header.");
            }
            
            // 1. Check local cache first
            if (keyCache.containsKey(kid)) {
                return keyCache.get(kid);
            }

            // 2. If not in cache, fetch using the JWKSource
            try {
                // Find the key in the remote JWKS set.
                // It's crucial to ensure the Key Use (sig) and Algorithm (RS256) match.
                com.nimbusds.jose.jwk.JWK jwk = jwkSource.get(
                    new com.nimbusds.jose.jwk.JWKSelector(
                        new com.nimbusds.jose.jwk.JWKMatcher.Builder().keyID(kid).build()
                    ),
                    null // SecurityContext not needed here
                ).get(0); // Get the first matching key

                // Convert the Nimbus JWK to a Java Public Key
                PublicKey publicKey = jwk.toRSAKey().toPublicKey();
                
                // 3. Cache the resolved key
                keyCache.put(kid, publicKey);
                return publicKey;
                
            } catch (Exception e) {
                // If fetching/parsing fails, treat as invalid token
                throw new JwtException("Failed to retrieve public key for kid: " + kid, e);
            }
        }

        @Override
        public Key resolveSigningKey(JwsHeader header, String plaintext) {
            // Not used for JWS (signed JWTs)
            return null;
        }
    };


    public UUID extractUserId(String token) {
        Claims claims = parseToken(token);
        // CRITICAL FIX: Use the correct claim name "id"
        return UUID.fromString(claims.get(USER_ID_CLAIM, String.class));
    }

    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException e) {
            // Log the exception for debugging purposes (e.g., expired, bad signature, etc.)
            System.err.println("JWT Validation Failed: " + e.getMessage());
            return false;
        }
    }

    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                    // Set the dynamic resolver
                    .setSigningKeyResolver(signingKeyResolver)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
    }
}


   
  