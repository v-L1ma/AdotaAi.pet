package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.PetDTO;
import com.adotaai.adotaai.Entity.PetEntity;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.adotaai.adotaai.Repository.UsuarioRepository;


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

//    public void inserir(PetDTO pet)
//    {
//        PetEntity PetEntity= new PetEntity(pet);
//
//        petRepository.save(PetEntity);
//    }

    public PetEntity createPet(PetDTO dto) {

        PetEntity pet = new PetEntity(dto);

        return petRepository.save(pet);
    }

    public void excluir(Long id) {
        PetEntity pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        petRepository.delete(pet);
    }

}
