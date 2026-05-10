package com.adotaai.adotaai.WebApi.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adotaai.adotaai.Application.DTO.AprovarReprovarRequestDTO;
import com.adotaai.adotaai.Application.DTO.EventoDTO;
import com.adotaai.adotaai.Application.Service.EventoService;
import com.adotaai.adotaai.Application.Util.BaseResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/eventos")

public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public List<EventoDTO> ListarEventos() {
        return eventoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> buscarEvento(@PathVariable UUID id) {
        return ResponseEntity.ok(eventoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<EventoDTO> criarEvento(@RequestBody EventoDTO evento) {
        EventoDTO criado = eventoService.criarEvento(evento);
        return ResponseEntity.ok(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoDTO> atualizarPet(@PathVariable UUID id, @RequestBody EventoDTO evento) {
        EventoDTO atualizado = eventoService.atualizarEvento(id, evento);
        return ResponseEntity.ok(atualizado);
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
