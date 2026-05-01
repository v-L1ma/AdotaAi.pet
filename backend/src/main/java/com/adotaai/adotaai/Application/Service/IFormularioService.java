package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.FormularioDTO;
import com.adotaai.adotaai.Application.DTO.FormularioTemplateDTO;
import com.adotaai.adotaai.Domain.Entity.FormularioEntity;

import java.util.List;
import java.util.UUID;

public interface IFormularioService {
    FormularioEntity criarFormulario(FormularioDTO dto);
    FormularioTemplateDTO atualizarFormulario(UUID id, FormularioDTO dto);
    List<FormularioTemplateDTO> listarFormularios();
    FormularioTemplateDTO buscarFormularioPorId(UUID id);
    void deletarFormulario(UUID formularioId);
}