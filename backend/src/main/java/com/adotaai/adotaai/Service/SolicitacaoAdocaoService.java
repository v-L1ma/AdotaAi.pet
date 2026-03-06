package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.*;
import com.adotaai.adotaai.Entity.*;
import com.adotaai.adotaai.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

        Optional<SolicitacaoAdocaoEntity> solicitacaoExistente =
                solicitacaoRepository.findByAdotanteIdAndFormularioId(adotante.getId(), formulario.getId());

        if (solicitacaoExistente.isPresent()) {
            throw new RuntimeException("Você já enviou uma solicitação para este formulário.");
        }


        SolicitacaoAdocaoEntity novaSolicitacao = new SolicitacaoAdocaoEntity();
        novaSolicitacao.setAdotante(adotante);
        novaSolicitacao.setAnunciante(anunciante);
        novaSolicitacao.setFormulario(formulario); // <-- MUDANÇA AQUI (Salvando o formulário)

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


        FormularioEntity formularioOriginal = solicitacao.getFormulario();

        if (formularioOriginal == null) {
            throw new RuntimeException("Não foi possível encontrar o formulário associado a esta solicitação.");
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