package com.adotaai.adotaai.Application.DTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.adotaai.adotaai.Domain.Entity.PetEntity;
import com.adotaai.adotaai.Domain.Entity.SolicitacaoAdocaoEntity;
import com.adotaai.adotaai.Domain.Enum.Status;

public class SolicitacaoResponseDTO {

    private UUID id;
    private UUID adotanteId;
    private UUID anuncianteId;
    private String adotanteNome;
    private String adotanteEmail;
    private String adotanteTelefone;
    private String anuncianteNome;
    private String anuncianteEmail;
    private String anuncianteTelefone;
    private String linkFotoPerfil;
    private UUID petId;
    private String petNome;
    private String petFoto;
    private Status status;
    private LocalDateTime dataSolicitacao;
    private List<PerguntaRespostaDTO> perguntasRespostas;

    public SolicitacaoResponseDTO(SolicitacaoAdocaoEntity entity) {
        this(entity, null, null);
    }

    public SolicitacaoResponseDTO(SolicitacaoAdocaoEntity entity, PetEntity pet) {
        this(entity, pet, null);
    }

    public SolicitacaoResponseDTO(SolicitacaoAdocaoEntity entity, PetEntity pet, String linkFotoPerfil) {
        this.id = entity.getId();
        this.adotanteId = entity.getAdotante().getId();
        this.anuncianteId = entity.getAnunciante().getId();
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
        this.linkFotoPerfil = linkFotoPerfil;
        if (pet != null) {
            this.petId = pet.getId();
            this.petNome = pet.getNome();
            this.petFoto = pet.getLink_foto();
        }
        this.status = entity.getStatus();
        this.dataSolicitacao = entity.getDataSolicitacao();
        this.perguntasRespostas = entity.getPerguntasRespostas().stream()
                .map(snapshot -> new PerguntaRespostaDTO(snapshot.getPerguntaId(), snapshot.getPerguntaTexto(), snapshot.getRespostaTexto()))
                .toList();
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

    public String getLinkFotoPerfil() {
        return linkFotoPerfil;
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

    public Status getStatus() {
        return status;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }

    public List<PerguntaRespostaDTO> getPerguntasRespostas() {
        return perguntasRespostas;
    }
}
