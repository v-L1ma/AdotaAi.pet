package com.adotaai.adotaai.Application.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

import com.adotaai.adotaai.Domain.Entity.PetEntity;
import com.adotaai.adotaai.Domain.Entity.SolicitacaoAdocaoEntity;
import com.adotaai.adotaai.Domain.Enum.StatusSolicitacao;

public class SolicitacaoResponseDTO {

    private UUID id;
    private UUID adotanteId;
    private UUID anuncianteId;
    private UUID formularioId;
    private String adotanteNome;
    private String adotanteEmail;
    private String adotanteTelefone;
    private String anuncianteNome;
    private String anuncianteEmail;
    private String anuncianteTelefone;
    private UUID petId;
    private String petNome;
    private String petFoto;
    private StatusSolicitacao status;
    private LocalDateTime dataSolicitacao;

    public SolicitacaoResponseDTO(SolicitacaoAdocaoEntity entity) {
        this(entity, null);
    }

    public SolicitacaoResponseDTO(SolicitacaoAdocaoEntity entity, PetEntity pet) {
        this.id = entity.getId();
        this.adotanteId = entity.getAdotante().getId();
        this.anuncianteId = entity.getAnunciante().getId();
        if (entity.getFormulario() != null) {
            this.formularioId = entity.getFormulario().getId();
        }
        if (entity.getAdotante() != null) {
            this.adotanteNome = entity.getAdotante().getNome();
            this.adotanteEmail = entity.getAdotante().getEmail();
            this.adotanteTelefone = entity.getAdotante().getTelefone();
        }
        if (entity.getAnunciante() != null) {
            this.anuncianteNome = entity.getAnunciante().getNome();
            this.anuncianteEmail = entity.getAnunciante().getEmail();
            this.anuncianteTelefone = entity.getAnunciante().getTelefone();
        }
        if (pet != null) {
            this.petId = pet.getId();
            this.petNome = pet.getNome();
            this.petFoto = pet.getLink_foto();
        }
        this.status = entity.getStatus();
        this.dataSolicitacao = entity.getDataSolicitacao();
    }

    public UUID getId() {
        return id;
    }

    public UUID getAdotanteId() {
        return adotanteId;
    }

    public UUID getAnuncianteId() {
        return anuncianteId;
    }

    public UUID getFormularioId() {
        return formularioId;
    }

    public String getAdotanteNome() {
        return adotanteNome;
    }

    public String getAdotanteEmail() {
        return adotanteEmail;
    }

    public String getAdotanteTelefone() {
        return adotanteTelefone;
    }

    public String getAnuncianteNome() {
        return anuncianteNome;
    }

    public String getAnuncianteEmail() {
        return anuncianteEmail;
    }

    public String getAnuncianteTelefone() {
        return anuncianteTelefone;
    }

    public UUID getPetId() {
        return petId;
    }

    public String getPetNome() {
        return petNome;
    }

    public String getPetFoto() {
        return petFoto;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }
}
