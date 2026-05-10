package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, UUID> {

    @Query("SELECT u FROM UsuarioEntity u WHERE u.fl_ativo = true")
    List<UsuarioEntity> findAllByFl_ativoTrue();

    List<UsuarioEntity> findAll();

    @Query("SELECT u FROM UsuarioEntity u WHERE u.id = :id AND u.fl_ativo = true")
    Optional<UsuarioEntity> findByIdAndFl_ativoTrue(UUID id);

    Optional<UsuarioEntity> findByEmail(String email);

    @Query("SELECT u FROM UsuarioEntity u WHERE LOWER(u.email) = LOWER(:email) AND u.fl_ativo = true")
    Optional<UsuarioEntity> findByEmailIgnoreCaseAndFl_ativoTrue(String email);

    Optional<UsuarioEntity> findByEmailIgnoreCase(String email);

    Optional<UsuarioEntity> findByCpfcnpj(String cpfcnpj);

    Optional<UsuarioEntity> findByResetToken(String resetToken);

}
