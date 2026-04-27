package com.adotaai.adotaai.Application.Service;

import com.adotaai.adotaai.Application.DTO.EsqueciSenhaDTO;
import com.adotaai.adotaai.Application.DTO.LoginRequestDTO;
import com.adotaai.adotaai.Application.DTO.LoginResponseDTO;
import com.adotaai.adotaai.Application.DTO.RefreshTokenRequestDTO;
import com.adotaai.adotaai.Application.DTO.RefreshTokenResponseDTO;
import com.adotaai.adotaai.Application.DTO.ResetarSenhaDTO;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
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
        String emailNormalizado = loginRequest.getEmail() == null ? "" : loginRequest.getEmail().trim().toLowerCase();

        UsuarioEntity usuario = usuarioRepository.findByEmailIgnoreCase(emailNormalizado)
                .orElseThrow(() -> new RegraDeNegocioException("Email e/ou senha inválidos."));

        if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            throw new RegraDeNegocioException("Email e/ou senha inválidos.");
        }

        if (Boolean.FALSE.equals(usuario.getFl_ativo())) {
            throw new RegraDeNegocioException("Usuário inativo.");
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getId(), usuario.getCargo());
        String refreshToken = jwtUtil.generateRefreshToken(usuario.getEmail(), usuario.getId(), usuario.getCargo());

        boolean isCadastroComplete = usuario.getCep() != null && !usuario.getCep().isBlank() &&
                                    usuario.getBairro() != null && !usuario.getBairro().isBlank() &&
                                    usuario.getCidade() != null && !usuario.getCidade().isBlank() &&
                                    usuario.getSg_estado() != null && !usuario.getSg_estado().isBlank() &&
                                    usuario.getTelefone() != null && !usuario.getTelefone().isBlank();

        return new LoginResponseDTO(token, refreshToken, usuario.getId(), usuario.getEmail(), usuario.getNome(), usuario.getCargo(), isCadastroComplete);
    }

    public RefreshTokenResponseDTO refresh(RefreshTokenRequestDTO refreshRequest) {
        if (refreshRequest == null || refreshRequest.getRefreshToken() == null || refreshRequest.getRefreshToken().isBlank()) {
            throw new RegraDeNegocioException("Refresh token inválido.");
        }

        String refreshToken = refreshRequest.getRefreshToken();
        String email;

        try {
            email = jwtUtil.extractEmail(refreshToken);
        } catch (Exception e) {
            throw new RegraDeNegocioException("Refresh token inválido.");
        }

        UsuarioEntity usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RegraDeNegocioException("Refresh token inválido."));

        if (!jwtUtil.validateRefreshToken(refreshToken, email)) {
            throw new RegraDeNegocioException("Refresh token inválido.");
        }

        if (Boolean.FALSE.equals(usuario.getFl_ativo())) {
            throw new RegraDeNegocioException("Usuário inativo.");
        }

        String newAccessToken = jwtUtil.generateToken(usuario.getEmail(), usuario.getId(), usuario.getCargo());
        String newRefreshToken = jwtUtil.generateRefreshToken(usuario.getEmail(), usuario.getId(), usuario.getCargo());

        return new RefreshTokenResponseDTO(newAccessToken, newRefreshToken);
    }

    @Transactional
    public void solicitarResetSenha(EsqueciSenhaDTO dto) {
        String emailNormalizado = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();

        UsuarioEntity usuario = usuarioRepository.findByEmailIgnoreCase(emailNormalizado)
                .orElseThrow(() -> new RegraDeNegocioException("E-mail não encontrado."));

        String token = UUID.randomUUID().toString();
        usuario.setResetToken(token);
        usuario.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        enviarEmailReset(usuario.getEmail(), token);
    }

    @Transactional
    public void resetarSenha(ResetarSenhaDTO dto) {
        UsuarioEntity usuario = usuarioRepository.findByResetToken(dto.getToken())
                .orElseThrow(() -> new RegraDeNegocioException("Token inválido."));

        if (usuario.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(usuario.getResetTokenExpiry())) {
            throw new RegraDeNegocioException("Token expirado.");
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
