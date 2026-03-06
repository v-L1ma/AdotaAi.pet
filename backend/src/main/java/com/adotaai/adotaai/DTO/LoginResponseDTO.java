package com.adotaai.adotaai.DTO;

public class LoginResponseDTO {

    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String email;
    private String nome;
    private String cargo;

    public LoginResponseDTO(String token, Long id, String email, String nome, String cargo) {
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }
}
