package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.FormularioDTO;
import com.adotaai.adotaai.Application.DTO.FormularioTemplateDTO;
import com.adotaai.adotaai.Domain.Entity.FormularioEntity;
import com.adotaai.adotaai.Domain.Entity.PerguntaEntity;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Infraestructure.Repository.FormularioRepository;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class FormularioService {

    private final FormularioRepository formularioRepository;
    private final UsuarioRepository usuarioRepository;

    public FormularioService(FormularioRepository formularioRepository,
            UsuarioRepository usuarioRepository) {
        this.formularioRepository = formularioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public FormularioEntity criarFormulario(FormularioDTO dto) {
        UsuarioEntity criador = obterUsuarioAutenticado();

        FormularioEntity formulario = new FormularioEntity();
        formulario.setUsuarioCriador(criador);

        List<PerguntaEntity> perguntas = new ArrayList<>();
        if (dto.getPerguntas() != null) {
            for (String textoPergunta : dto.getPerguntas()) {
                PerguntaEntity p = new PerguntaEntity();
                p.setTexto(textoPergunta);
                p.setFormulario(formulario);
                perguntas.add(p);
            }
        }
        formulario.setPerguntas(perguntas);
        return formularioRepository.save(formulario);
    }

    public List<FormularioTemplateDTO> listarFormularios() {
        return formularioRepository.findAll()
                .stream()
                .map(FormularioTemplateDTO::new)
                .collect(Collectors.toList());
    }

    public FormularioTemplateDTO buscarFormularioPorId(UUID id) {
        return formularioRepository.findById(id)
                .map(FormularioTemplateDTO::new)
                .orElseThrow(() -> new RuntimeException("Formulário não encontrado"));
    }

    @Transactional
    public void deletarFormulario(UUID formularioId) {
        FormularioEntity formulario = formularioRepository.findById(formularioId)
                .orElseThrow(() -> new RuntimeException("Formulário não encontrado"));

        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();

        if (!formulario.getUsuarioCriador().getId().equals(usuarioAutenticado.getId())) {
            throw new RuntimeException("Apenas o criador do formulário pode deletá-lo");
        }

        formularioRepository.delete(formulario);
    }

    private UsuarioEntity obterUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        return usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para o email: " + auth.getName()));
    }
}
