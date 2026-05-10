package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.*;
import com.adotaai.adotaai.Application.Service.ISolicitacaoAdocaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoAdocaoController {

    private final ISolicitacaoAdocaoService solicitacaoService;

    public SolicitacaoAdocaoController(ISolicitacaoAdocaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criarSolicitacao(@Valid @RequestBody SolicitacaoAdocaoDTO dto) {
        SolicitacaoResponseDTO novaSolicitacaoDTO = solicitacaoService.criarSolicitacao(dto);
        return new ResponseEntity<>(novaSolicitacaoDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormularioDetalhadoDTO> buscarSolicitacaoDetalhada(@PathVariable UUID id) {
        FormularioDetalhadoDTO dto = solicitacaoService.buscarSolicitacaoDetalhada(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponseDTO> aprovarSolicitacao(@PathVariable UUID id) {
        SolicitacaoResponseDTO solicitacaoAprovadaDTO = solicitacaoService.aprovarSolicitacao(id);
        return ResponseEntity.ok(solicitacaoAprovadaDTO);
    }

    @PutMapping("/{id}/recusar")
    public ResponseEntity<SolicitacaoResponseDTO> recusarSolicitacao(@PathVariable UUID id) {
        SolicitacaoResponseDTO solicitacaoRecusadaDTO = solicitacaoService.recusarSolicitacao(id);
        return ResponseEntity.ok(solicitacaoRecusadaDTO);
    }

    @GetMapping("/recebidas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarRecebidas() {
        return ResponseEntity.ok(solicitacaoService.listarRecebidas());
    }

    @GetMapping("/enviadas")
public ResponseEntity<List<SolicitacaoResponseDTO>> listarEnviadas() {
        return ResponseEntity.ok(solicitacaoService.listarEnviadas());
    }
}