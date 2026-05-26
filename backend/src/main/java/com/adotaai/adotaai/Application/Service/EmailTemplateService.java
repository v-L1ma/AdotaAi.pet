package com.adotaai.adotaai.Application.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    public String render(String templateName, Map<String, String> values) {
        String html = loadTemplate(templateName);
        if (values == null || values.isEmpty()) {
            return html;
        }

        String rendered = html;
        for (Map.Entry<String, String> entry : values.entrySet()) {
            String token = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() == null ? "" : entry.getValue();
            rendered = rendered.replace(token, value);
        }

        return rendered;
    }

    private String loadTemplate(String templateName) {
        String path = "email/" + templateName + ".html";
        ClassPathResource resource = new ClassPathResource(path);
        try (InputStream input = resource.getInputStream()) {
            byte[] bytes = input.readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            throw new IllegalStateException("Nao foi possivel carregar o template de email: " + path, ex);
        }
    }
}
