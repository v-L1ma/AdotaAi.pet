package com.adotaai.adotaai.Entity;

import com.adotaai.adotaai.DTO.EventoDTO;
import com.adotaai.adotaai.DTO.PetDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.beans.BeanUtils;

import java.sql.Time;
import java.util.Date;
import java.util.Objects;
@Entity
@Table(name = "EVENTO")
public class EventoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String bairro;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false)
    private String cep;

    @Column(nullable = false)
    private Time hrinicio;

    @Column(nullable = false)
    private String hrfim;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private Date data;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String nmorganizador;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "user_id",
            foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES usuario_entity(id) ON DELETE CASCADE"))
    private UsuarioEntity user;


    public EventoEntity(EventoDTO eventoDTO, UsuarioEntity usuario) {
        BeanUtils.copyProperties(eventoDTO, this, "user");
        this.user = usuario;
    }

    public EventoEntity(){

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

    public String getHrfim() {
        return hrfim;
    }

    public void setHrfim(String hrfim) {
        this.hrfim = hrfim;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNmorganizador() {
        return nmorganizador;
    }

    public void setNmorganizador(String nmorganizador) {
        this.nmorganizador = nmorganizador;
    }

    public UsuarioEntity getUser() {
        return user;
    }

    public void setUser(UsuarioEntity user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        EventoEntity that = (EventoEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
