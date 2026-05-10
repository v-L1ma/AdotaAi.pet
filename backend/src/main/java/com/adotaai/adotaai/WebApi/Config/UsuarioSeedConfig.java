package com.adotaai.adotaai.WebApi.Config;

import com.adotaai.adotaai.Domain.Entity.Roles;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class UsuarioSeedConfig {

    @Bean
    @Order(1)
    CommandLineRunner seedUsuarioAdministrador(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!usuarioRepository.findByEmailIgnoreCase("admin@adotaai.com").isPresent()) {
                UsuarioEntity admin = new UsuarioEntity();
                admin.setNome("Administrador");
                admin.setEmail("admin@adotaai.com");
                admin.setCpfcnpj("00000000000");
                admin.setSenha(passwordEncoder.encode("admin123"));
                admin.setCargo(Roles.ADMINISTRADOR);
                admin.setTelefone("0000000000");
                admin.setEndereco("Endereço do Administrador");
                admin.setBairro("Bairro do Administrador");
                admin.setCidade("Cidade do Administrador");
                admin.setCep("1111111");
                admin.setSg_estado("SP");
                admin.setFl_ativo(true);
                admin.setCreated_at(LocalDateTime.now());
                admin.setCreated_by(null);
                usuarioRepository.save(admin);
            }
        };
    }
}