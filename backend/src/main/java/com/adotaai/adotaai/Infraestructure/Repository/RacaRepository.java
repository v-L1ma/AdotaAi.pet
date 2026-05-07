package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RacaRepository extends JpaRepository<RacaEntity, UUID> {

    List<RacaEntity> findAllByOrderByNomeAsc();

    List<RacaEntity> findByEspecieNomeIgnoreCaseOrderByNomeAsc(String especie);

    List<RacaEntity> findByEspecie_IdOrderByNomeAsc(UUID especieId);

    boolean existsByNomeAndEspecie_Id(String nome, UUID especieId);
}
