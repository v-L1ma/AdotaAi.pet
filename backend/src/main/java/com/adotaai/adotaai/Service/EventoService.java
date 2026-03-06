package com.adotaai.adotaai.Service;

import com.adotaai.adotaai.DTO.EventoDTO;
import com.adotaai.adotaai.DTO.PetDTO;
import com.adotaai.adotaai.Entity.EventoEntity;
import com.adotaai.adotaai.Entity.PetEntity;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.adotaai.adotaai.Repository.EventoRepository;
import com.adotaai.adotaai.Repository.PetRepository;
import com.adotaai.adotaai.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<EventoDTO>listarTodos(){
        List<EventoEntity> eventos = eventoRepository.findAll();
        return eventos.stream().map(EventoDTO::new).toList();
    }

    public void excluir(Long id) {
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        eventoRepository.delete(evento);
    }

    public EventoDTO criarEvento(EventoDTO eventoDTO) {
        EventoEntity evento = new EventoEntity();
        BeanUtils.copyProperties(eventoDTO, evento);
        UsuarioEntity usuario = usuarioRepository.findById(eventoDTO.getUser_id())
                .orElseThrow(() -> new RuntimeException("Usuário não existe "));
        evento.setUser(usuario);

        evento = eventoRepository.save(evento);

        EventoDTO dto = new EventoDTO();
        BeanUtils.copyProperties(evento, dto);
        dto.setUser_id(evento.getUser().getId());
        return dto;
    }

    @Transactional
    public EventoDTO atualizarEvento(Long id, EventoDTO eventoDto){
        EventoEntity evento = eventoRepository.findById(id).orElseThrow(() -> new RuntimeException("Evento não encontrado com ID: " + id));
        evento.setNome(eventoDto.getNome());
        evento.setEndereco(eventoDto.getEndereco());
        evento.setBairro(eventoDto.getBairro());
        evento.setCidade(eventoDto.getCidade());
        evento.setCep(eventoDto.getCep());
        evento.setHrinicio(eventoDto.getHrinicio());
        evento.setHrfim(eventoDto.getHrfim());
        evento.setDescricao(eventoDto.getDescricao());
        evento.setData(eventoDto.getData());
        evento.setStatus(eventoDto.getStatus());
        evento.setNmorganizador(eventoDto.getNmorganizador());

        EventoEntity eventoatualizado= eventoRepository.save(evento);

        return  new EventoDTO(eventoatualizado);

    }
}
