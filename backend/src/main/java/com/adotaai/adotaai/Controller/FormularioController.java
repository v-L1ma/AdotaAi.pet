package com.adotaai.adotaai.Controller;

import com.adotaai.adotaai.DTO.FormularioDTO;
import com.adotaai.adotaai.DTO.FormularioTemplateDTO; // <-- Importação adicionada
import com.adotaai.adotaai.Entity.FormularioEntity;
import com.adotaai.adotaai.Service.FormularioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<FormularioTemplateDTO> buscarFormularioPorId(@PathVariable Long id) {
        FormularioTemplateDTO dto = formularioService.buscarFormularioPorId(id);
        return ResponseEntity.ok(dto);
    }


    @GetMapping
    public ResponseEntity<List<FormularioTemplateDTO>> listarFormularios() {
        List<FormularioTemplateDTO> dtos = formularioService.listarFormularios();
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFormulario(@PathVariable Long id,
                                                  @RequestParam Long usuarioCriadorId) {
        formularioService.deletarFormulario(id, usuarioCriadorId);
        return ResponseEntity.noContent().build();
    }
}