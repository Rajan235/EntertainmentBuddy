package com.example.auth.controller;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.KeyUse;

import java.security.interfaces.RSAPublicKey;
import java.util.Map;
import java.util.UUID;
import com.nimbusds.jose.jwk.RSAKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;


import com.example.auth.service.JwtService;

@RestController
public class JwksController {
    @Autowired
    JwtService jwtService;

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> getJwks() {
        RSAPublicKey publicKey = (RSAPublicKey) jwtService.getPublicKey();
        RSAKey key = new RSAKey.Builder(publicKey)
            .keyUse(KeyUse.SIGNATURE)
            .algorithm(JWSAlgorithm.RS256)
            .keyID(jwtService.getKeyId())
            .build();
        return Collections.singletonMap("keys", Collections.singletonList(key.toPublicJWK().toJSONObject()));
    }

}
