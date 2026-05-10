package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.*;
import java.util.List;
import java.util.UUID;

public interface ISolicitacaoAdocaoService {
    SolicitacaoResponseDTO criarSolicitacao(SolicitacaoAdocaoDTO dto);
    FormularioDetalhadoDTO buscarSolicitacaoDetalhada(UUID solicitacaoId);
    SolicitacaoResponseDTO aprovarSolicitacao(UUID solicitacaoId);
    SolicitacaoResponseDTO recusarSolicitacao(UUID solicitacaoId);
    List<SolicitacaoResponseDTO> listarRecebidas();
    List<SolicitacaoResponseDTO> listarEnviadas();
}