package com.adotaai.adotaai.WebApi.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("Bearer Token",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Insira o token JWT recebido após o login")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Token"))
                .info(new Info()
                        .title("AdotaAi API")
                        .version("1.0.0")
                        .description("API para plataforma de adoção de animais de estimação")
                        .contact(new Contact()
                                .name("AdotaAi")
                                .url("https://adotaai.com")));
    }
}
