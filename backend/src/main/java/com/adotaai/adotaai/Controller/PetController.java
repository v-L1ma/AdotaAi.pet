package com.adotaai.adotaai.Controller;

import com.adotaai.adotaai.DTO.PetDTO;
import com.adotaai.adotaai.Service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping (value= "/pet")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    public List<PetDTO> listarTodos() {
        return petService.listarTodos();
    }

    @PostMapping
    public void criarPet(@RequestBody PetDTO pet)
    {
        petService.inserir(pet);
    }

    @PutMapping
    public void alterar(@RequestBody PetDTO pet)
    {
        petService.alterar(pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id)
    {
        petService.excluir(id);
        return  ResponseEntity.ok().build();
    }
}
