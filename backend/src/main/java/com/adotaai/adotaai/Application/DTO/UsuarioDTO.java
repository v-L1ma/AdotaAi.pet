package com.adotaai.adotaai.Application.DTO;

import org.springframework.beans.BeanUtils;

import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;

public class UsuarioDTO {

    private String nome;
    private String cpfcnpj;
    private String email;
    private String senha;
    private String telefone;
    private String link_foto;
    private String endereco;
    private String cep;
    private String bairro;
    private String cidade;
    private String sg_estado;

    public UsuarioDTO(UsuarioEntity usuario) {
        BeanUtils.copyProperties(usuario, this);
    }

    public UsuarioDTO() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpfcnpj() {
        return cpfcnpj;
    }

    public void setCpfcnpj(String cpfcnpj) {
        this.cpfcnpj = cpfcnpj;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
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

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
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
