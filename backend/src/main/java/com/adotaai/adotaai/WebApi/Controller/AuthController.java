package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.EsqueciSenhaDTO;
import com.adotaai.adotaai.Application.DTO.LoginRequestDTO;
import com.adotaai.adotaai.Application.DTO.LoginResponseDTO;
import com.adotaai.adotaai.Application.DTO.ResetarSenhaDTO;
import com.adotaai.adotaai.Application.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Map<String, String>> esqueciSenha(@RequestBody EsqueciSenhaDTO dto) {
        authService.solicitarResetSenha(dto);
        return ResponseEntity.ok(Map.of(
                "mensagem", "Se o e-mail estiver cadastrado, um token de redefinição foi enviado."
        ));
    }

    @PostMapping("/resetar-senha")
    public ResponseEntity<Map<String, String>> resetarSenha(@RequestBody ResetarSenhaDTO dto) {
        authService.resetarSenha(dto);
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso."));
    }
}
