package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

import com.adotaai.adotaai.Domain.Entity.Roles;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;

public class UsuarioAdminDTO {

    private UUID id;
    private String nome;
    private String email;
    private String cpfcnpj;
    private String telefone;
    private String link_foto;
    private Roles cargo;
    private boolean fl_ativo;

    public UsuarioAdminDTO() {
    }

    public UsuarioAdminDTO(UsuarioEntity usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.cpfcnpj = usuario.getCpfcnpj();
        this.telefone = usuario.getTelefone();
        this.link_foto = usuario.getLink_foto();
        this.cargo = usuario.getCargo();
        this.fl_ativo = usuario.getFl_ativo();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpfcnpj() {
        return cpfcnpj;
    }

    public void setCpfcnpj(String cpfcnpj) {
        this.cpfcnpj = cpfcnpj;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getLink_foto() {
        return link_foto;
    }

    public void setLink_foto(String link_foto) {
        this.link_foto = link_foto;
    }

    public Roles getCargo() {
        return cargo;
    }

    public void setCargo(Roles cargo) {
        this.cargo = cargo;
    }

    public boolean isFl_ativo() {
        return fl_ativo;
    }

    public void setFl_ativo(boolean fl_ativo) {
        this.fl_ativo = fl_ativo;
    }
}