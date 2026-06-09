package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.RacaDTO;
import com.adotaai.adotaai.Domain.Entity.EspecieEntity;
import com.adotaai.adotaai.Domain.Entity.RacaEntity;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.adotaai.adotaai.Infraestructure.Repository.EspecieRepository;
import com.adotaai.adotaai.Infraestructure.Repository.RacaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RacaService {

    @Autowired
    private RacaRepository racaRepository;

    @Autowired
    private EspecieRepository especieRepository;

    public List<RacaDTO> listarTodas(UUID especieId) {
        List<RacaEntity> racas;
        if (especieId != null) {
            racas = racaRepository.findByFl_ativoTrueAndEspecie_IdOrderByNomeAsc(especieId);
        } else {
            racas = racaRepository.findAllByFl_ativoTrueOrderByNomeAsc();
        }
        return racas.stream().map(RacaDTO::new).toList();
    }

    public RacaDTO buscarPorId(UUID id) {
        RacaEntity entity = racaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Raça não encontrada com ID: " + id));
        return new RacaDTO(entity);
    }

    @Transactional
    public RacaDTO criar(RacaDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new RegraDeNegocioException("O nome da raça é obrigatório.");
        }
        if (dto.getEspecieId() == null) {
            throw new RegraDeNegocioException("A espécie é obrigatória.");
        }

        EspecieEntity especie = especieRepository.findById(dto.getEspecieId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Espécie não encontrada com ID: " + dto.getEspecieId()));

        if (racaRepository.existsByNomeAndEspecie_Id(dto.getNome().trim(), dto.getEspecieId())) {
            throw new RegraDeNegocioException("Já existe uma raça com este nome para a espécie selecionada.");
        }

        RacaEntity entity = new RacaEntity();
        entity.setNome(dto.getNome().trim());
        entity.setEspecie(especie);
        entity.setFl_ativo(true);
        entity.setCreated_at(LocalDateTime.now());
        entity = racaRepository.save(entity);
        return new RacaDTO(entity);
    }

    @Transactional
    public RacaDTO atualizar(UUID id, RacaDTO dto) {
        RacaEntity entity = racaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Raça não encontrada com ID: " + id));

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            String nomeNormalizado = dto.getNome().trim();
            UUID especieId = dto.getEspecieId() != null ? dto.getEspecieId() : entity.getEspecieId();
            if (!entity.getNome().equalsIgnoreCase(nomeNormalizado)
                    || (dto.getEspecieId() != null && !entity.getEspecieId().equals(dto.getEspecieId()))) {
                if (racaRepository.existsByNomeAndEspecie_Id(nomeNormalizado, especieId)) {
                    throw new RegraDeNegocioException("Já existe uma raça com este nome para a espécie selecionada.");
                }
            }
            entity.setNome(nomeNormalizado);
        }

        if (dto.getEspecieId() != null) {
            EspecieEntity especie = especieRepository.findById(dto.getEspecieId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Espécie não encontrada com ID: " + dto.getEspecieId()));
            entity.setEspecie(especie);
        }

        entity.setLast_modified_at(LocalDateTime.now());
        entity = racaRepository.save(entity);
        return new RacaDTO(entity);
    }

    @Transactional
    public void excluir(UUID id) {
        RacaEntity entity = racaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Raça não encontrada com ID: " + id));
        entity.setFl_ativo(false);
        entity.setLast_modified_at(LocalDateTime.now());
        racaRepository.save(entity);
    }
}
