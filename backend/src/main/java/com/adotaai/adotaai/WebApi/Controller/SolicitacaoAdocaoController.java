package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.FormularioDetalhadoDTO;
import com.adotaai.adotaai.Application.DTO.RespostaDTO;
import com.adotaai.adotaai.Application.DTO.RespostaResponseDTO;
import com.adotaai.adotaai.Application.DTO.SolicitacaoAdocaoDTO;
import com.adotaai.adotaai.Application.DTO.SolicitacaoResponseDTO;
import com.adotaai.adotaai.Application.Service.SolicitacaoAdocaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoAdocaoController {

    private final SolicitacaoAdocaoService solicitacaoService;

    public SolicitacaoAdocaoController(SolicitacaoAdocaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criarSolicitacao(@RequestBody SolicitacaoAdocaoDTO dto) {
        SolicitacaoResponseDTO novaSolicitacaoDTO = solicitacaoService.criarSolicitacao(dto);
        return new ResponseEntity<>(novaSolicitacaoDTO, HttpStatus.CREATED);
    }

    @PostMapping("/respostas")
    public ResponseEntity<RespostaResponseDTO> salvarResposta(@RequestBody RespostaDTO dto) {
        RespostaResponseDTO novaRespostaDTO = solicitacaoService.salvarResposta(dto);
        return new ResponseEntity<>(novaRespostaDTO, HttpStatus.CREATED);
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
}
