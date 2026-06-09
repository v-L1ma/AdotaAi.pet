package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.EspecieDTO;
import com.adotaai.adotaai.Application.Service.EspecieService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/especies")
public class EspecieController {

    @Autowired
    private EspecieService especieService;

    @GetMapping
    public ResponseEntity<BaseResponse<EspecieDTO>> listarTodas() {
        List<EspecieDTO> especies = especieService.listarTodas();
        BaseResponse<EspecieDTO> response = new BaseResponse<>();
        response.setMessage("Espécies listadas com sucesso.");
        response.setData(especies);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<EspecieDTO>> buscarPorId(@PathVariable UUID id) {
        EspecieDTO especie = especieService.buscarPorId(id);
        BaseResponse<EspecieDTO> response = new BaseResponse<>();
        response.setMessage("Espécie encontrada.");
        response.setData(List.of(especie));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<BaseResponse<EspecieDTO>> criar(@RequestBody EspecieDTO dto) {
        EspecieDTO criada = especieService.criar(dto);
        BaseResponse<EspecieDTO> response = new BaseResponse<>();
        response.setMessage("Espécie criada com sucesso.");
        response.setData(List.of(criada));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<EspecieDTO>> atualizar(@PathVariable UUID id, @RequestBody EspecieDTO dto) {
        EspecieDTO atualizada = especieService.atualizar(id, dto);
        BaseResponse<EspecieDTO> response = new BaseResponse<>();
        response.setMessage("Espécie atualizada com sucesso.");
        response.setData(List.of(atualizada));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<String>> excluir(@PathVariable UUID id) {
        especieService.excluir(id);
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Espécie excluída com sucesso.");
        return ResponseEntity.ok(response);
    }
}
