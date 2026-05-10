package com.adotaai.adotaai.WebApi.Config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.adotaai.adotaai.Infraestructure.Security.JwtAuthFilter;
import com.adotaai.adotaai.Infraestructure.Security.CadastroCompletoFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CadastroCompletoFilter cadastroCompletoFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CadastroCompletoFilter cadastroCompletoFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.cadastroCompletoFilter = cadastroCompletoFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)  // stateless JWT API — CSRF não é aplicável
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/esqueci-senha").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/resetar-senha").permitAll()
                .requestMatchers(HttpMethod.POST, "/usuario").permitAll()
                .requestMatchers(HttpMethod.GET, "/lookups/racas").permitAll()
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/pets").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.GET, "/pets/pendentes").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/pets/*/aprovar").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/pets/*/reprovar").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/eventos/pendentes").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/eventos/*/aprovar").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/eventos/*/reprovar").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/usuario/admin/usuarios").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/usuario/admin/*/ativar").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/usuario/admin/*/desativar").hasRole("ADMINISTRADOR")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Acesso negado. Apenas administradores podem acessar este recurso.\"}");
                })
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(cadastroCompletoFilter, JwtAuthFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // TODO: restrict to specific origins in production (e.g., your mobile app domain)
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
