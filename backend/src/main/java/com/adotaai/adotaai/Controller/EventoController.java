package com.adotaai.adotaai.Controller;

import com.adotaai.adotaai.DTO.EventoDTO;
import com.adotaai.adotaai.DTO.PetDTO;
import com.adotaai.adotaai.Service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value= "/eventos")

public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public List<EventoDTO> ListarEventos(){
        return eventoService.listarTodos();
    }

    @PostMapping
    public void criarEvento(@RequestBody EventoDTO evento){
        eventoService.criarEvento(evento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoDTO> atualizarPet(@PathVariable Long id, @RequestBody EventoDTO evento) {
        EventoDTO atualizado = eventoService.atualizarEvento(id,evento);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id)
    {
        eventoService.excluir(id);
        return  ResponseEntity.ok().build();
    }

}
