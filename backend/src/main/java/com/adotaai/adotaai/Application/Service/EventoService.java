package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.EventoDTO;
import com.adotaai.adotaai.Domain.Entity.EventoEntity;
import com.adotaai.adotaai.Domain.Entity.PresencaEventoEntity;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.adotaai.adotaai.Infraestructure.Repository.EventoRepository;
import com.adotaai.adotaai.Infraestructure.Repository.PresencaEventoRepository;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PresencaEventoRepository presencaEventoRepository;

    public List<EventoDTO> listarTodos() {
        List<EventoEntity> eventos = eventoRepository.findAll();
        return eventos.stream().map(this::toDtoComPresencas).toList();
    }

    public EventoDTO buscarPorId(UUID id) {
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado"));
        return toDtoComPresencas(evento);
    }

    public List<EventoDTO> listarEventosUsuarioLogado() {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        return eventoRepository.findAllByUserId(usuario.getId())
                .stream()
                .map(this::toDtoComPresencas)
                .toList();
    }

    private EventoDTO toDtoComPresencas(EventoEntity evento) {
        EventoDTO dto = new EventoDTO(evento);
        dto.setContagemPresencas(presencaEventoRepository.countByEventoId(evento.getId()));
        dto.setIsInscrito(this.isUsuarioInscrito(evento.getId()));
        return dto;
    }

    public void excluir(UUID id) {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado"));
        if (evento.getUser() == null || !evento.getUser().getId().equals(usuario.getId())) {
            throw new RegraDeNegocioException("Apenas o organizador pode excluir o evento.");
        }
        eventoRepository.delete(evento);
    }

    public EventoDTO criarEvento(EventoDTO eventoDTO) {
        EventoEntity evento = new EventoEntity();
        evento.setNome(eventoDTO.getNome());
        evento.setEndereco(eventoDTO.getEndereco());
        evento.setBairro(eventoDTO.getBairro());
        evento.setCidade(eventoDTO.getCidade());
        evento.setCep(eventoDTO.getCep());
        evento.setHrinicio(eventoDTO.getHrInicio().isEmpty() ? null : LocalTime.parse(eventoDTO.getHrInicio()));
        evento.setHrfim(eventoDTO.getHrFim().isEmpty() ? null : LocalTime.parse(eventoDTO.getHrFim()));
        evento.setDescricao(eventoDTO.getDescricao());
        evento.setData(eventoDTO.getData());
        UsuarioEntity usuario = obterUsuarioAutenticado();
        evento.setUser(usuario);
        evento.setNmorganizador(usuario.getNome());
        evento.setStatus("PENDENTE");

        evento = eventoRepository.save(evento);

        EventoDTO dto = new EventoDTO();
        BeanUtils.copyProperties(evento, dto);
        dto.setUser_id(evento.getUser().getId());
        dto.setContagemPresencas(0L);
        return dto;
    }

    @Transactional
    public EventoDTO atualizarEvento(UUID id, EventoDTO eventoDto) {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado com ID: " + id));
        if (evento.getUser() == null || !evento.getUser().getId().equals(usuario.getId())) {
            throw new RegraDeNegocioException("Apenas o organizador pode editar o evento.");
        }
        evento.setNome(eventoDto.getNome());
        evento.setEndereco(eventoDto.getEndereco());
        evento.setBairro(eventoDto.getBairro());
        evento.setCidade(eventoDto.getCidade());
        evento.setCep(eventoDto.getCep());
        evento.setHrinicio(eventoDto.getHrInicio().isEmpty() ? null : LocalTime.parse(eventoDto.getHrInicio()));
        evento.setHrfim(eventoDto.getHrFim().isEmpty() ? null : LocalTime.parse(eventoDto.getHrFim()));
        evento.setDescricao(eventoDto.getDescricao());
        evento.setData(eventoDto.getData());

        EventoEntity eventoatualizado = eventoRepository.save(evento);

        return toDtoComPresencas(eventoatualizado);

    }

    public void registrarPresenca(UUID eventoId) {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        EventoEntity evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado"));

        if (presencaEventoRepository.existsByEventoIdAndUsuarioId(eventoId, usuario.getId())) {
            throw new RegraDeNegocioException("Presença já registrada neste evento");
        }

        PresencaEventoEntity presenca = new PresencaEventoEntity(evento, usuario);
        presencaEventoRepository.save(presenca);
    }

    public void removerPresenca(UUID eventoId) {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        EventoEntity evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado"));

        PresencaEventoEntity presenca = presencaEventoRepository
                .findByEventoIdAndUsuarioId(eventoId, usuario.getId())
                .orElseThrow(() -> new RegraDeNegocioException("Presença não encontrada neste evento"));

        presencaEventoRepository.delete(presenca);
    }

    public long contarPresencas(UUID eventoId) {
        return presencaEventoRepository.countByEventoId(eventoId);
    }

    public boolean isUsuarioInscrito(UUID eventoId) {
        try {
            UsuarioEntity usuario = obterUsuarioAutenticado();
            return presencaEventoRepository.existsByEventoIdAndUsuarioId(eventoId, usuario.getId());
        } catch (Exception e) {
            return false;
        }
    }

    public List<EventoDTO> listarEventosInscritos() {
        UsuarioEntity usuario = obterUsuarioAutenticado();
        List<PresencaEventoEntity> presencas = presencaEventoRepository.findByUsuarioId(usuario.getId());
        return presencas.stream()
                .map(presenca -> {
                    EventoDTO dto = new EventoDTO(presenca.getEvento());
                    dto.setContagemPresencas(presencaEventoRepository.countByEventoId(presenca.getEvento().getId()));
                    return dto;
                })
                .toList();
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
