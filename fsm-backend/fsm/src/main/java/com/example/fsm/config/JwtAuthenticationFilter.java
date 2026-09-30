package com.example.fsm.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("Authorization Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();

        try {

            System.out.println("JWT Token received");

            if (!jwtService.isTokenValid(token)) {
                System.out.println("JWT Token is INVALID");

                filterChain.doFilter(request, response);
                return;
            }

            System.out.println("JWT Token is VALID");

            Long userId = jwtService.extractUserId(token);
            String identifier = jwtService.extractIdentifier(token);
            String role = jwtService.extractRole(token);

            System.out.println("User ID: " + userId);
            System.out.println("Identifier: " + identifier);
            System.out.println("Role: " + role);

            if (userId == null || identifier == null || role == null) {
                System.out.println("JWT claims are missing");

                filterChain.doFilter(request, response);
                return;
            }

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority("ROLE_" + role);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            identifier,
                            null,
                            List.of(authority)
                    );

            authentication.setDetails(userId);

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "Authentication set: "
                            + SecurityContextHolder
                            .getContext()
                            .getAuthentication()
            );

        } catch (Exception e) {

            System.out.println("JWT Authentication Error: " + e.getMessage());

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}