package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;

public class UsuarioPublicoDTO {

    private UUID id;
    private String nome;
    private String link_foto;
    private String cidade;
    private String sg_estado;

    public UsuarioPublicoDTO() {
    }

    public UsuarioPublicoDTO(UsuarioEntity usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.link_foto = usuario.getLink_foto();
        this.cidade = usuario.getCidade();
        this.sg_estado = usuario.getSg_estado();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLink_foto() {
        return link_foto;
    }

    public void setLink_foto(String link_foto) {
        this.link_foto = link_foto;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getSg_estado() {
        return sg_estado;
    }

    public void setSg_estado(String sg_estado) {
        this.sg_estado = sg_estado;
    }
}
