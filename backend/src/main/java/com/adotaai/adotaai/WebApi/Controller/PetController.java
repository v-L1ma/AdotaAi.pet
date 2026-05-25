package com.adotaai.adotaai.WebApi.Controller;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.adotaai.adotaai.Application.DTO.AprovarReprovarRequestDTO;
import com.adotaai.adotaai.Application.DTO.BuscarPetDTO;
import com.adotaai.adotaai.Application.DTO.CadastrarPetDTO;
import com.adotaai.adotaai.Application.DTO.PetDTO;
import com.adotaai.adotaai.Application.Service.PetService;
import com.adotaai.adotaai.Application.Util.BaseResponse;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<PetDTO> listarTodosPets() {
        return petService.listarTodos();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PetDTO> criarPet(
            @RequestPart("dados") String dadosJson,
            @RequestPart(required = false) MultipartFile imagem) {
        CadastrarPetDTO dados = parseDados(dadosJson);
        PetDTO criado = petService.criarPet(dados, imagem);
        return ResponseEntity.ok(criado);
    }

    @GetMapping("/destaques")
    public List<PetDTO> listarDestaques(@RequestParam(defaultValue = "5") int limit) {
        return petService.listarDestaques(limit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuscarPetDTO> buscarPet(@PathVariable UUID id) {
        BuscarPetDTO encontrado = petService.buscarPet(id);
        return ResponseEntity.ok(encontrado);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<PetDTO> atualizarPet(
            @PathVariable UUID id,
            @RequestPart(value = "dados", required = false) String dadosJson,
            @RequestBody(required = false) CadastrarPetDTO dadosBody,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        
        CadastrarPetDTO dados;
        
        if (dadosJson != null) {
            dados = parseDados(dadosJson);
        } else if (dadosBody != null) {
            dados = dadosBody;
        } else {
            dados = new CadastrarPetDTO();
        }
        
        PetDTO atualizado = petService.atualizarPet(id, dados, imagem);
        return ResponseEntity.ok(atualizado);
    }

    private CadastrarPetDTO parseDados(String dadosJson) {
        try {
            return objectMapper.readValue(dadosJson, CadastrarPetDTO.class);
        } catch (JsonProcessingException exception) {
            throw new RegraDeNegocioException("Dados do pet inválidos no part 'dados'.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirPet(@PathVariable("id") UUID id) {
        petService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/favoritar")
    public ResponseEntity<BaseResponse<String>> favoritarPet(@PathVariable("id") UUID id) {
        petService.favoritar(id);
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Pet favoritado com sucesso.");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/favoritar")
    public ResponseEntity<BaseResponse<String>> desfavoritarPet(@PathVariable("id") UUID id) {
        petService.desfavoritar(id);
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Pet removido dos favoritos com sucesso.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/favoritos")
    public ResponseEntity<BaseResponse<PetDTO>> listarFavoritosUsuarioLogado() {
        List<PetDTO> favoritos = petService.listarFavoritosUsuarioLogado();
        BaseResponse<PetDTO> response = new BaseResponse<>();
        response.setMessage("Favoritos listados com sucesso.");
        response.setData(favoritos);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<BaseResponse<PetDTO>> listarPetsPendentes() {
        List<PetDTO> pendentes = petService.listarPetsPendentes();
        BaseResponse<PetDTO> response = new BaseResponse<>();
        response.setMessage("Pets pendentes listados com sucesso.");
        response.setData(pendentes);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<BaseResponse<String>> aprovarPet(@PathVariable UUID id) {
        petService.aprovarPet(id);
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Pet aprovado com sucesso.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reprovar")
    public ResponseEntity<BaseResponse<String>> reprovarPet(@PathVariable UUID id, @Valid @RequestBody AprovarReprovarRequestDTO request) {
        petService.reprovarPet(id, request.getMotivo());
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Pet reprovado com sucesso.");
        return ResponseEntity.ok(response);
    }
}
