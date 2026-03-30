package com.adotaai.adotaai.Infraestructure.Security;

import java.io.IOException;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.adotaai.adotaai.Application.Util.BaseResponse;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CadastroCompletoFilter extends OncePerRequestFilter {

    private static final Set<String> ROTAS_LIBERADAS = Set.of(
            "/auth/login",
            "/auth/refresh",
            "/auth/esqueci-senha",
            "/auth/resetar-senha",
            "/usuario",
            "/swagger-ui",
            "/v3/api-docs",
            "/lookups/racas",
            "/uploads"
    );

    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper objectMapper;

    public CadastroCompletoFilter(UsuarioRepository usuarioRepository, ObjectMapper objectMapper) {
        this.usuarioRepository = usuarioRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (isRotaLiberada(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            filterChain.doFilter(request, response);
            return;
        }

        UsuarioEntity usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName()).orElse(null);
        if (usuario == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!cadastroCompleto(usuario)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            BaseResponse<String> payload = new BaseResponse<>();
            payload.setMessage("Cadastro incompleto");
            payload.getErrors().add("Finalize seu cadastro para acessar este recurso.");

            response.getWriter().write(objectMapper.writeValueAsString(payload));
            return;
        }

        
        System.out.println("PASSOU NO FILTRO DE CADASTRO COMPLETO PARA O USUÁRIO: " + usuario.getEmail());

        filterChain.doFilter(request, response);
    }

    private boolean isRotaLiberada(HttpServletRequest request) {
        String path = request.getRequestURI();

        if ("PUT".equalsIgnoreCase(request.getMethod()) && "/usuario".equals(path)) {
            return true;
        }

        return ROTAS_LIBERADAS.stream().anyMatch(path::startsWith);
    }

    private boolean cadastroCompleto(UsuarioEntity usuario) {
        boolean isValid = temTexto(usuario.getTelefone())
                && temTexto(usuario.getEndereco())
                && temTexto(usuario.getCep())
                && temTexto(usuario.getBairro())
                && temTexto(usuario.getCidade())
                && temTexto(usuario.getSg_estado());
                // && temTexto(usuario.getLink_foto())

        System.out.println("Verificando cadastro completo para usuário: " + usuario.toString());
        System.out.println("Resultado: " + isValid);
        return isValid;
    }

    private boolean temTexto(String valor) {
        return valor != null && !valor.trim().isEmpty();
    }
}
