package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.EsqueciSenhaDTO;
import com.adotaai.adotaai.Application.DTO.LoginRequestDTO;
import com.adotaai.adotaai.Application.DTO.LoginResponseDTO;
import com.adotaai.adotaai.Application.DTO.ResetarSenhaDTO;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;
import com.adotaai.adotaai.Application.Util.JwtUtil;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

    public AuthService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            JavaMailSender mailSender) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email e/ou senha inválidos."));

        if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Email e/ou senha inválidos.");
        }

        if (Boolean.FALSE.equals(usuario.getFl_ativo())) {
            throw new RuntimeException("Usuário inativo.");
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getId(), usuario.getCargo());
        return new LoginResponseDTO(token, usuario.getId(), usuario.getEmail(), usuario.getNome(), usuario.getCargo());
    }

    @Transactional
    public void solicitarResetSenha(EsqueciSenhaDTO dto) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado."));

        String token = UUID.randomUUID().toString();
        usuario.setResetToken(token);
        usuario.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        enviarEmailReset(usuario.getEmail(), token);
    }

    @Transactional
    public void resetarSenha(ResetarSenhaDTO dto) {
        UsuarioEntity usuario = usuarioRepository.findByResetToken(dto.getToken())
                .orElseThrow(() -> new RuntimeException("Token inválido."));

        if (usuario.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(usuario.getResetTokenExpiry())) {
            throw new RuntimeException("Token expirado.");
        }

        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        usuario.setResetToken(null);
        usuario.setResetTokenExpiry(null);
        usuarioRepository.save(usuario);
    }

    private void enviarEmailReset(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("AdotaAí - Redefinição de senha");
            message.setText("Use o token abaixo para redefinir sua senha:\n\n" + token
                    + "\n\nEste token expira em 1 hora.");
            mailSender.send(message);
        } catch (MailException e) {
            logger.warn("Não foi possível enviar o e-mail de redefinição de senha para {}. Token: {}", email, token);
        }
    }
}
