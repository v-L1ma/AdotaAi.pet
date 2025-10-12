package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.*;
import com.adotaai.adotaai.Entity.*;
import com.adotaai.adotaai.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SolicitacaoAdocaoService {

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

    @Transactional
    public SolicitacaoResponseDTO criarSolicitacao(SolicitacaoAdocaoDTO dto) {
        UsuarioEntity adotante = usuarioRepository.findById(dto.getAdotanteId())
                .orElseThrow(() -> new RuntimeException("Usuário adotante não encontrado"));
        FormularioEntity formulario = formularioRepository.findById(dto.getFormularioId())
                .orElseThrow(() -> new RuntimeException("Formulário não encontrado"));
        UsuarioEntity anunciante = formulario.getUsuarioCriador();

        SolicitacaoAdocaoEntity novaSolicitacao = new SolicitacaoAdocaoEntity();
        novaSolicitacao.setAdotante(adotante);
        novaSolicitacao.setAnunciante(anunciante);

        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(novaSolicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }

    @Transactional
    public RespostaResponseDTO salvarResposta(RespostaDTO dto) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(dto.getSolicitacaoId())
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));
        PerguntaEntity pergunta = perguntaRepository.findById(dto.getPerguntaId())
                .orElseThrow(() -> new RuntimeException("Pergunta não encontrada"));

        RespostaEntity resposta = new RespostaEntity();
        resposta.setSolicitacao(solicitacao);
        resposta.setPergunta(pergunta);
        resposta.setResposta(dto.getResposta());

        RespostaEntity respostaSalva = respostaRepository.save(resposta);
        return new RespostaResponseDTO(respostaSalva);
    }

    @Transactional(readOnly = true)
    public FormularioDetalhadoDTO buscarSolicitacaoDetalhada(Long solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        // Descobre o formulário original através da primeira resposta/pergunta
        // Esta lógica assume que as perguntas de uma solicitação vêm de um único formulário.
        PerguntaEntity primeiraPergunta = solicitacao.getRespostas().stream()
                .findFirst()
                .map(RespostaEntity::getPergunta)
                .orElseGet(() -> {
                    // Se não houver respostas ainda, precisamos encontrar o formulário de outra forma.
                    // Esta parte do código assume que você pode encontrar o formulário pelo anunciante.
                    // ATENÇÃO: Se um anunciante puder ter múltiplos formulários, esta lógica precisa ser refinada.
                    return formularioRepository.findByUsuarioCriadorId(solicitacao.getAnunciante().getId())
                            .flatMap(f -> f.getPerguntas().stream().findFirst())
                            .orElse(null);
                });

        FormularioEntity formularioOriginal = (primeiraPergunta != null) ? primeiraPergunta.getFormulario() : null;

        if (formularioOriginal == null) {
            throw new RuntimeException("Não foi possível determinar o formulário original para esta solicitação.");
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

    @Transactional
    public SolicitacaoResponseDTO aprovarSolicitacao(Long solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        solicitacao.setStatus(StatusSolicitacao.APROVADO);
        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }

    @Transactional
    public SolicitacaoResponseDTO recusarSolicitacao(Long solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        solicitacao.setStatus(StatusSolicitacao.RECUSADO);
        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }
}