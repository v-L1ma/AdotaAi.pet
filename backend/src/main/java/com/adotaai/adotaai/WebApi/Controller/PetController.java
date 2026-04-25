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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.adotaai.adotaai.Application.DTO.BuscarPetDTO;
import com.adotaai.adotaai.Application.DTO.CadastrarPetDTO;
import com.adotaai.adotaai.Application.DTO.PetDTO;
import com.adotaai.adotaai.Application.Service.PetService;
import com.adotaai.adotaai.Application.Util.BaseResponse;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

@RestController
@RequestMapping(value = "/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Validator validator;

    @GetMapping
    public List<PetDTO> listarTodosPets() {
        return petService.listarTodos();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PetDTO> criarPet(
            @RequestPart("dados") byte[] dadosBrutos,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        CadastrarPetDTO dados = parseDados(dadosBrutos);
        validarDados(dados);
        PetDTO criado = petService.criarPet(dados, imagem);
        return ResponseEntity.ok(criado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuscarPetDTO> buscarPet(@PathVariable UUID id) {
        BuscarPetDTO encontrado = petService.buscarPet(id);
        return ResponseEntity.ok(encontrado);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PetDTO> atualizarPet(
            @PathVariable UUID id,
            @RequestPart("dados") byte[] dadosBrutos,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        CadastrarPetDTO dados = parseDados(dadosBrutos);
        validarDados(dados);
        PetDTO atualizado = petService.atualizarPet(id, dados, imagem);
        return ResponseEntity.ok(atualizado);
    }

    private CadastrarPetDTO parseDados(byte[] dadosBrutos) {
        if (dadosBrutos == null || dadosBrutos.length == 0) {
            throw new RegraDeNegocioException("Campo 'dados' é obrigatório no multipart.");
        }

        try {
            return objectMapper.readValue(dadosBrutos, CadastrarPetDTO.class);
        } catch (JsonProcessingException ex) {
            String dadosRecebidos = new String(dadosBrutos, StandardCharsets.UTF_8);
            throw new RegraDeNegocioException("JSON inválido no campo 'dados': " + dadosRecebidos);
        }
    }

    private void validarDados(CadastrarPetDTO dados) {
        Set<ConstraintViolation<CadastrarPetDTO>> violations = validator.validate(dados);
        if (violations.isEmpty()) {
            return;
        }

        String mensagem = violations.stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .findFirst()
                .orElse("Dados do pet inválidos.");

        throw new RegraDeNegocioException(mensagem);
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
}
