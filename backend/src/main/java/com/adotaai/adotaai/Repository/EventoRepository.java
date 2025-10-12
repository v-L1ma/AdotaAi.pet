package com.adotaai.adotaai.Repository;

import com.adotaai.adotaai.Entity.EventoEntity;
import com.adotaai.adotaai.Entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository<EventoEntity, Long> {


}
