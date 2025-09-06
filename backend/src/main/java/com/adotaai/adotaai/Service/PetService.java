package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.PetDTO;
import com.adotaai.adotaai.Entity.PetEntity;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.PetRepository;
import com.adotaai.adotaai.Repository.UsuarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<PetDTO> listarTodos()
    {
        List<PetEntity> pet = petRepository.findAll();
        return pet.stream().map(PetDTO::new).toList();
    }

    public void excluir(Long id) {
        PetEntity pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        petRepository.delete(pet);
    }

    public PetDTO criarPet(PetDTO petDTO) {
        PetEntity pet = new PetEntity();
        BeanUtils.copyProperties(petDTO, pet);

        // associa o usuário
        UsuarioEntity usuario = usuarioRepository.findById(petDTO.getUser_id())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + petDTO.getUser_id()));
        pet.setUser(usuario);

        pet = petRepository.save(pet);

        PetDTO dto = new PetDTO();
        BeanUtils.copyProperties(pet, dto);
        dto.setUser_id(pet.getUser().getId());

        return dto;
    }

//    // READ ALL
//    public List<PetDTO> listarTodos() {
//        return petRepository.findAll().stream().map(pet -> {
//            PetDTO dto = new PetDTO();
//            BeanUtils.copyProperties(pet, dto);
//            dto.setUser_id(pet.getUser().getId());
//            return dto;
//        }).collect(Collectors.toList());
//    }

}
