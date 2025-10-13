package com.adotaai.adotaai.DTO;

import com.adotaai.adotaai.Entity.PetEntity;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import org.springframework.beans.BeanUtils;

import java.util.List;

public class UsuarioDTO {

    private Long id;
    private String nome;
    private String cpfcnpj;
    private String email;
    private String senha;
    private String telefone;
    private String cargo ="USER";
    private String link_foto;
    private String endereco;
    private String cep;
    private String bairro;
    private String cidade;
    private String sg_estado;
    private String status = "ATIVO";


    public UsuarioDTO(UsuarioEntity usuario){
        BeanUtils.copyProperties(usuario, this);
    }

    public UsuarioDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
