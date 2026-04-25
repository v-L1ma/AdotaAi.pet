package com.adotaai.adotaai.Application.DTO;

import com.adotaai.adotaai.Domain.Entity.EventoEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.sql.Time;
import java.util.UUID;

public class EventoDTO {

    private UUID id;
    private String nome;
    private String endereco;
    private String bairro;
    private String cidade;
    private String cep;
    private Time hrinicio;
    private String hrfim;
    private String descricao;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;
    private String status = "PENDENTE";
    private String nmorganizador;

    @JsonProperty("user_id")
    private UUID user_id;

    public EventoDTO(EventoEntity evento) {
        this.id = evento.getId();
        this.nome = evento.getNome();
        this.endereco = evento.getEndereco();
        this.bairro = evento.getBairro();
        this.cidade = evento.getCidade();
        this.cep = evento.getCep();
        this.hrinicio = evento.getHrinicio();
        this.hrfim = evento.getHrfim();
        this.descricao = evento.getDescricao();
        this.data = evento.getData();
        this.status = evento.getStatus();
        this.nmorganizador = evento.getNmorganizador();

        if (evento.getUser() != null) {
            this.user_id = evento.getUser().getId();
        }
    }

    public EventoDTO() {
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

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
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

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public Time getHrinicio() {
        return hrinicio;
    }

    public void setHrinicio(Time hrinicio) {
        this.hrinicio = hrinicio;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getHrfim() {
        return hrfim;
    }

    public void setHrfim(String hrfim) {
        this.hrfim = hrfim;
    }

    public String getNmorganizador() {
        return nmorganizador;
    }

    public void setNmorganizador(String nmorganizador) {
        this.nmorganizador = nmorganizador;
    }

    public UUID getUser_id() {
        return user_id;
    }

    public void setUser_id(UUID user_id) {
        this.user_id = user_id;
    }
}
