package com.example.auth.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.RSAKey;
import com.example.auth.model.User;
import com.example.auth.model.UserPrincipal;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.security.*;
import java.security.spec.*;
import java.time.Instant;
import java.util.*;


@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class JwtService {

    private final String PRIVATE_KEY_PATH = "keys/private.pem";
    private final String PUBLIC_KEY_PATH = "keys/public.pem";
    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 10; // 10 hours
    private PrivateKey privateKey;
    private PublicKey publicKey;
    private String keyId;

    @PostConstruct
    public void initKeys() throws Exception {
        // Correct initialization: load keys before setting fields
        this.privateKey = loadPrivateKey(); // Use a descriptive name like loadPrivateKey()
        this.publicKey = loadPublicKey();   // Use a descriptive name like loadPublicKey()
        this.keyId = new com.nimbusds.jose.jwk.RSAKey.Builder((java.security.interfaces.RSAPublicKey) publicKey).build().computeThumbprint().toString();
    }
    // The public accessor for JwtService.getPublicKey() that JwksController uses
    public PublicKey getPublicKey() {
        return publicKey; 
    }

    // The private accessor for JwtService.getPrivateKey() that generateToken uses
    private PrivateKey getPrivateKey() {
        return privateKey; 
    }

     public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        if (userDetails instanceof UserPrincipal principal) {
            User user = principal.getUser();
            claims.put("role", user.getRole().name());
            claims.put("id", user.getUserId().toString());
            claims.put("email", user.getEmail());
        }

        return Jwts.builder()
                .setClaims(claims)
                .setHeaderParam("kid", keyId)
                .setSubject(userDetails.getUsername())
                .setIssuer("watchbuddy-auth")
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public String getKeyId() {
        return keyId;
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // -----------------------
    // 🔑 Key loading
    // -----------------------

    // @SneakyThrows is generally discouraged, consider throwing checked exceptions or handling
    private PrivateKey loadPrivateKey() throws Exception {
         // UNCOMMENT or reimplement the original key loading logic here
         InputStream inputStream = new ClassPathResource(PRIVATE_KEY_PATH).getInputStream();
         String key = new String(inputStream.readAllBytes())
                 .replace("-----BEGIN PRIVATE KEY-----", "")
                 .replace("-----END PRIVATE KEY-----", "")
                 .replaceAll("\\s+", "");

         byte[] keyBytes = Base64.getDecoder().decode(key);
         PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
         KeyFactory factory = KeyFactory.getInstance("RSA");
         return factory.generatePrivate(spec);
    }

    private PublicKey loadPublicKey() throws Exception {
         // UNCOMMENT or reimplement the original key loading logic here
         InputStream inputStream = new ClassPathResource(PUBLIC_KEY_PATH).getInputStream();
         String key = new String(inputStream.readAllBytes())
                 .replace("-----BEGIN PUBLIC KEY-----", "")
                 .replace("-----END PUBLIC KEY-----", "")
                 .replaceAll("\\s+", "");

         byte[] keyBytes = Base64.getDecoder().decode(key);
         X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
         KeyFactory factory = KeyFactory.getInstance("RSA");
         return factory.generatePublic(spec);
    }
   

    



    
}
