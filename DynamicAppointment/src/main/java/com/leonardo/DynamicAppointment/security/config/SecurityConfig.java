package com.leonardo.DynamicAppointment.security.config;

import com.leonardo.DynamicAppointment.security.jwt.JwtAuthenticationFilter;
import com.leonardo.DynamicAppointment.security.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(customizer -> customizer.disable());
        httpSecurity.cors(Customizer.withDefaults());
        httpSecurity.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        httpSecurity.authorizeHttpRequests(request -> request
                // Auth endpoints - public
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/error").permitAll()

                // Professionals - GET public (guests see professionals), write operations admin-only
                .requestMatchers(HttpMethod.GET, "/api/professionals", "/api/professionals/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/professionals").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/professionals/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/professionals/{id}").hasRole("ADMIN")

                // Services - GET public (guests see services), write operations admin-only
                .requestMatchers(HttpMethod.GET, "/api/services", "/api/services/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/services").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/services/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/services/{id}").hasRole("ADMIN")

                // Appointments - guest endpoints public, management admin-only
                .requestMatchers(HttpMethod.POST, "/api/appointments").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/appointments/availability").permitAll()
                .requestMatchers("/api/appointments/guest/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/appointments/scheduled").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/appointments/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/appointments/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/appointments/{id}").hasRole("ADMIN")

                .anyRequest().authenticated()
        );

        httpSecurity.addFilterBefore(
                new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService),
                UsernamePasswordAuthenticationFilter.class
        );

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}