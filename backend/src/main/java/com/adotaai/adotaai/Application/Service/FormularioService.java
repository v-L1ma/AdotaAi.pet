package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.FormularioDTO;
import com.adotaai.adotaai.Application.DTO.FormularioTemplateDTO;
import com.adotaai.adotaai.Domain.Entity.FormularioEntity;
import com.adotaai.adotaai.Domain.Entity.PerguntaEntity;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.adotaai.adotaai.Infraestructure.Repository.FormularioRepository;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class FormularioService implements IFormularioService {

    private final FormularioRepository formularioRepository;
    private final UsuarioRepository usuarioRepository;

    public FormularioService(FormularioRepository formularioRepository,
                             UsuarioRepository usuarioRepository) {
        this.formularioRepository = formularioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public FormularioEntity criarFormulario(FormularioDTO dto) {
        if (dto.getPerguntas() == null || dto.getPerguntas().isEmpty()) {
            throw new RegraDeNegocioException("A lista de perguntas nao pode estar vazia.");
        }
        if (dto.getPerguntas().size() > 20) {
            throw new RegraDeNegocioException("A lista de perguntas deve conter no maximo 20 itens.");
        }

        UsuarioEntity criador = obterUsuarioAutenticado();

        FormularioEntity formulario = new FormularioEntity();
        formulario.setUsuarioCriador(criador);
        formulario.setFl_ativo(true);
        formulario.setCreated_at(java.time.LocalDateTime.now());
        formulario.setCreated_by(criador.getId());

        List<PerguntaEntity> perguntas = new ArrayList<>();
        if (dto.getPerguntas() != null) {
            for (String textoPergunta : dto.getPerguntas()) {
                PerguntaEntity p = new PerguntaEntity();
                p.setTexto(textoPergunta);
                p.setFormulario(formulario);
                p.setFl_ativo(true);
                p.setCreated_at(java.time.LocalDateTime.now());
                p.setCreated_by(criador.getId());
                perguntas.add(p);
            }
        }
        formulario.setPerguntas(perguntas);
        return formularioRepository.save(formulario);
    }

    @Override
    @Transactional
    public FormularioTemplateDTO atualizarFormulario(UUID id, FormularioDTO dto) {
        if (dto.getPerguntas() == null || dto.getPerguntas().isEmpty()) {
            throw new RegraDeNegocioException("A lista de perguntas nao pode estar vazia.");
        }
        if (dto.getPerguntas().size() > 20) {
            throw new RegraDeNegocioException("A lista de perguntas deve conter no maximo 20 itens.");
        }

        FormularioEntity formulario = formularioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Formulário não encontrado"));

        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();

        if (!formulario.getUsuarioCriador().getId().equals(usuarioAutenticado.getId())) {
            throw new RegraDeNegocioException("Apenas o criador do formulário pode editá-lo");
        }

        formulario.getPerguntas().replaceAll(p -> {
            if(!dto.getPerguntas().contains(p.getTexto())) {
                p.setFl_ativo(false);
                p.setLast_modified_at(java.time.LocalDateTime.now());
                p.setLast_modified_by(usuarioAutenticado.getId());
            }
            return p;
        });

        List<PerguntaEntity> novasPerguntas = dto.getPerguntas().stream()
                .filter(texto -> formulario.getPerguntas().stream().noneMatch(p -> p.getTexto().equals(texto)))
                .map(texto -> {
                    PerguntaEntity p = new PerguntaEntity();
                    p.setTexto(texto);
                    p.setFormulario(formulario);
                    p.setFl_ativo(true);
                    p.setCreated_at(java.time.LocalDateTime.now());
                    p.setCreated_by(usuarioAutenticado.getId());
                    return p;
                })
                .collect(Collectors.toList());
        
        if (novasPerguntas.size() > 0) {
            formulario.getPerguntas().addAll(novasPerguntas);
        }

        formulario.setLast_modified_at(java.time.LocalDateTime.now());
        formulario.setLast_modified_by(usuarioAutenticado.getId());
        formularioRepository.save(formulario);
        return new FormularioTemplateDTO(formulario);
    }

    @Override
    public List<FormularioTemplateDTO> listarFormularios() {
        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();
        return formularioRepository.findAllByFl_ativoTrueAndUsuarioCriadorId(usuarioAutenticado.getId())
                .stream()
                .map(FormularioTemplateDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public FormularioTemplateDTO buscarFormularioPorId(UUID id) {
        FormularioTemplateDTO formulario = formularioRepository.findByIdAndFl_ativoTrue(id)
                .map(FormularioTemplateDTO::new)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Formulário não encontrado"));

        formulario.getPerguntas().removeIf(p -> !p.getFl_ativo());
        return formulario;
    }

    @Override
    @Transactional
    public void deletarFormulario(UUID formularioId) {
        FormularioEntity formulario = formularioRepository.findByIdAndFl_ativoTrue(formularioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Formulário não encontrado"));

        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();

        if (!formulario.getUsuarioCriador().getId().equals(usuarioAutenticado.getId())) {
            throw new RegraDeNegocioException("Apenas o criador do formulário pode deletá-lo");
        }

        formulario.setFl_ativo(false);
        formulario.setLast_modified_at(java.time.LocalDateTime.now());
        formulario.setLast_modified_by(usuarioAutenticado.getId());
        formularioRepository.save(formulario);
    }

    private UsuarioEntity obterUsuarioAutenticado() {
        return obterUsuarioAutenticadoOpcional()
                .orElseThrow(() -> new RegraDeNegocioException("Usuário não autenticado."));
    }

    private Optional<UsuarioEntity> obterUsuarioAutenticadoOpcional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return Optional.empty();
        }

        Object details = auth.getDetails();
        if (details instanceof UUID userId) {
            return usuarioRepository.findById(userId);
        }

        if (details instanceof String userIdStr) {
            try {
                UUID userId = UUID.fromString(userIdStr);
                return usuarioRepository.findById(userId);
            } catch (IllegalArgumentException ignored) {
                // Fallback para autenticações antigas baseadas em email.
            }
        }

        return usuarioRepository.findByEmail(auth.getName());
    }
}
