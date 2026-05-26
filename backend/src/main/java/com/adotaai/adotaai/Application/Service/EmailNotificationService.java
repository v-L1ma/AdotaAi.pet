package com.adotaai.adotaai.Application.Service;

import java.io.UnsupportedEncodingException;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.adotaai.adotaai.Domain.Entity.EventoEntity;
import com.adotaai.adotaai.Domain.Entity.PetEntity;
import com.adotaai.adotaai.Domain.Entity.UsuarioEntity;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);
    private static final DateTimeFormatter EVENT_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final JavaMailSender mailSender;
    private final EmailTemplateService templateService;

    @Value("${app.frontend.base-url:http://localhost:8081}")
    private String frontendBaseUrl;

    @Value("${app.email.from-name:AdotaAi}")
    private String fromName;

    @Value("${app.email.from-address:}")
    private String fromAddress;

    public EmailNotificationService(JavaMailSender mailSender, EmailTemplateService templateService) {
        this.mailSender = mailSender;
        this.templateService = templateService;
    }

    public void sendPetApproved(UsuarioEntity owner, PetEntity pet) {
        if (!canSend(owner)) {
            return;
        }

        Map<String, String> vars = baseVars(owner);
        vars.put("titulo", "Pet aprovado");
        vars.put("pet_nome", safe(pet != null ? pet.getNome() : null));

        String html = templateService.render("pet-approved", vars);
        send(owner.getEmail(), "AdotaAi - Pet aprovado", html);
    }

    public void sendPetRejected(UsuarioEntity owner, PetEntity pet, String motivo) {
        if (!canSend(owner)) {
            return;
        }

        Map<String, String> vars = baseVars(owner);
        vars.put("titulo", "Pet reprovado");
        vars.put("pet_nome", safe(pet != null ? pet.getNome() : null));
        vars.put("motivo", safe(motivo, "Nao informado"));

        String html = templateService.render("pet-rejected", vars);
        send(owner.getEmail(), "AdotaAi - Pet reprovado", html);
    }

    public void sendEventApproved(UsuarioEntity owner, EventoEntity evento) {
        if (!canSend(owner)) {
            return;
        }

        Map<String, String> vars = baseVars(owner);
        vars.put("titulo", "Evento aprovado");
        vars.put("evento_nome", safe(evento != null ? evento.getNome() : null));
        vars.put("evento_data", formatEventDate(evento));

        String html = templateService.render("event-approved", vars);
        send(owner.getEmail(), "AdotaAi - Evento aprovado", html);
    }

    public void sendEventRejected(UsuarioEntity owner, EventoEntity evento, String motivo) {
        if (!canSend(owner)) {
            return;
        }

        Map<String, String> vars = baseVars(owner);
        vars.put("titulo", "Evento reprovado");
        vars.put("evento_nome", safe(evento != null ? evento.getNome() : null));
        vars.put("evento_data", formatEventDate(evento));
        vars.put("motivo", safe(motivo, "Nao informado"));

        String html = templateService.render("event-rejected", vars);
        send(owner.getEmail(), "AdotaAi - Evento reprovado", html);
    }

    public void sendEventPresenceConfirmed(UsuarioEntity usuario, EventoEntity evento) {
        if (!canSend(usuario)) {
            return;
        }

        Map<String, String> vars = baseVars(usuario);
        vars.put("titulo", "Presenca confirmada");
        vars.put("evento_nome", safe(evento != null ? evento.getNome() : null));
        vars.put("evento_data", formatEventDate(evento));

        String html = templateService.render("event-presence-confirmed", vars);
        send(usuario.getEmail(), "AdotaAi - Presenca confirmada", html);
    }

    public void sendAdoptionProposalReceived(UsuarioEntity owner, UsuarioEntity adotante, PetEntity pet) {
        if (!canSend(owner)) {
            return;
        }

        Map<String, String> vars = baseVars(owner);
        vars.put("titulo", "Nova solicitacao de adocao");
        vars.put("pet_nome", safe(pet != null ? pet.getNome() : null));
        vars.put("adotante_nome", safe(adotante != null ? adotante.getNome() : null));

        String html = templateService.render("adoption-proposal-received", vars);
        send(owner.getEmail(), "AdotaAi - Nova solicitacao de adocao", html);
    }

    public void sendAdoptionApproved(UsuarioEntity adotante, UsuarioEntity anunciante, PetEntity pet) {
        if (!canSend(adotante)) {
            return;
        }

        Map<String, String> vars = baseVars(adotante);
        vars.put("titulo", "Solicitacao de adocao aprovada");
        vars.put("pet_nome", safe(pet != null ? pet.getNome() : null));
        vars.put("anunciante_nome", safe(anunciante != null ? anunciante.getNome() : null));

        String html = templateService.render("adoption-approved", vars);
        send(adotante.getEmail(), "AdotaAi - Solicitacao aprovada", html);
    }

    public void sendAdoptionRejected(UsuarioEntity adotante, UsuarioEntity anunciante, PetEntity pet) {
        if (!canSend(adotante)) {
            return;
        }

        Map<String, String> vars = baseVars(adotante);
        vars.put("titulo", "Solicitacao de adocao reprovada");
        vars.put("pet_nome", safe(pet != null ? pet.getNome() : null));
        vars.put("anunciante_nome", safe(anunciante != null ? anunciante.getNome() : null));

        String html = templateService.render("adoption-rejected", vars);
        send(adotante.getEmail(), "AdotaAi - Solicitacao reprovada", html);
    }

    private Map<String, String> baseVars(UsuarioEntity usuario) {
        Map<String, String> vars = new HashMap<>();
        vars.put("usuario_nome", safe(usuario != null ? usuario.getNome() : null, "Usuario"));
        vars.put("cta_url", safe(frontendBaseUrl, "http://localhost:8081"));
        vars.put("cta_texto", "Acessar AdotaAi");
        return vars;
    }

    private void send(String to, String subject, String html) {
        if (to == null || to.isBlank()) {
            logger.warn("Email nao enviado. Destinatario vazio. Assunto: {}", subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            applyFrom(helper);
            mailSender.send(message);
        } catch (Exception ex) {
            logger.warn("Falha ao enviar email para {}. Assunto: {}", to, subject, ex);
        }
    }

    private void applyFrom(MimeMessageHelper helper) throws MessagingException, UnsupportedEncodingException {
        if (fromAddress == null || fromAddress.isBlank()) {
            return;
        }
        if (fromName != null && !fromName.isBlank()) {
            helper.setFrom(fromAddress, fromName);
        } else {
            helper.setFrom(fromAddress);
        }
    }

    private boolean canSend(UsuarioEntity usuario) {
        return usuario != null && usuario.getEmail() != null && !usuario.getEmail().isBlank();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String safe(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value;
    }

    private String formatEventDate(EventoEntity evento) {
        if (evento == null || evento.getData() == null) {
            return "";
        }
        return EVENT_DATE_FORMAT.format(evento.getData());
    }
}
