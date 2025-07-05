package com.ong.db.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Habilita e usa a configuração de CORS definida no bean
                // corsConfigurationSource
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Desabilita o CSRF, que é uma proteção para aplicações web tradicionais, não
                // muito útil para APIs REST
                .csrf(csrf -> csrf.disable());

        // Aqui você pode adicionar outras regras de segurança, como autorização de
        // rotas
        // http.authorizeHttpRequests( ... );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite requisições da origem do seu frontend
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        // Permite os métodos HTTP que seu frontend usará
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permite todos os cabeçalhos
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Permite o envio de credenciais (como cookies), se necessário
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração de CORS para TODAS as rotas da sua aplicação ("/**")
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}