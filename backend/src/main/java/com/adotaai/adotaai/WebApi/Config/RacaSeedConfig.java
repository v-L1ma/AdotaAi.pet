package com.adotaai.adotaai.WebApi.Config;

import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import com.adotaai.adotaai.Infraestructure.Repository.RacaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RacaSeedConfig {

    @Bean
    CommandLineRunner seedRacas(RacaRepository racaRepository) {
        return args -> {
            seedIfNotExists(racaRepository, "Labrador Retriever", "cachorro");
            seedIfNotExists(racaRepository, "Vira-lata", "cachorro");
            seedIfNotExists(racaRepository, "Shih Tzu", "cachorro");
            seedIfNotExists(racaRepository, "Siamês", "gato");
            seedIfNotExists(racaRepository, "Persa", "gato");
            seedIfNotExists(racaRepository, "SRD", "gato");
        };
    }

    private void seedIfNotExists(RacaRepository repository, String nome, String especie) {
        if (repository.existsByNomeAndEspecie(nome, especie)) {
            return;
        }

        RacaEntity raca = new RacaEntity();
        raca.setNome(nome);
        raca.setEspecie(especie);
        repository.save(raca);
    }
}
