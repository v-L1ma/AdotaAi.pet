package com.adotaai.adotaai.Controller;

import com.adotaai.adotaai.DTO.FormularioDetalhadoDTO;
import com.adotaai.adotaai.DTO.RespostaDTO;
import com.adotaai.adotaai.DTO.RespostaResponseDTO;
import com.adotaai.adotaai.DTO.SolicitacaoAdocaoDTO;
import com.adotaai.adotaai.DTO.SolicitacaoResponseDTO;
import com.adotaai.adotaai.Service.SolicitacaoAdocaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<FormularioDetalhadoDTO> buscarSolicitacaoDetalhada(@PathVariable Long id) {
        FormularioDetalhadoDTO dto = solicitacaoService.buscarSolicitacaoDetalhada(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponseDTO> aprovarSolicitacao(@PathVariable Long id) {
        SolicitacaoResponseDTO solicitacaoAprovadaDTO = solicitacaoService.aprovarSolicitacao(id);
        return ResponseEntity.ok(solicitacaoAprovadaDTO);
    }

    @PutMapping("/{id}/recusar")
    public ResponseEntity<SolicitacaoResponseDTO> recusarSolicitacao(@PathVariable Long id) {
        SolicitacaoResponseDTO solicitacaoRecusadaDTO = solicitacaoService.recusarSolicitacao(id);
        return ResponseEntity.ok(solicitacaoRecusadaDTO);
    }
}