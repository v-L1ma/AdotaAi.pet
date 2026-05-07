package com.adotaai.adotaai.WebApi.Config;

import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import com.adotaai.adotaai.Domain.Entity.EspecieEntity;
import com.adotaai.adotaai.Infraestructure.Repository.EspecieRepository;
import com.adotaai.adotaai.Infraestructure.Repository.RacaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class RacaSeedConfig {

    @Bean
    @Order(2)
    CommandLineRunner seedRacas(RacaRepository racaRepository, EspecieRepository especieRepository) {
        return args -> {
            seedIfNotExists(racaRepository, especieRepository, "Labrador Retriever", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Golden Retriever", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Pastor Alemão", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Bulldog Francês", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Poodle", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Shih Tzu", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Yorkshire Terrier", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Rottweiler", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Pinscher", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Border Collie", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Dachshund", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Boxer", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Beagle", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Chihuahua", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Husky Siberiano", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Doberman", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Maltês", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Cocker Spaniel", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Pit Bull", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Sem Raça Definida (SRD)", "Cão");
            seedIfNotExists(racaRepository, especieRepository, "Siamês", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Persa", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Maine Coon", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Angorá", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Ragdoll", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "British Shorthair", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Bengal", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Sphynx", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Munchkin", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Azul Russo", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Bombay", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Scottish Fold", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Birmanês", "Gato");
            seedIfNotExists(racaRepository, especieRepository, "Sem Raça Definida (SRD)", "Gato");
        };
    }

    private void seedIfNotExists(
            RacaRepository repository,
            EspecieRepository especieRepository,
            String nome,
            String especieNome
    ) {
        EspecieEntity especie = especieRepository.findByNomeIgnoreCase(especieNome).orElse(null);
        if (especie == null) {
            return;
        }

        if (repository.existsByNomeAndEspecie_Id(nome, especie.getId())) {
            return;
        }

        RacaEntity raca = new RacaEntity();
        raca.setNome(nome);
        raca.setEspecie(especie);
        repository.save(raca);
    }
}
