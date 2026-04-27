package com.adotaai.adotaai.Application.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.adotaai.adotaai.Application.DTO.AtualizarUsuarioDTO;
import com.adotaai.adotaai.Application.DTO.CadastrarUsuarioDTO;
import com.adotaai.adotaai.Application.DTO.UsuarioReponseDTO;
import com.adotaai.adotaai.Application.DTO.UsuarioPublicoDTO;
import com.adotaai.adotaai.Application.Util.BaseResponse;
import com.adotaai.adotaai.Application.Util.CnpjValidator;
import com.adotaai.adotaai.Application.Util.CpfValidator;
import com.adotaai.adotaai.Domain.Entity.Roles;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
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

    public BaseResponse<UsuarioReponseDTO> listarTodos() {
        List<UsuarioEntity> usuario = usuarioRepository.findAll();
        List<UsuarioReponseDTO> dtos = usuario.stream().map(UsuarioReponseDTO::new).toList();
        return new BaseResponse<>("Sucesso", dtos, null);
    }

    public BaseResponse<UsuarioReponseDTO> buscarUsuarioLogado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new RegraDeNegocioException("Usuário não autenticado.");
        }

        UsuarioEntity usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado para o email: " + auth.getName()));

        return new BaseResponse<>("Sucesso", List.of(new UsuarioReponseDTO(usuario)), null);
    }

    public BaseResponse<UsuarioPublicoDTO> buscarPublicoPorId(UUID id) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        return new BaseResponse<>("Sucesso", List.of(new UsuarioPublicoDTO(usuario)), null);
    }

    public BaseResponse<UsuarioReponseDTO> inserir(CadastrarUsuarioDTO usuarioDTO) {
        if (usuarioDTO.getNome() == null || usuarioDTO.getNome().trim().isEmpty()
                || usuarioDTO.getEmail() == null || usuarioDTO.getEmail().trim().isEmpty()
                || usuarioDTO.getSenha() == null || usuarioDTO.getSenha().trim().isEmpty()
                || usuarioDTO.getConfirmarSenha() == null || usuarioDTO.getConfirmarSenha().trim().isEmpty()
                || usuarioDTO.getCpfcnpj() == null || usuarioDTO.getCpfcnpj().trim().isEmpty()) {
            throw new RegraDeNegocioException("Campos obrigatórios não podem estar vazios.");
        }

        if (!usuarioDTO.getSenha().equals(usuarioDTO.getConfirmarSenha())) {
            throw new RegraDeNegocioException("Senha e confirmar senha não conferem.");
        }

        String emailNormalizado = usuarioDTO.getEmail().trim().toLowerCase();
        usuarioDTO.setEmail(emailNormalizado);

        String cpfcnpjNormalizado = usuarioDTO.getCpfcnpj().replaceAll("[^0-9]", "");
        usuarioDTO.setCpfcnpj(cpfcnpjNormalizado);

        if (usuarioDTO.getCpfcnpj() != null) {
            String cpfcnpjLimpo = usuarioDTO.getCpfcnpj().replaceAll("[^0-9]", "");
            if (cpfcnpjLimpo.length() == 11 && !CpfValidator.isValid(cpfcnpjLimpo)) {
                throw new RegraDeNegocioException("CPF inválido.");
            } else if (cpfcnpjLimpo.length() == 14 && !CnpjValidator.isValid(cpfcnpjLimpo)) {
                throw new RegraDeNegocioException("CNPJ inválido.");
            } else if (cpfcnpjLimpo.length() != 11 && cpfcnpjLimpo.length() != 14) {
                throw new RegraDeNegocioException("CPF/CNPJ com tamanho inválido.");
            }
        }

        boolean emailExiste = usuarioDTO.getEmail() != null && usuarioRepository.findByEmailIgnoreCase(usuarioDTO.getEmail()).isPresent();
        boolean cpfcnpjExiste = usuarioDTO.getCpfcnpj() != null && usuarioRepository.findByCpfcnpj(usuarioDTO.getCpfcnpj()).isPresent();

        if (emailExiste) {
            throw new RegraDeNegocioException("Usuário já cadastrado com este e-mail.");
        }

        if (cpfcnpjExiste) {
            throw new RegraDeNegocioException("Usuário já cadastrado com este CPF/CNPJ.");
        }

        UsuarioEntity usuarioEntity = new UsuarioEntity(usuarioDTO);
        usuarioEntity.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        usuarioEntity.setTelefone(null);
        usuarioEntity.setLink_foto(null);
        usuarioEntity.setEndereco(null);
        usuarioEntity.setCep(null);
        usuarioEntity.setBairro(null);
        usuarioEntity.setCidade(null);
        usuarioEntity.setSg_estado(null);
        usuarioEntity.setFl_ativo(true);
        usuarioEntity.setCreated_at(LocalDateTime.now());
        usuarioEntity.setCreated_by(usuarioEntity.getId());
        usuarioRepository.save(usuarioEntity);
        return new BaseResponse<>("Usuário cadastrado com sucesso.", List.of(new UsuarioReponseDTO(usuarioEntity)), null);
    }

    @Transactional
    public BaseResponse<UsuarioReponseDTO> atualizarUsuario(AtualizarUsuarioDTO userDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new RegraDeNegocioException("Usuário não autenticado.");
        }

        var optUser = usuarioRepository.findByEmailIgnoreCase(auth.getName());
        if (optUser.isEmpty()) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado para o email: " + auth.getName());
        }

        UsuarioEntity user = optUser.get();

        user.setNome(userDto.getNome());
        user.setCpfcnpj(userDto.getCpfcnpj());
        String novoEmailNormalizado = userDto.getEmail() == null ? null : userDto.getEmail().trim().toLowerCase();
        if (novoEmailNormalizado == null || novoEmailNormalizado.isBlank()) {
            throw new RegraDeNegocioException("E-mail é obrigatório.");
        }

        if (!user.getEmail().equalsIgnoreCase(novoEmailNormalizado)
                && usuarioRepository.findByEmailIgnoreCase(novoEmailNormalizado).isPresent()) {
            throw new RegraDeNegocioException("Usuário já cadastrado com este e-mail.");
        }

        String novoCpfCnpjNormalizado = userDto.getCpfcnpj() == null ? null : userDto.getCpfcnpj().replaceAll("[^0-9]", "");
        if (novoCpfCnpjNormalizado == null || novoCpfCnpjNormalizado.isBlank()) {
            throw new RegraDeNegocioException("CPF/CNPJ é obrigatório.");
        }

        if (!user.getCpfcnpj().equals(novoCpfCnpjNormalizado)
                && usuarioRepository.findByCpfcnpj(novoCpfCnpjNormalizado).isPresent()) {
            throw new RegraDeNegocioException("Usuário já cadastrado com este CPF/CNPJ.");
        }

        user.setCpfcnpj(novoCpfCnpjNormalizado);
        user.setEmail(novoEmailNormalizado);
        if (userDto.getSenha() != null && !userDto.getSenha().isBlank()) {
            if (userDto.getConfirmarSenha() == null || userDto.getConfirmarSenha().isBlank()) {
                throw new RegraDeNegocioException("Confirmação de senha é obrigatória ao alterar a senha.");
            }

            if (!userDto.getSenha().equals(userDto.getConfirmarSenha())) {
                throw new RegraDeNegocioException("Senha e confirmar senha não conferem.");
            }

            user.setSenha(passwordEncoder.encode(userDto.getSenha()));
        }
        user.setTelefone(userDto.getTelefone());
        user.setEndereco(userDto.getEndereco());
        user.setCep(userDto.getCep());
        user.setBairro(userDto.getBairro());
        user.setCidade(userDto.getCidade());
        user.setSg_estado(userDto.getSg_estado());
        user.setFl_ativo(true);
        user.setCargo(Roles.USUARIO);
        user.setLast_modified_at(LocalDateTime.now());
        user.setLast_modified_by(user.getId());

        UsuarioEntity useratualizado = usuarioRepository.save(user);

        UsuarioReponseDTO responseDTO = new UsuarioReponseDTO(useratualizado);

        return new BaseResponse<>("Usuário atualizado com sucesso.", List.of(responseDTO), null);
    }


    @Transactional
    public BaseResponse<AtualizarUsuarioDTO> excluir() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new RegraDeNegocioException("Usuário não autenticado.");
        }

        var optUser = usuarioRepository.findByEmailIgnoreCase(auth.getName());
        if (optUser.isEmpty()) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado para o email: " + auth.getName());
        }

        UsuarioEntity usuario = optUser.get();
        usuario.setFl_ativo(false);
        usuario.setLast_modified_at(LocalDateTime.now());
        usuario.setLast_modified_by(usuario.getId());
        usuarioRepository.save(usuario);
        petRepository.deleteByUserId(usuario.getId());

        return new BaseResponse<>("Usuário excluído com sucesso.", null, null);
    }

    private void validarFotoPerfil(MultipartFile imagem) {
        if (imagem == null || imagem.isEmpty()) {
            throw new RegraDeNegocioException("Imagem obrigatória para upload.");
        }

        if (imagem.getSize() > MAX_FOTO_PERFIL_BYTES) {
            throw new RegraDeNegocioException("Imagem acima do limite permitido de 50 MB.");
        }
    }

}
