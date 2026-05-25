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
import com.adotaai.adotaai.Domain.Enum.Status;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.adotaai.adotaai.Infraestructure.Repository.*;

@Service
public class SolicitacaoAdocaoService implements ISolicitacaoAdocaoService {

    private final SolicitacaoAdocaoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PetRepository petRepository;

    public SolicitacaoAdocaoService(SolicitacaoAdocaoRepository solicitacaoRepository,
                                    UsuarioRepository usuarioRepository,
                                    PetRepository petRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.petRepository = petRepository;
    }

    @Override
    @Transactional
    public SolicitacaoResponseDTO criarSolicitacao(SolicitacaoAdocaoDTO dto) {
        UsuarioEntity adotante = obterUsuarioAutenticado();

        PetEntity pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pet não encontrado"));

        FormularioEntity formulario = pet.getFormulario();

        if (formulario != null) {
            if (dto.getRespostas() == null || dto.getRespostas().isEmpty()) {
                throw new RegraDeNegocioException("Este pet possui formulário. Você deve responder as perguntas para fazer a solicitação.");
            }

            List<PerguntaEntity> perguntasFormulario = formulario.getPerguntas();
            if (perguntasFormulario.size() != dto.getRespostas().size()) {
                throw new RegraDeNegocioException("Você deve responder todas as perguntas do formulário.");
            }

            for (PerguntaRespostaDTO respostaDto : dto.getRespostas()) {
                boolean perguntaEncontrada = perguntasFormulario.stream()
                        .anyMatch(p -> p.getId().equals(respostaDto.getPerguntaId()));
                if (!perguntaEncontrada) {
                    throw new RegraDeNegocioException("Pergunta inválida: " + respostaDto.getPerguntaId());
                }
            }
        } else if (dto.getRespostas() != null && !dto.getRespostas().isEmpty()) {
            throw new RegraDeNegocioException("Este pet não possui formulário. Não é necessário enviar respostas.");
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
        novaSolicitacao.setPet(pet);

        if (dto.getRespostas() != null && !dto.getRespostas().isEmpty()) {
            List<PerguntaRespostaSnapshot> snapshots = dto.getRespostas().stream()
                    .map(respostaDto -> {
                        String textoPergunta = formulario.getPerguntas().stream()
                                .filter(p -> p.getId().equals(respostaDto.getPerguntaId()))
                                .map(PerguntaEntity::getTexto)
                                .findFirst()
                                .orElse(null);
                        return new PerguntaRespostaSnapshot(
                                respostaDto.getPerguntaId(),
                                textoPergunta,
                                respostaDto.getRespostaTexto()
                        );
                    })
                    .toList();
            novaSolicitacao.setPerguntasRespostas(snapshots);
        }

        novaSolicitacao.setFl_ativo(true);
        novaSolicitacao.setCreated_at(java.time.LocalDateTime.now());
        novaSolicitacao.setCreated_by(adotante.getId());

        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(novaSolicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva, pet);
    }

    @Override
    @Transactional(readOnly = true)
    public FormularioDetalhadoDTO buscarSolicitacaoDetalhada(UUID solicitacaoId) {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada"));

        UUID usuarioId = usuario.getId();
        boolean isAnunciante = solicitacao.getAnunciante() != null
            && solicitacao.getAnunciante().getId().equals(usuarioId);
        boolean isAdotante = solicitacao.getAdotante() != null
            && solicitacao.getAdotante().getId().equals(usuarioId);

        if (!isAnunciante && !isAdotante) {
            throw new RegraDeNegocioException("Usuário não autorizado a visualizar esta solicitação.");
        }

        String linkFotoPerfil = null;
        if (isAnunciante && solicitacao.getAdotante() != null) {
            linkFotoPerfil = solicitacao.getAdotante().getLink_foto();
        } else if (isAdotante && solicitacao.getAnunciante() != null) {
            linkFotoPerfil = solicitacao.getAnunciante().getLink_foto();
        }

        List<PerguntaRespostaDTO> perguntasRespostas = solicitacao.getPerguntasRespostas().stream()
                .map(snapshot -> new PerguntaRespostaDTO(
                        snapshot.getPerguntaId(),
                        snapshot.getPerguntaTexto(),
                        snapshot.getRespostaTexto()))
                .toList();

        return new FormularioDetalhadoDTO(
                solicitacao.getId(),
                solicitacao.getAnunciante().getId(),
                solicitacao.getAnunciante().getNome(),
                solicitacao.getAdotante().getId(),
                solicitacao.getAdotante().getNome(),
                linkFotoPerfil,
                perguntasRespostas
        );
    }

    @Override
    @Transactional
    public SolicitacaoResponseDTO aprovarSolicitacao(UUID solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findByIdAndFl_ativoTrue(solicitacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada"));

        solicitacao.setStatus(Status.APROVADO);
        solicitacao.setLast_modified_at(java.time.LocalDateTime.now());
        solicitacao.setLast_modified_by(obterUsuarioAutenticado().getId());
        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }

    @Override
    @Transactional
    public SolicitacaoResponseDTO recusarSolicitacao(UUID solicitacaoId) {
        SolicitacaoAdocaoEntity solicitacao = solicitacaoRepository.findByIdAndFl_ativoTrue(solicitacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada"));

        solicitacao.setStatus(Status.REPROVADO);
        solicitacao.setLast_modified_at(java.time.LocalDateTime.now());
        solicitacao.setLast_modified_by(obterUsuarioAutenticado().getId());
        SolicitacaoAdocaoEntity solicitacaoSalva = solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacaoSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarRecebidas() {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        return solicitacaoRepository.findAllByAnuncianteId(usuario.getId())
                .stream()
            .map(entity -> toDtoWithPetAndFoto(entity,
                entity.getAdotante() != null ? entity.getAdotante().getLink_foto() : null))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarEnviadas() {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        return solicitacaoRepository.findAllByAdotanteId(usuario.getId())
                .stream()
                .map(entity -> toDtoWithPetAndFoto(entity,
                        entity.getAnunciante() != null ? entity.getAnunciante().getLink_foto() : null))
                .toList();
    }

    private SolicitacaoResponseDTO toDtoWithPetAndFoto(SolicitacaoAdocaoEntity entity, String linkFotoPerfil) {
        return new SolicitacaoResponseDTO(entity, entity.getPet(), linkFotoPerfil);
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
