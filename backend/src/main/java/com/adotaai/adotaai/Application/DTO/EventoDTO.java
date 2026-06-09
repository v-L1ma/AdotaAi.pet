package com.adotaai.adotaai.Application.DTO;

import com.adotaai.adotaai.Domain.Entity.EventoEntity;
import com.adotaai.adotaai.Domain.Enum.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class EventoDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    private String nome;
    private String endereco;
    private String bairro;
    private String cidade;
    private String cep;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime hrinicio;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime hrfim;
    private String descricao;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String status = Status.PENDENTE.name();

    private String link_foto;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String nmorganizador;

    @JsonProperty(value = "user_id", access = JsonProperty.Access.READ_ONLY)
    private UUID user_id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long contagemPresencas;

    private Boolean isInscrito;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String mensagemReprovado;

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
        this.link_foto = evento.getLink_foto();
        this.nmorganizador = evento.getNmorganizador();

        if (evento.getUser() != null) {
            this.user_id = evento.getUser().getId();
        }
        this.mensagemReprovado = evento.getMensagemReprovado();
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

    public String getHrInicio() {
        return hrinicio != null ? hrinicio.toString() : null;
    }

    public void setHrInicio(String hrinicio) {
        this.hrinicio = hrinicio != null && !hrinicio.isEmpty() ? LocalTime.parse(hrinicio) : null;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLink_foto() {
        return link_foto;
    }

    public void setLink_foto(String link_foto) {
        this.link_foto = link_foto;
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

    public String getHrFim() {
        return hrfim != null ? hrfim.toString() : null;
    }

    public void setHrFim(String hrfim) {
        this.hrfim = hrfim != null && !hrfim.isEmpty() ? LocalTime.parse(hrfim) : null;
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

    public Long getContagemPresencas() {
        return contagemPresencas;
    }

    public void setContagemPresencas(Long contagemPresencas) {
        this.contagemPresencas = contagemPresencas;
    }

    public Boolean getIsInscrito() {
        return isInscrito;
    }
    public void setIsInscrito(Boolean isInscrito) {
        this.isInscrito = isInscrito;
    }

    public String getMensagemReprovado() {
        return mensagemReprovado;
    }

    public void setMensagemReprovado(String mensagemReprovado) {
        this.mensagemReprovado = mensagemReprovado;
    }
    
}
