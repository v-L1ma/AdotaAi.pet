package com.adotaai.adotaai.WebApi.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.adotaai.adotaai.Application.DTO.AprovarReprovarRequestDTO;
import com.adotaai.adotaai.Application.DTO.EventoDTO;
import com.adotaai.adotaai.Application.Service.EventoService;
import com.adotaai.adotaai.Application.Util.BaseResponse;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/eventos")

public class EventoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<EventoDTO> ListarEventos() {
        return eventoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> buscarEvento(@PathVariable UUID id) {
        return ResponseEntity.ok(eventoService.buscarPorId(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventoDTO> criarEvento(
            @RequestPart("dados") String dadosJson,
            @RequestPart(required = false) MultipartFile imagem) {
        EventoDTO evento = parseDados(dadosJson);
        EventoDTO criado = eventoService.criarEvento(evento, imagem);
        return ResponseEntity.ok(criado);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventoDTO> atualizarEvento(
            @PathVariable UUID id,
            @RequestPart(value = "dados", required = false) String dadosJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        
        EventoDTO evento;
        if (dadosJson != null) {
            evento = parseDados(dadosJson);
        } else {
            evento = new EventoDTO();
        }
        
        EventoDTO atualizado = eventoService.atualizarEvento(id, evento, imagem);
        return ResponseEntity.ok(atualizado);
    }

    private EventoDTO parseDados(String dadosJson) {
        try {
            return objectMapper.readValue(dadosJson, EventoDTO.class);
        } catch (JsonProcessingException exception) {
            throw new RegraDeNegocioException("Dados do evento inválidos no part 'dados'.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") UUID id) {
        eventoService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/presenca")
    public ResponseEntity<Void> registrarPresenca(@PathVariable UUID id) {
        eventoService.registrarPresenca(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/presenca")
    public ResponseEntity<Void> removerPresenca(@PathVariable UUID id) {
        eventoService.removerPresenca(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pendentes")
    public ResponseEntity<BaseResponse<EventoDTO>> listarEventosPendentes() {
        List<EventoDTO> pendentes = eventoService.listarEventosPendentes();
        BaseResponse<EventoDTO> response = new BaseResponse<>();
        response.setMessage("Eventos pendentes listados com sucesso.");
        response.setData(pendentes);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<BaseResponse<String>> aprovarEvento(@PathVariable UUID id) {
        eventoService.aprovarEvento(id);
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Evento aprovado com sucesso.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reprovar")
    public ResponseEntity<BaseResponse<String>> reprovarEvento(@PathVariable UUID id, @Valid @RequestBody AprovarReprovarRequestDTO request) {
        eventoService.reprovarEvento(id, request.getMotivo());
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Evento reprovado com sucesso.");
        return ResponseEntity.ok(response);
    }
}
