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
    private final PetRepository petRepository;

    public SolicitacaoAdocaoService(SolicitacaoAdocaoRepository solicitacaoRepository,
                                    UsuarioRepository usuarioRepository,
                                    FormularioRepository formularioRepository,
                                    PerguntaRepository perguntaRepository,
                                    RespostaRepository respostaRepository,
                                    PetRepository petRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.formularioRepository = formularioRepository;
        this.perguntaRepository = perguntaRepository;
        this.respostaRepository = respostaRepository;
        this.petRepository = petRepository;
    }

    @Override
    @Transactional
    public SolicitacaoResponseDTO criarSolicitacao(SolicitacaoAdocaoDTO dto) {
        UsuarioEntity adotante = obterUsuarioAutenticado();

        PetEntity pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pet não encontrado"));

        FormularioEntity formulario = null;

        if (pet.getFormulario() != null) {
            formulario = pet.getFormulario();

            if (dto.getFormularioId() != null && !dto.getFormularioId().equals(formulario.getId())) {
                throw new RegraDeNegocioException("O formulário informado não corresponde ao formulário vinculado a este pet.");
            }

        } else if (dto.getFormularioId() != null) {
            throw new RegraDeNegocioException("Este pet não possui formulário vinculado. Não é necessário responder formulário para adotar este pet.");
        }

        UsuarioEntity anunciante = pet.getUser();

        Optional<SolicitacaoAdocaoEntity> solicitacaoExistente;
        
        solicitacaoExistente = solicitacaoRepository.findByAdotanteIdAndPetId(adotante.getId(), pet.getId());
        if (solicitacaoExistente.isPresent()) {
            throw new RegraDeNegocioException("Você já enviou uma solicitação para este pet.");
        }

        SolicitacaoAdocaoEntity novaSolicitacao = new SolicitacaoAdocaoEntity();
        novaSolicitacao.setAdotante(adotante);
        novaSolicitacao.setAnunciante(anunciante);
        novaSolicitacao.setFormulario(formulario);
        novaSolicitacao.setPet(pet);

        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(novaSolicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva, pet);
        //falta juntar a rota de responder o formulario para ser junto com a solicitacao
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

        List<PerguntaRespostaDTO> perguntasRespostas = null;
        if (formularioOriginal != null && formularioOriginal.getPerguntas() != null) {
            perguntasRespostas = formularioOriginal.getPerguntas().stream()
                    .map(pergunta -> {
                        String respostaTexto = solicitacao.getRespostas().stream()
                                .filter(resposta -> resposta.getPergunta().getId().equals(pergunta.getId()))
                                .map(RespostaEntity::getResposta)
                                .findFirst()
                                .orElse(null);
                        return new PerguntaRespostaDTO(pergunta.getId(), pergunta.getTexto(), respostaTexto);
                    }).toList();
        }

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

    @Override
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarRecebidas() {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        return solicitacaoRepository.findAllByAnuncianteId(usuario.getId())
                .stream()
                .map(this::toDtoWithPet)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarEnviadas() {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        return solicitacaoRepository.findAllByAdotanteId(usuario.getId())
                .stream()
                .map(this::toDtoWithPet)
                .toList();
    }

    private SolicitacaoResponseDTO toDtoWithPet(SolicitacaoAdocaoEntity entity) {
        return new SolicitacaoResponseDTO(entity, entity.getPet());
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
