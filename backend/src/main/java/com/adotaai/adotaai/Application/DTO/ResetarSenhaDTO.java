package com.adotaai.adotaai.Application.DTO;

public class ResetarSenhaDTO {

    private String token;
    private String novaSenha;

    public ResetarSenhaDTO() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }
}
