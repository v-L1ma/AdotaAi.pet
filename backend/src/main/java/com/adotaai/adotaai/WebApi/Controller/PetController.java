package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.PetDTO;
import com.adotaai.adotaai.Application.Service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    public List<PetDTO> listarTodosPets() {
        return petService.listarTodos();
    }

    @PostMapping
    public void criarPet(@RequestBody PetDTO pet) {
        petService.criarPet(pet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetDTO> atualizarPet(@PathVariable UUID id, @RequestBody PetDTO petDTO) {
        PetDTO atualizado = petService.atualizarPet(id, petDTO);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirPet(@PathVariable("id") UUID id) {
        petService.excluir(id);
        return ResponseEntity.ok().build();
    }
}
