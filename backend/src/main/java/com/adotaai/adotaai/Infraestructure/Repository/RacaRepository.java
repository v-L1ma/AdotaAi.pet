package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RacaRepository extends JpaRepository<RacaEntity, UUID> {

    List<RacaEntity> findAllByOrderByNomeAsc();

    List<RacaEntity> findByEspecieNomeIgnoreCaseOrderByNomeAsc(String especie);

    @Query("SELECT r FROM RacaEntity r WHERE r.fl_ativo = true AND r.especie.id = :especieId ORDER BY r.nome ASC")
    List<RacaEntity> findByFl_ativoTrueAndEspecie_IdOrderByNomeAsc(UUID especieId);

    @Query("SELECT r FROM RacaEntity r WHERE r.fl_ativo = true ORDER BY r.nome ASC")
    List<RacaEntity> findAllByFl_ativoTrueOrderByNomeAsc();

    boolean existsByNomeAndEspecie_Id(String nome, UUID especieId);
}
