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
    private String raca;
    private String especie;
    private String link_foto;
    private boolean isFavoritado;
    private DonoDTO dono;

    public BuscarPetDTO() {
    }

    public BuscarPetDTO(UUID id, String status, String descricao,
                        LocalDate dataNascimento, String nome, String porte,
                        String raca, String especie, String linkFoto, boolean isFavoritado, DonoDTO dono) {
        this.id = id;
        this.status = status;
        this.descricao = descricao;
        this.dt_nasc = dataNascimento;
        this.nome = nome;
        this.porte = porte;
        this.raca = raca;
        this.especie = especie;
        this.link_foto = linkFoto;
        this.isFavoritado = isFavoritado;
        this.dono = dono;
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

    public String getRaca() {
        return raca;
    }

    public void setRaca(String raca) {
        this.raca = raca;
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

    public static class DonoDTO {
        private UUID id;
        private String nome;

        public DonoDTO() {
        }

        public DonoDTO(UUID id, String nome) {
            this.id = id;
            this.nome = nome;
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
    }
}