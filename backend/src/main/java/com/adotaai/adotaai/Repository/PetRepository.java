package com.adotaai.adotaai.Repository;

import com.adotaai.adotaai.Entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<PetEntity,Long> {
}
