package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class FormularioDTO {

    @Size(min = 1, max = 20, message = "A lista de perguntas deve conter entre 1 e 20 itens.")
    private List<
            @NotBlank(message = "A pergunta não pode estar vazia.")
            @Size(max = 120, message = "A pergunta deve conter no máximo 120 caracteres.")
            String
            > perguntas;

    public List<String> getPerguntas() {
        return perguntas;
    }

    public void setPerguntas(List<String> perguntas) {
        this.perguntas = perguntas;
    }
}