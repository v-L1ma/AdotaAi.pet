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

import com.adotaai.adotaai.Application.DTO.EventoDTO;
import com.adotaai.adotaai.Application.Service.EventoService;

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

}
