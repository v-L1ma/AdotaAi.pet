package com.adotaai.adotaai.WebApi.Controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.adotaai.adotaai.Application.DTO.AtualizarUsuarioDTO;
import com.adotaai.adotaai.Application.DTO.CadastrarUsuarioDTO;
import com.adotaai.adotaai.Application.DTO.UsuarioReponseDTO;
import com.adotaai.adotaai.Application.DTO.UsuarioPublicoDTO;
import com.adotaai.adotaai.Application.Service.UsuarioService;
import com.adotaai.adotaai.Application.Util.BaseResponse;

@RestController
@RequestMapping(value = "/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<BaseResponse<UsuarioReponseDTO>> buscarUsuarioLogado() {
        return ResponseEntity.ok(usuarioService.buscarUsuarioLogado());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<UsuarioPublicoDTO>> buscarPublicoPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(usuarioService.buscarPublicoPorId(id));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<UsuarioReponseDTO>> criarUsuario(@RequestBody CadastrarUsuarioDTO usuario) {
        BaseResponse<UsuarioReponseDTO> res = usuarioService.inserir(usuario);
        if (res.getErrors() != null && !res.getErrors().isEmpty()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping
    public ResponseEntity<BaseResponse<UsuarioReponseDTO>> alterarUsuario(@RequestBody AtualizarUsuarioDTO usuario) {
        BaseResponse<UsuarioReponseDTO> res = usuarioService.atualizarUsuario(usuario);
        if (res.getErrors() != null && !res.getErrors().isEmpty()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping(value = "/foto-perfil", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<UsuarioReponseDTO>> atualizarFotoPerfil(@RequestPart("imagem") MultipartFile imagem) {
        BaseResponse<UsuarioReponseDTO> res = usuarioService.atualizarFotoPerfil(imagem);
        if (res.getErrors() != null && !res.getErrors().isEmpty()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping
    public ResponseEntity<BaseResponse<AtualizarUsuarioDTO>> excluirUsuario() {
        BaseResponse<AtualizarUsuarioDTO> res = usuarioService.excluir();
        if (res.getErrors() != null && !res.getErrors().isEmpty()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

}
