package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

import com.adotaai.adotaai.Domain.Entity.Roles;

public class LoginResponseDTO {

    private String token;
    private String tipo = "Bearer";
    private UUID id;
    private String email;
    private String nome;
    private Roles cargo;

    public LoginResponseDTO(String token, UUID id, String email, String nome, Roles cargo) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.cargo = cargo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Roles getCargo() {
        return cargo;
    }

    public void setCargo(Roles cargo) {
        this.cargo = cargo;
    }
}
