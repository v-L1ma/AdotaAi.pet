package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.UsuarioDTO;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.PetRepository;
import com.adotaai.adotaai.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private  PetRepository petRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PetRepository petRepository) {
        this.usuarioRepository = usuarioRepository;
        this.petRepository = petRepository;
    }

    public List<UsuarioDTO> listarTodos()
    {
        List<UsuarioEntity> usuario = usuarioRepository.findAll();
        return usuario.stream().map(UsuarioDTO::new).toList();
    }

    public void inserir(UsuarioDTO usuario)
    {
        UsuarioEntity usuarioEntity= new UsuarioEntity(usuario);

        usuarioRepository.save(usuarioEntity);
    }

    public void alterar(UsuarioDTO usuario)
    {
        UsuarioEntity usuarioEntity = new UsuarioEntity(usuario);
        new UsuarioDTO(usuarioRepository.save(usuarioEntity));
    }

    @Transactional
    public void excluir(Long id)
    {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        petRepository.deleteByUserId(id);
        usuarioRepository.delete(usuario);
    }

}
