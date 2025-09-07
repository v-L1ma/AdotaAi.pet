package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.PetDTO;
import com.adotaai.adotaai.Entity.PetEntity;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.PetRepository;
import com.adotaai.adotaai.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
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
    public PetDTO atualizarPet(Long id, PetDTO petDto){
        PetEntity pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet não encontrado com ID: " + id));
        pet.setNome(petDto.getNome());
        pet.setAdotado(petDto.getAdotado());
        pet.setDescricao(petDto.getDescricao());
        pet.setTipo(petDto.getTipo());
        pet.setRaca(petDto.getRaca());
        pet.setPorte(petDto.getPorte());
        pet.setIdade(petDto.getIdade());
        pet.setVacinado(petDto.getVacinado());

        PetEntity petatualizado= petRepository.save(pet);

        return  new PetDTO(petatualizado);

    }

}
