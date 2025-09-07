package com.adotaai.adotaai.Controller;

import com.adotaai.adotaai.DTO.UsuarioDTO;
import com.adotaai.adotaai.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping (value= "/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    @PostMapping
    public void criarUsuario(@RequestBody UsuarioDTO usuario)
    {
        usuarioService.inserir(usuario);
    }

    @PutMapping("/{id}")
    public void alterarUsuario(@PathVariable Long id,@RequestBody UsuarioDTO usuario)
    {
        usuarioService.atualizarUsuario(id, usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirUsuario(@PathVariable("id") Long id)
    {
        usuarioService.excluir(id);
        return  ResponseEntity.ok().build();
    }

}
