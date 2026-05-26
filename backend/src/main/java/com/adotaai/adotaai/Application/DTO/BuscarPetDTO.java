package com.adotaai.adotaai.Application.DTO;

import java.time.LocalDate;
import java.util.UUID;

public class BuscarPetDTO {

    private UUID id;
    private String status;
    private String descricao;
    private LocalDate dt_nasc;
    private String nome;
    private String porte;
    private String genero;
    private String raca;
    private UUID racaId;
    private String especie;
    private String link_foto;
    private UUID formularioId;
    private boolean isFavoritado;
    private DonoDTO dono;
    private String bairro;
    private String cidade;
    private String uf;

    public BuscarPetDTO() {
    }

    public BuscarPetDTO(UUID id, String status, String descricao,
                        LocalDate dataNascimento, String nome, String porte,
                        String genero, String raca, UUID racaId, String especie, String linkFoto, UUID formularioId,
                        boolean isFavoritado, DonoDTO dono, String bairro, String cidade, String uf) {
        this.id = id;
        this.status = status;
        this.descricao = descricao;
        this.dt_nasc = dataNascimento;
        this.nome = nome;
        this.porte = porte;
        this.genero = genero;
        this.raca = raca;
        this.racaId = racaId;
        this.especie = especie;
        this.link_foto = linkFoto;
        this.formularioId = formularioId;
        this.isFavoritado = isFavoritado;
        this.dono = dono;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getDt_nasc() {
        return dt_nasc;
    }

    public void setDt_nasc(LocalDate dt_nasc) {
        this.dt_nasc = dt_nasc;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPorte() {
        return porte;
    }

    public void setPorte(String porte) {
        this.porte = porte;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getRaca() {
        return raca;
    }

    public void setRaca(String raca) {
        this.raca = raca;
    }

    public UUID getRacaId() {
        return racaId;
    }

    public void setRacaId(UUID racaId) {
        this.racaId = racaId;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getLink_foto() {
        return link_foto;
    }

    public void setLink_foto(String link_foto) {
        this.link_foto = link_foto;
    }

    public UUID getFormularioId() {
        return formularioId;
    }

    public void setFormularioId(UUID formularioId) {
        this.formularioId = formularioId;
    }

    public boolean isFavoritado() {
        return isFavoritado;
    }

    public void setFavoritado(boolean isFavoritado) {
        this.isFavoritado = isFavoritado;
    }

    public DonoDTO getDono() {
        return dono;
    }

    public void setDono(DonoDTO dono) {
        this.dono = dono;
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

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public static class DonoDTO {
        private UUID id;
        private String nome;
        private String linkFotoPerfil;

        public DonoDTO() {
        }

        public DonoDTO(UUID id, String nome, String linkFotoPerfil) {
            this.id = id;
            this.nome = nome;
            this.linkFotoPerfil = linkFotoPerfil;
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

        public String getLinkFotoPerfil() {
            return linkFotoPerfil;
        }

        public void setLinkFotoPerfil(String linkFotoPerfil) {
            this.linkFotoPerfil = linkFotoPerfil;
        }
    }
}