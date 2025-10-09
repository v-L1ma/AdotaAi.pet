package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.PetDTO;
import com.adotaai.adotaai.DTO.UsuarioDTO;
import com.adotaai.adotaai.Entity.PetEntity;
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

    @Transactional
    public UsuarioDTO atualizarUsuario(Long id, UsuarioDTO userDto){
        UsuarioEntity user = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado com ID: "));
        user.setNome(userDto.getNome());
        user.setCpf_cnpj(user.getCpf_cnpj());
        user.setEmail(userDto.getEmail());
        user.setSenha(userDto.getSenha());
        user.setTelefone(userDto.getTelefone());
        user.setCargo(userDto.getCargo());
        user.setLink_foto(userDto.getLink_foto());
        user.setEndereco(userDto.getEndereco());
        user.setCep(userDto.getCep());
        user.setBairro(userDto.getBairro());
        user.setCidade(userDto.getCidade());
        user.setSg_estado(user.getSg_estado());

        UsuarioEntity useratualizado= usuarioRepository.save(user);

        return  new UsuarioDTO(useratualizado);

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
