package com.adotaai.adotaai.Entity;

import com.adotaai.adotaai.DTO.UsuarioDTO;
import jakarta.persistence.*;
import org.springframework.beans.BeanUtils;

import java.util.Objects;

@Entity
@Table(name = "USUARIO")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String moradia;

    @Column(nullable = false)
    private int metragemMin;

    @Column(nullable = false)
    private int metragemMax;

    public UsuarioEntity (UsuarioDTO usuario)
    {
        BeanUtils.copyProperties(usuario,this);
    }

    public UsuarioEntity(){

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

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getMoradia() {
        return moradia;
    }

    public void setMoradia(String moradia) {
        this.moradia = moradia;
    }

    public int getMetragemMin() {
        return metragemMin;
    }

    public void setMetragemMin(int metragemMin) {
        this.metragemMin = metragemMin;
    }

    public int getMetragemMax() {
        return metragemMax;
    }

    public void setMetragemMax(int metragemMax) {
        this.metragemMax = metragemMax;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioEntity that = (UsuarioEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
