package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.EspecieDTO;
import com.adotaai.adotaai.Domain.Entity.EspecieEntity;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.adotaai.adotaai.Infraestructure.Repository.EspecieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EspecieService {

    @Autowired
    private EspecieRepository especieRepository;

    public List<EspecieDTO> listarTodas() {
        return especieRepository.findAllByFl_ativoTrue()
                .stream()
                .map(EspecieDTO::new)
                .toList();
    }

    public EspecieDTO buscarPorId(UUID id) {
        EspecieEntity entity = especieRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Espécie não encontrada com ID: " + id));
        return new EspecieDTO(entity);
    }

    @Transactional
    public EspecieDTO criar(EspecieDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new RegraDeNegocioException("O nome da espécie é obrigatório.");
        }
        if (especieRepository.existsByNome(dto.getNome().trim())) {
            throw new RegraDeNegocioException("Já existe uma espécie com o nome: " + dto.getNome());
        }
        EspecieEntity entity = new EspecieEntity();
        entity.setNome(dto.getNome().trim());
        entity.setFl_ativo(true);
        entity.setCreated_at(LocalDateTime.now());
        entity = especieRepository.save(entity);
        return new EspecieDTO(entity);
    }

    @Transactional
    public EspecieDTO atualizar(UUID id, EspecieDTO dto) {
        EspecieEntity entity = especieRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Espécie não encontrada com ID: " + id));

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            String nomeNormalizado = dto.getNome().trim();
            if (!entity.getNome().equalsIgnoreCase(nomeNormalizado)
                    && especieRepository.existsByNome(nomeNormalizado)) {
                throw new RegraDeNegocioException("Já existe uma espécie com o nome: " + nomeNormalizado);
            }
            entity.setNome(nomeNormalizado);
        }

        entity.setLast_modified_at(LocalDateTime.now());
        entity = especieRepository.save(entity);
        return new EspecieDTO(entity);
    }

    @Transactional
    public void excluir(UUID id) {
        EspecieEntity entity = especieRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Espécie não encontrada com ID: " + id));
        entity.setFl_ativo(false);
        entity.setLast_modified_at(LocalDateTime.now());
        especieRepository.save(entity);
    }
}
