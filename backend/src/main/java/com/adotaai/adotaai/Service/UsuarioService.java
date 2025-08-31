package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.UsuarioDTO;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

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

    public void excluir(Long id)
    {
        UsuarioEntity usuario= usuarioRepository.findById(id).get();
        usuarioRepository.delete(usuario);
    }

}
