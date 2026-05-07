package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.EspecieDTO;
import com.adotaai.adotaai.Application.DTO.RacaDTO;
import com.adotaai.adotaai.Domain.Entity.EspecieEntity;
import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import com.adotaai.adotaai.Infraestructure.Repository.EspecieRepository;
import com.adotaai.adotaai.Infraestructure.Repository.RacaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LookupService {

    @Autowired
    private RacaRepository racaRepository;

    @Autowired
    private EspecieRepository especieRepository;

    public List<RacaDTO> listarRacas(UUID especieId) {
        List<RacaEntity> racas;
        if (especieId != null) {
            racas = racaRepository.findByEspecie_IdOrderByNomeAsc(especieId);
        } else {
            racas = racaRepository.findAllByOrderByNomeAsc();
        }
        return racas.stream().map(RacaDTO::new).toList();
    }

    public List<EspecieDTO> listarEspecies() {
        List<EspecieEntity> especies = especieRepository.findAll();
        return especies.stream().map(EspecieDTO::new).toList();
    }
}
