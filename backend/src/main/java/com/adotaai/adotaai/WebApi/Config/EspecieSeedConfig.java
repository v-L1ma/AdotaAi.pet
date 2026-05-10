package com.adotaai.adotaai.WebApi.Config;

import com.adotaai.adotaai.Domain.Entity.EspecieEntity;
import com.adotaai.adotaai.Infraestructure.Repository.EspecieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class EspecieSeedConfig {

    @Bean
    @Order(1)
    CommandLineRunner seedEspecies(EspecieRepository especieRepository) {
        return args -> {
            seedIfNotExists(especieRepository, "Cão");
            seedIfNotExists(especieRepository, "Gato");
        };
    }

    private void seedIfNotExists(EspecieRepository repository, String nome) {
        if (repository.existsByNome(nome)) {
            return;
        }

        EspecieEntity especie = new EspecieEntity();
        especie.setNome(nome);
        repository.save(especie);
    }
}