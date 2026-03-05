package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.UsuarioDTO;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.PetRepository;
import com.adotaai.adotaai.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PetRepository petRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PetRepository petRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.petRepository = petRepository;
        this.passwordEncoder = passwordEncoder;
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

        usuarioEntity.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        usuarioRepository.save(usuarioEntity);
        return "Usuário cadastrado com sucesso.";
    }


    @Transactional
    public UsuarioDTO atualizarUsuario(Long id, UsuarioDTO userDto){

        UsuarioEntity user = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado com ID: "));

        user.setNome(userDto.getNome());
        user.setCpfcnpj(userDto.getCpfcnpj());
        user.setEmail(userDto.getEmail());
        if (userDto.getSenha() != null && !userDto.getSenha().isBlank()) {
            user.setSenha(passwordEncoder.encode(userDto.getSenha()));
        }
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
