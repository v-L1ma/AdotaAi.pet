package com.adotaai.adotaai.Application.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.adotaai.adotaai.Application.DTO.PetDTO;
import com.adotaai.adotaai.Domain.Entity.FavoritoPetEntity;
import com.adotaai.adotaai.Domain.Entity.PetEntity;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Infraestructure.Repository.FavoritoPetRepository;
import com.adotaai.adotaai.Infraestructure.Repository.PetRepository;
import com.adotaai.adotaai.Infraestructure.Repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FavoritoPetRepository favoritoPetRepository;

    public List<PetDTO> listarTodos() {
        List<PetEntity> pet = petRepository.findAll();
        return pet.stream().map(PetDTO::new).toList();
    }

    public void excluir(UUID id) {
        PetEntity pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        petRepository.delete(pet);
    }

    public PetDTO criarPet(PetDTO petDTO) {
        PetEntity pet = new PetEntity();
        BeanUtils.copyProperties(petDTO, pet);
        UsuarioEntity usuario = obterUsuarioAutenticado();
        pet.setUser(usuario);
        pet.setLink_foto("Testedelink");

        pet = petRepository.save(pet);

        PetDTO dto = new PetDTO();
        BeanUtils.copyProperties(pet, dto);
        dto.setUser_id(pet.getUser().getId());
        return dto;
    }

    @Transactional
    public PetDTO atualizarPet(UUID id, PetDTO petDto) {
        PetEntity pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet não encontrado com ID: " + id));
        pet.setNome(petDto.getNome());
        pet.setStatus(petDto.getStatus());
        pet.setDescricao(petDto.getDescricao());
        pet.setDt_nasc(petDto.getDt_nasc());
        pet.setPorte(petDto.getPorte());
        pet.setRaca(petDto.getRaca());
        pet.setEspecie(petDto.getEspecie());
        pet.setLink_foto(petDto.getLink_foto());

        PetEntity petatualizado = petRepository.save(pet);

        return new PetDTO(petatualizado);

    }

    @Transactional
    public void favoritar(UUID petId) {
        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();

        PetEntity pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));

        boolean jaFavorito = favoritoPetRepository.existsByUsuarioIdAndPetId(usuarioAutenticado.getId(), pet.getId());
        if (jaFavorito) {
            throw new RuntimeException("Pet já está favoritado para este usuário");
        }

        FavoritoPetEntity favorito = new FavoritoPetEntity();
        favorito.setUsuario(usuarioAutenticado);
        favorito.setPet(pet);
        favoritoPetRepository.save(favorito);
    }

    @Transactional
    public void desfavoritar(UUID petId) {
        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();

        FavoritoPetEntity favorito = favoritoPetRepository
                .findByUsuarioIdAndPetId(usuarioAutenticado.getId(), petId)
                .orElseThrow(() -> new RuntimeException("Pet não está favoritado para este usuário"));

        favoritoPetRepository.delete(favorito);
    }

    public List<PetDTO> listarFavoritosUsuarioLogado() {
        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();

        List<FavoritoPetEntity> favoritos = favoritoPetRepository.findAllByUsuarioId(usuarioAutenticado.getId());

        return favoritos.stream()
                .map(FavoritoPetEntity::getPet)
                .map(PetDTO::new)
                .toList();
    }

    private UsuarioEntity obterUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        Object details = auth.getDetails();
        if (details instanceof UUID userId) {
            return usuarioRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado para o id: " + userId));
        }

        if (details instanceof String userIdStr) {
            try {
                UUID userId = UUID.fromString(userIdStr);
                return usuarioRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado para o id: " + userId));
            } catch (IllegalArgumentException ignored) {
                // Fallback para autenticações antigas baseadas em email.
            }
        }

        return usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para o email: " + auth.getName()));
    }

}
