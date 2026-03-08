package com.adotaai.adotaai.Infraestructure.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adotaai.adotaai.Domain.Entity.EventoEntity;

import java.util.UUID;

@Repository
public interface EventoRepository extends JpaRepository<EventoEntity, UUID> {

}
