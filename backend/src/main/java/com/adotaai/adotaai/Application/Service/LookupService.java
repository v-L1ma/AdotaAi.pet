package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.RacaDTO;
import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import com.adotaai.adotaai.Infraestructure.Repository.RacaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LookupService {

    @Autowired
    private RacaRepository racaRepository;

    public List<RacaDTO> listarRacas() {
        List<RacaEntity> racas = racaRepository.findAllByOrderByNomeAsc();
        return racas.stream().map(RacaDTO::new).toList();
    }
}
