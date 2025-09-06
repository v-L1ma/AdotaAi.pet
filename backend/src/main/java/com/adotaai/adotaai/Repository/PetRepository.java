package com.adotaai.adotaai.Repository;

import com.adotaai.adotaai.Entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<PetEntity,Long> {
    void deleteByUserId(Long userId);

    List<PetEntity> findByUserId(Long userId);
}
