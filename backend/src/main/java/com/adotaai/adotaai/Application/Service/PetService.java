package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.PetDTO;
import com.adotaai.adotaai.Domain.Entity.PetEntity;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Infraestructure.Repository.PetRepository;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<PetDTO> listarTodos() {
        List<PetEntity> pet = petRepository.findAll();
        return pet.stream().map(PetDTO::new).toList();
    }

    public void excluir(UUID id) {
        PetEntity pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        petRepository.delete(pet);
    }

    public PetDTO criarPet(PetDTO petDTO) {
        PetEntity pet = new PetEntity();
        BeanUtils.copyProperties(petDTO, pet);
        UsuarioEntity usuario = usuarioRepository.findById(petDTO.getUser_id())
                .orElseThrow(() -> new RuntimeException("Usuário não existe "));
        pet.setUser(usuario);

        pet = petRepository.save(pet);

        PetDTO dto = new PetDTO();
        BeanUtils.copyProperties(pet, dto);
        dto.setUser_id(pet.getUser().getId());
        return dto;
    }

    @Transactional
    public PetDTO atualizarPet(UUID id, PetDTO petDto) {
        PetEntity pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet não encontrado com ID: " + id));
        pet.setNome(petDto.getNome());
        pet.setStatus(petDto.getStatus());
        pet.setDescricao(petDto.getDescricao());
        pet.setDt_nasc(petDto.getDt_nasc());
        pet.setPorte(petDto.getPorte());
        pet.setRaca(petDto.getRaca());
        pet.setEspecie(petDto.getEspecie());
        pet.setLink_foto(petDto.getLink_foto());

        PetEntity petatualizado = petRepository.save(pet);

        return new PetDTO(petatualizado);

    }

}
