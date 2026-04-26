package com.adotaai.adotaai.Application.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.adotaai.adotaai.Application.DTO.BuscarPetDTO;
import com.adotaai.adotaai.Application.DTO.CadastrarPetDTO;
import com.adotaai.adotaai.Application.DTO.PetDTO;
import com.adotaai.adotaai.Domain.Entity.FavoritoPetEntity;
import com.adotaai.adotaai.Domain.Entity.PetEntity;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;
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

    @Autowired
    private ImageUploadService imageUploadService;

    public List<PetDTO> listarTodos() {
        List<PetEntity> pet = petRepository.findAll();
        return pet.stream().map(PetDTO::new).toList();
    }

    public BuscarPetDTO buscarPet(UUID id) {
        PetEntity pet = petRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pet não encontrado com ID: " + id));

        BuscarPetDTO.DonoDTO dono = null;
        if (pet.getUser() != null) {
            dono = new BuscarPetDTO.DonoDTO(pet.getUser().getId(), pet.getUser().getNome());
        }

        boolean isFavoritado = false;
        Optional<UsuarioEntity> usuarioAutenticado = obterUsuarioAutenticadoOpcional();
        if (usuarioAutenticado.isPresent()) {
            isFavoritado = favoritoPetRepository.existsByUsuarioIdAndPetId(
                usuarioAutenticado.get().getId(),
                pet.getId());
        }

        return new BuscarPetDTO(
                pet.getId(),
                pet.getStatus(),
                pet.getDescricao(),
                pet.getDt_nasc(),
                pet.getNome(),
                pet.getPorte(),
                pet.getRaca(),
                pet.getEspecie(),
                pet.getLink_foto(),
                isFavoritado,
                dono);
    }

    public void excluir(UUID id) {
        PetEntity pet = petRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pet não encontrado"));
        petRepository.delete(pet);
    }

    public PetDTO criarPet(CadastrarPetDTO petDTO, MultipartFile imagem) {
        PetEntity pet = new PetEntity();
        BeanUtils.copyProperties(petDTO, pet);

        LocalDate date = parseDtNasc(petDTO.getDtNasc());

        pet.setDt_nasc(date);
        UsuarioEntity usuario = obterUsuarioAutenticado();
        pet.setUser(usuario);
        pet.setStatus("Pendente");

        if (imagem != null && !imagem.isEmpty()) {
            String imageUrl = imageUploadService.uploadPetImage(imagem, pet.getId() == null ? UUID.randomUUID() : pet.getId());
            pet.setLink_foto(imageUrl);
        }

        if (pet.getLink_foto() == null || pet.getLink_foto().isBlank()) {
            throw new RegraDeNegocioException("A imagem do pet é obrigatória.");
        }

        pet = petRepository.save(pet);

        PetDTO dto = new PetDTO();
        BeanUtils.copyProperties(pet, dto);
        dto.setUser_id(pet.getUser().getId());
        return dto;
    }

    @Transactional
    public PetDTO atualizarPet(UUID id, CadastrarPetDTO petDto, MultipartFile imagem) {
        PetEntity pet = petRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pet não encontrado com ID: " + id));

        BeanUtils.copyProperties(petDto, pet, "id", "user", "link_foto");
        LocalDate date = parseDtNasc(petDto.getDtNasc());

        pet.setDt_nasc(date);

        if (imagem != null && !imagem.isEmpty()) {
            String imageUrl = imageUploadService.uploadPetImage(imagem, pet.getId());
            pet.setLink_foto(imageUrl);
        }

        PetEntity petatualizado = petRepository.save(pet);
        return new PetDTO(petatualizado);
    }

    @Transactional
    public void favoritar(UUID petId) {
        UsuarioEntity usuarioAutenticado = obterUsuarioAutenticado();

        PetEntity pet = petRepository.findById(petId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Pet não encontrado"));

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

    private LocalDate parseDtNasc(String dtNasc) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd").withLocale(Locale.US);

        try {
            return LocalDate.parse(dtNasc, formatter);
        } catch (DateTimeParseException exception) {
            throw new RegraDeNegocioException("Data de nascimento inválida. Use o formato yyyy-MM-dd.");
        }
    }

    private UsuarioEntity obterUsuarioAutenticado() {
        return obterUsuarioAutenticadoOpcional()
                .orElseThrow(() -> new RuntimeException("Usuário não autenticado."));
    }

    private Optional<UsuarioEntity> obterUsuarioAutenticadoOpcional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return Optional.empty();
        }

        Object details = auth.getDetails();
        if (details instanceof UUID userId) {
            return usuarioRepository.findById(userId);
        }

        if (details instanceof String userIdStr) {
            try {
                UUID userId = UUID.fromString(userIdStr);
                return usuarioRepository.findById(userId);
            } catch (IllegalArgumentException ignored) {
                // Fallback para autenticações antigas baseadas em email.
            }
        }

        return usuarioRepository.findByEmail(auth.getName());
    }

}
