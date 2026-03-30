package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RacaRepository extends JpaRepository<RacaEntity, UUID> {

    List<RacaEntity> findAllByOrderByNomeAsc();

    boolean existsByNomeAndEspecie(String nome, String especie);
}
