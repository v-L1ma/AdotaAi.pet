package com.adotaai.adotaai.WebApi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adotaai.adotaai.Application.DTO.CadastrarUsuarioReponseDTO;
import com.adotaai.adotaai.Application.DTO.UsuarioDTO;
import com.adotaai.adotaai.Application.Service.UsuarioService;
import com.adotaai.adotaai.Application.Util.BaseResponse;

@RestController
@RequestMapping(value = "/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<BaseResponse<UsuarioDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<BaseResponse<CadastrarUsuarioReponseDTO>> criarUsuario(@RequestBody UsuarioDTO usuario) {
        BaseResponse<CadastrarUsuarioReponseDTO> res = usuarioService.inserir(usuario);
        if (res.getErrors() != null && !res.getErrors().isEmpty()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping
    public ResponseEntity<BaseResponse<UsuarioDTO>> alterarUsuario(@RequestBody UsuarioDTO usuario) {
        BaseResponse<UsuarioDTO> res = usuarioService.atualizarUsuario(usuario);
        if (res.getErrors() != null && !res.getErrors().isEmpty()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping
    public ResponseEntity<BaseResponse<UsuarioDTO>> excluirUsuario() {
        BaseResponse<UsuarioDTO> res = usuarioService.excluir();
        if (res.getErrors() != null && !res.getErrors().isEmpty()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

}
