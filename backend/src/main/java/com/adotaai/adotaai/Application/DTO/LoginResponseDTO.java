package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

import com.adotaai.adotaai.Domain.Entity.Roles;

public class LoginResponseDTO {

    private String token;
    private String refreshToken;
    private String tipo = "Bearer";
    private UUID id;
    private String email;
    private String nome;
    private Roles cargo;
    private boolean isCadastroComplete;

    public LoginResponseDTO(String token, String refreshToken, UUID id, String email, String nome, Roles cargo, boolean isCadastroComplete) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.cargo = cargo;
        this.isCadastroComplete = isCadastroComplete;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
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

    public boolean isCadastroComplete() {
        return isCadastroComplete;
    }

    public void setCadastroComplete(boolean cadastroComplete) {
        isCadastroComplete = cadastroComplete;
    }
}
