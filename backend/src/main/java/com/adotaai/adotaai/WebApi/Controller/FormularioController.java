package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.FormularioDTO;
import com.adotaai.adotaai.Application.DTO.FormularioTemplateDTO; // <-- Importação adicionada
import com.adotaai.adotaai.Domain.Entity.FormularioEntity;
import com.adotaai.adotaai.Application.Service.FormularioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/formularios")
public class FormularioController {

    private final FormularioService formularioService;

    public FormularioController(FormularioService formularioService) {
        this.formularioService = formularioService;
    }

    @PostMapping
    public ResponseEntity<FormularioEntity> criarFormulario(@RequestBody FormularioDTO dto) {
        FormularioEntity formularioCriado = formularioService.criarFormulario(dto);
        return new ResponseEntity<>(formularioCriado, HttpStatus.CREATED);
    }

    // --- MUDANÇA APLICADA AQUI ---
    @GetMapping("/{id}")
    public ResponseEntity<FormularioTemplateDTO> buscarFormularioPorId(@PathVariable UUID id) {
        FormularioTemplateDTO dto = formularioService.buscarFormularioPorId(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<FormularioTemplateDTO>> listarFormularios() {
        List<FormularioTemplateDTO> dtos = formularioService.listarFormularios();
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFormulario(@PathVariable UUID id,
            @RequestParam UUID usuarioCriadorId) {
        formularioService.deletarFormulario(id, usuarioCriadorId);
        return ResponseEntity.noContent().build();
    }
}
