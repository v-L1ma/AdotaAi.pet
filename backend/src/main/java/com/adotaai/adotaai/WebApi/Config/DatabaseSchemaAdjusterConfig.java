package com.adotaai.adotaai.WebApi.Config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Configuration
public class DatabaseSchemaAdjusterConfig {

    @Bean
    public ApplicationRunner relaxUsuarioNullableColumns(JdbcTemplate jdbcTemplate) {
        return args -> {
            List<String> colunasNaoObrigatorias = List.of(
                    "telefone",
                    "link_foto",
                    "endereco",
                    "cep",
                    "bairro",
                    "cidade",
                    "sg_estado"
            );

            for (String coluna : colunasNaoObrigatorias) {
                String isNullable = jdbcTemplate.query(
                        "SELECT is_nullable FROM information_schema.columns WHERE table_name = 'usuario' AND column_name = ?",
                        ps -> ps.setString(1, coluna),
                        rs -> rs.next() ? rs.getString("is_nullable") : null
                );

                if ("NO".equalsIgnoreCase(isNullable)) {
                    jdbcTemplate.execute("ALTER TABLE usuario ALTER COLUMN " + coluna + " DROP NOT NULL");
                }
            }
        };
    }
}
