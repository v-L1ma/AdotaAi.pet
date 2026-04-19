package com.adotaai.adotaai.Application.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.adotaai.adotaai.Application.DTO.CadastrarUsuarioReponseDTO;
import com.adotaai.adotaai.Application.DTO.UsuarioDTO;
import com.adotaai.adotaai.Application.Util.BaseResponse;
import com.adotaai.adotaai.Application.Util.CnpjValidator;
import com.adotaai.adotaai.Application.Util.CpfValidator;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Infraestructure.Repository.PetRepository;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;

import jakarta.transaction.Transactional;

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

    public BaseResponse<UsuarioDTO> listarTodos() {
        List<UsuarioEntity> usuario = usuarioRepository.findAll();
        List<UsuarioDTO> dtos = usuario.stream().map(UsuarioDTO::new).toList();
        return new BaseResponse<>("Sucesso", dtos, null);
    }

    public BaseResponse<CadastrarUsuarioReponseDTO> inserir(UsuarioDTO usuarioDTO) {
        if (usuarioDTO.getNome() == null || usuarioDTO.getNome().trim().isEmpty()
                || usuarioDTO.getEmail() == null || usuarioDTO.getEmail().trim().isEmpty()
                || usuarioDTO.getSenha() == null || usuarioDTO.getSenha().trim().isEmpty()
                || usuarioDTO.getCpfcnpj() == null || usuarioDTO.getCpfcnpj().trim().isEmpty()) {
            throw new RuntimeException("Campos obrigatórios não podem estar vazios.");
        }

        if (usuarioDTO.getCpfcnpj() != null) {
            String cpfcnpjLimpo = usuarioDTO.getCpfcnpj().replaceAll("[^0-9]", "");
            if (cpfcnpjLimpo.length() == 11 && !CpfValidator.isValid(cpfcnpjLimpo)) {
                throw new RuntimeException("CPF inválido.");
            } else if (cpfcnpjLimpo.length() == 14 && !CnpjValidator.isValid(cpfcnpjLimpo)) {
                throw new RuntimeException("CNPJ inválido.");
            } else if (cpfcnpjLimpo.length() != 11 && cpfcnpjLimpo.length() != 14) {
                throw new RuntimeException("CPF/CNPJ com tamanho inválido.");
            }
        }

        boolean emailExiste = usuarioDTO.getEmail() != null && usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent();
        boolean cpfcnpjExiste = usuarioDTO.getCpfcnpj() != null && usuarioRepository.findBycpfcnpj(usuarioDTO.getCpfcnpj()).isPresent();

        if (emailExiste) {
            throw new RuntimeException("Usuário já cadastrado com este e-mail.");
        }

        if (cpfcnpjExiste) {
            throw new RuntimeException("Usuário já cadastrado com este CPF/CNPJ.");
        }

        UsuarioEntity usuarioEntity = new UsuarioEntity(usuarioDTO);
        usuarioEntity.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        usuarioEntity.setFl_ativo(true);
        usuarioEntity.setCreated_at(LocalDateTime.now());
        usuarioEntity.setCreated_by(usuarioEntity.getId());
        usuarioRepository.save(usuarioEntity);
        return new BaseResponse<>("Usuário cadastrado com sucesso.", List.of(new CadastrarUsuarioReponseDTO(usuarioEntity)), null);
    }

    @Transactional
    public BaseResponse<UsuarioDTO> atualizarUsuario(UsuarioDTO userDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        var optUser = usuarioRepository.findByEmail(auth.getName());
        if (optUser.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado para o email: " + auth.getName());
        }

        UsuarioEntity user = optUser.get();

        user.setNome(userDto.getNome());
        user.setCpfcnpj(userDto.getCpfcnpj());
        user.setEmail(userDto.getEmail());
        if (userDto.getSenha() != null && !userDto.getSenha().isBlank()) {
            user.setSenha(passwordEncoder.encode(userDto.getSenha()));
        }
        user.setTelefone(userDto.getTelefone());
        user.setLink_foto(userDto.getLink_foto());
        user.setEndereco(userDto.getEndereco());
        user.setCep(userDto.getCep());
        user.setBairro(userDto.getBairro());
        user.setCidade(userDto.getCidade());
        user.setSg_estado(userDto.getSg_estado());
        user.setLast_modified_at(LocalDateTime.now());
        user.setLast_modified_by(user.getId());

        UsuarioEntity useratualizado = usuarioRepository.save(user);

        return new BaseResponse<>("Usuário atualizado com sucesso.", List.of(new UsuarioDTO(useratualizado)), null);
    }

    @Transactional
    public BaseResponse<UsuarioDTO> excluir() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        var optUser = usuarioRepository.findByEmail(auth.getName());
        if (optUser.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado para o email: " + auth.getName());
        }

        UsuarioEntity usuario = optUser.get();
        usuario.setFl_ativo(false);
        usuario.setLast_modified_at(LocalDateTime.now());
        usuario.setLast_modified_by(usuario.getId());
        usuarioRepository.save(usuario);
        petRepository.deleteByUserId(usuario.getId());

        return new BaseResponse<>("Usuário excluído com sucesso.", null, null);
    }

}
