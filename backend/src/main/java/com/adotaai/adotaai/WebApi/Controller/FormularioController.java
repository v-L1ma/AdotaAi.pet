package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.FormularioDTO;
import com.adotaai.adotaai.Application.DTO.FormularioTemplateDTO;
import com.adotaai.adotaai.Domain.Entity.FormularioEntity;
import com.adotaai.adotaai.Application.Service.IFormularioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/formularios")
public class FormularioController {

    private final IFormularioService formularioService;

    public FormularioController(IFormularioService formularioService) {
        this.formularioService = formularioService;
    }

    @PostMapping
    public ResponseEntity<FormularioEntity> criarFormulario(@Valid @RequestBody FormularioDTO dto) {
        FormularioEntity formularioCriado = formularioService.criarFormulario(dto);
        return new ResponseEntity<>(formularioCriado, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormularioTemplateDTO> atualizarFormulario(@PathVariable UUID id, @Valid @RequestBody FormularioDTO dto) {
        FormularioTemplateDTO formularioAtualizado = formularioService.atualizarFormulario(id, dto);
        return ResponseEntity.ok(formularioAtualizado);
    }

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
    public ResponseEntity<Void> deletarFormulario(@PathVariable UUID id) {
        formularioService.deletarFormulario(id);
        return ResponseEntity.noContent().build();
    }
}