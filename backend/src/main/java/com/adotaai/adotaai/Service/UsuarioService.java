package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.UsuarioDTO;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.PetRepository;
import com.adotaai.adotaai.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public String inserir(UsuarioDTO usuarioDTO) {
        UsuarioEntity usuarioEntity = new UsuarioEntity(usuarioDTO);

        boolean emailExiste = usuarioRepository.findByEmail(usuarioEntity.getEmail()).isPresent();
        boolean cpfcnpjExiste = usuarioRepository.findBycpfcnpj(usuarioEntity.getCpfcnpj()).isPresent();

        if (emailExiste || cpfcnpjExiste) {
            return "Erro: Usuário já cadastrado com este e-mail ou CPF/CNPJ.";
        }

        usuarioRepository.save(usuarioEntity);
        return "Usuário cadastrado com sucesso.";
    }


    @Transactional
    public UsuarioDTO atualizarUsuario(Long id, UsuarioDTO userDto){

        UsuarioEntity user = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado com ID: "));

        user.setNome(userDto.getNome());
        user.setCpfcnpj(user.getCpfcnpj());
        user.setEmail(userDto.getEmail());
        user.setSenha(userDto.getSenha());
        user.setTelefone(userDto.getTelefone());
        user.setCargo(userDto.getCargo());
        user.setLink_foto(userDto.getLink_foto());
        user.setEndereco(userDto.getEndereco());
        user.setCep(userDto.getCep());
        user.setBairro(userDto.getBairro());
        user.setCidade(userDto.getCidade());
        user.setSg_estado(userDto.getSg_estado());
        user.setStatus(userDto.getStatus());

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
