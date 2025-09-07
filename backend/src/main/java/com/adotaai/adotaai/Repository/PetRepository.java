package com.adotaai.adotaai.Repository;

import com.adotaai.adotaai.Entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.yaml.snakeyaml.events.Event;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<PetEntity,Long> {
    void deleteByUserId(Long userId);

}
