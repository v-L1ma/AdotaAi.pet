package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.PerguntaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PerguntaRepository extends JpaRepository<PerguntaEntity, UUID> {
}
