package com.adotaai.adotaai.Application.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.adotaai.adotaai.Application.DTO.*;
import com.adotaai.adotaai.Domain.Entity.*;
import com.adotaai.adotaai.Domain.Enum.StatusSolicitacao;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.adotaai.adotaai.Infraestructure.Repository.*;

@Service
public class SolicitacaoAdocaoService implements ISolicitacaoAdocaoService {

    private final SolicitacaoAdocaoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final FormularioRepository formularioRepository;
    private final PerguntaRepository perguntaRepository;
    private final RespostaRepository respostaRepository;

    public SolicitacaoAdocaoService(SolicitacaoAdocaoRepository solicitacaoRepository,
                                    UsuarioRepository usuarioRepository,
                                    FormularioRepository formularioRepository,
                                    PerguntaRepository perguntaRepository,
                                    RespostaRepository respostaRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.formularioRepository = formularioRepository;
        this.perguntaRepository = perguntaRepository;
        this.respostaRepository = respostaRepository;
    }

    @Override
    @Transactional
    public SolicitacaoResponseDTO criarSolicitacao(SolicitacaoAdocaoDTO dto) {
        UsuarioEntity adotante = obterUsuarioAutenticado();
        FormularioEntity formulario = formularioRepository.findById(dto.getFormularioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Formulário não encontrado"));

        UsuarioEntity anunciante = formulario.getUsuarioCriador();

        Optional<SolicitacaoAdocaoEntity> solicitacaoExistente =
                solicitacaoRepository.findByAdotanteIdAndFormularioId(adotante.getId(), formulario.getId());

        if (solicitacaoExistente.isPresent()) {
            throw new RegraDeNegocioException("Você já enviou uma solicitação para este formulário.");
        }

        SolicitacaoAdocaoEntity novaSolicitacao = new SolicitacaoAdocaoEntity();
        novaSolicitacao.setAdotante(adotante);
        novaSolicitacao.setAnunciante(anunciante);
        novaSolicitacao.setFormulario(formulario);

        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(novaSolicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }

    @Override
    @Transactional
    public RespostaResponseDTO salvarResposta(RespostaDTO dto) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(dto.getSolicitacaoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada"));

        PerguntaEntity pergunta = perguntaRepository.findById(dto.getPerguntaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pergunta não encontrada"));

        RespostaEntity resposta = new RespostaEntity();
        resposta.setSolicitacao(solicitacao);
        resposta.setPergunta(pergunta);
        resposta.setResposta(dto.getResposta());

        RespostaEntity respostaSalva = respostaRepository.save(resposta);
        return new RespostaResponseDTO(respostaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public FormularioDetalhadoDTO buscarSolicitacaoDetalhada(UUID solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada"));

        FormularioEntity formularioOriginal = solicitacao.getFormulario();

        if (formularioOriginal == null) {
            throw new RegraDeNegocioException("Não foi possível encontrar o formulário associado a esta solicitação.");
        }

        List<PerguntaRespostaDTO> perguntasRespostas = formularioOriginal.getPerguntas().stream()
                .map(pergunta -> {
                    String respostaTexto = solicitacao.getRespostas().stream()
                            .filter(resposta -> resposta.getPergunta().getId().equals(pergunta.getId()))
                            .map(RespostaEntity::getResposta)
                            .findFirst()
                            .orElse(null);
                    return new PerguntaRespostaDTO(pergunta.getId(), pergunta.getTexto(), respostaTexto);
                }).toList();

        return new FormularioDetalhadoDTO(
                solicitacao.getId(),
                solicitacao.getAnunciante().getId(),
                solicitacao.getAnunciante().getNome(),
                solicitacao.getAdotante().getId(),
                solicitacao.getAdotante().getNome(),
                perguntasRespostas
        );
    }

    @Override
    @Transactional
    public SolicitacaoResponseDTO aprovarSolicitacao(UUID solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada"));

        solicitacao.setStatus(StatusSolicitacao.APROVADO);
        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }

    @Override
    @Transactional
    public SolicitacaoResponseDTO recusarSolicitacao(UUID solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada"));

        solicitacao.setStatus(StatusSolicitacao.RECUSADO);
        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }

    private UsuarioEntity obterUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RegraDeNegocioException("Usuário não autenticado.");
        }

        return usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado para o email: " + auth.getName()));
    }
}
