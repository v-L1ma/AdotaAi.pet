package com.adotaai.adotaai.Domain.Entity;

import java.time.LocalDate;
import java.util.Objects;

import org.springframework.beans.BeanUtils;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.UUID;

import com.adotaai.adotaai.Application.DTO.PetDTO;

@Entity
@Table(name = "PET")
public class PetEntity extends AuditableEntity {

    @Id
    @GeneratedValue()
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = true)
    private String mensagemReprovado;

    @Column(nullable = false)
    private LocalDate dt_nasc;

    @Column(nullable = false)
    private String porte;

    @Column(nullable = false)
    private String raca;

    @ManyToOne
    @JoinColumn(name = "raca_id", nullable = true, foreignKey = @ForeignKey(name = "raca_id",
            foreignKeyDefinition = "FOREIGN KEY (raca_id) REFERENCES racas(id)"))
    private RacaEntity racaEntity;

    @Column(nullable = false)
    private String especie;

    @ManyToOne
    @JoinColumn(name = "especie_id", nullable = true, foreignKey = @ForeignKey(name = "especie_id",
            foreignKeyDefinition = "FOREIGN KEY (especie_id) REFERENCES especies(id)"))
    private EspecieEntity especieEntity;

    @Column(nullable = false)
    private String link_foto;

        @ManyToOne
        @JoinColumn(name = "formulario_id", nullable = true, foreignKey = @ForeignKey(name = "formulario_id",
            foreignKeyDefinition = "FOREIGN KEY (formulario_id) REFERENCES formularios(id)"))
        private FormularioEntity formulario;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "user_id",
            foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE"))
    private UsuarioEntity user;

    public PetEntity(PetDTO petDTO, UsuarioEntity usuario) {
        BeanUtils.copyProperties(petDTO, this, "user");
        this.user = usuario;
    }

    public PetEntity() {
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

    public RacaEntity getRacaEntity() {
        return racaEntity;
    }

    public void setRacaEntity(RacaEntity racaEntity) {
        this.racaEntity = racaEntity;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public EspecieEntity getEspecieEntity() {
        return especieEntity;
    }

    public void setEspecieEntity(EspecieEntity especieEntity) {
        this.especieEntity = especieEntity;
    }

    public String getLink_foto() {
        return link_foto;
    }

    public void setLink_foto(String link_foto) {
        this.link_foto = link_foto;
    }

    public FormularioEntity getFormulario() {
        return formulario;
    }

    public void setFormulario(FormularioEntity formulario) {
        this.formulario = formulario;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PetEntity petEntity = (PetEntity) o;
        return Objects.equals(id, petEntity.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    public UsuarioEntity getUser() {
        return user;
    }

    public void setUser(UsuarioEntity user) {
        this.user = user;
    }

    public String getMensagemReprovado() {
        return mensagemReprovado;
    }

    public void setMensagemReprovado(String mensagemReprovado) {
        this.mensagemReprovado = mensagemReprovado;
    }
}
