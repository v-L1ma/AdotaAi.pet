package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.RacaDTO;
import com.adotaai.adotaai.Application.Service.RacaService;
import com.adotaai.adotaai.Application.Util.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/racas")
public class RacaController {

    @Autowired
    private RacaService racaService;

    @GetMapping
    public ResponseEntity<BaseResponse<RacaDTO>> listarTodas(@RequestParam(required = false) UUID especieId) {
        List<RacaDTO> racas = racaService.listarTodas(especieId);
        BaseResponse<RacaDTO> response = new BaseResponse<>();
        response.setMessage("Raças listadas com sucesso.");
        response.setData(racas);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<RacaDTO>> buscarPorId(@PathVariable UUID id) {
        RacaDTO raca = racaService.buscarPorId(id);
        BaseResponse<RacaDTO> response = new BaseResponse<>();
        response.setMessage("Raça encontrada.");
        response.setData(List.of(raca));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<BaseResponse<RacaDTO>> criar(@RequestBody RacaDTO dto) {
        RacaDTO criada = racaService.criar(dto);
        BaseResponse<RacaDTO> response = new BaseResponse<>();
        response.setMessage("Raça criada com sucesso.");
        response.setData(List.of(criada));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<RacaDTO>> atualizar(@PathVariable UUID id, @RequestBody RacaDTO dto) {
        RacaDTO atualizada = racaService.atualizar(id, dto);
        BaseResponse<RacaDTO> response = new BaseResponse<>();
        response.setMessage("Raça atualizada com sucesso.");
        response.setData(List.of(atualizada));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<String>> excluir(@PathVariable UUID id) {
        racaService.excluir(id);
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Raça excluída com sucesso.");
        return ResponseEntity.ok(response);
    }
}
