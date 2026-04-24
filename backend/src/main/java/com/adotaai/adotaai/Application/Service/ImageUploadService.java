package com.adotaai.adotaai.Application.Service;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;

import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class ImageUploadService {

    private static final long DEFAULT_MAX_IMAGE_BYTES = 8L * 1024L * 1024L;
    private static final int MAX_WIDTH = 1280;
    private static final int MAX_HEIGHT = 1280;
    private static final int SCALE_ATTEMPTS = 6;

    @Value("${supabase.url:}")
    private String supabaseUrl;


    @Value("${supabase.service-key:}")
    private String supabaseServiceKey;

    @Value("${supabase.storage.bucket:pets}")
    private String bucketName;

    @Value("${supabase.s3.endpoint:}")
    private String s3Endpoint;

    @Value("${supabase.s3.access-key:}")
    private String s3AccessKey;

    @Value("${supabase.s3.secret-key:}")
    private String s3SecretKey;

    @Value("${app.image.max-bytes:" + DEFAULT_MAX_IMAGE_BYTES + "}")
    private long maxImageBytes;

    private final S3Client s3Client;

    public ImageUploadService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadPetImage(MultipartFile imagem, UUID petId) {
        validarConfiguracaoSupabase();
        validarArquivoRecebido(imagem);

        byte[] arquivoOriginal;
        try {
            arquivoOriginal = imagem.getBytes();
        } catch (IOException ex) {
            throw new RegraDeNegocioException("Não foi possível ler a imagem enviada.");
        }

        ImageType imageType = detectImageTypeByMagicBytes(arquivoOriginal);
        if (imageType == ImageType.UNKNOWN) {
            throw new RegraDeNegocioException("Formato de imagem inválido. Envie JPG ou PNG.");
        }

        byte[] imagemComprimida = comprimirParaJpeg(arquivoOriginal);
        String objectPath = montarNomeArquivo(petId);
        enviarParaSupabase(objectPath, imagemComprimida);

        return construirUrlPublica(objectPath);
    }

    private void validarConfiguracaoSupabase() {
        if (s3Endpoint == null || s3Endpoint.isBlank() || s3AccessKey == null || s3AccessKey.isBlank()
                || s3SecretKey == null || s3SecretKey.isBlank()) {
            throw new RegraDeNegocioException(
                    "Configuração S3 ausente. Defina supabase.s3.endpoint, supabase.s3.access-key e supabase.s3.secret-key.");
        }
    }

    private void validarArquivoRecebido(MultipartFile imagem) {
        if (imagem == null || imagem.isEmpty()) {
            throw new RegraDeNegocioException("Imagem obrigatória para upload.");
        }

        if (imagem.getSize() > maxImageBytes) {
            throw new RegraDeNegocioException("Imagem acima do limite permitido de " + maxImageBytes + " bytes.");
        }
    }

    private byte[] comprimirParaJpeg(byte[] originalBytes) {
        BufferedImage original;
        try {
            original = ImageIO.read(new ByteArrayInputStream(originalBytes));
        } catch (IOException ex) {
            throw new RegraDeNegocioException("Não foi possível processar a imagem enviada.");
        }

        if (original == null) {
            throw new RegraDeNegocioException("Imagem inválida ou corrompida.");
        }

        BufferedImage base = redimensionarSeNecessario(original, MAX_WIDTH, MAX_HEIGHT);
        byte[] melhor = escreverJpeg(base, 0.82f);

        if (melhor.length < originalBytes.length) {
            return melhor;
        }

        BufferedImage tentativa = base;
        float quality = 0.76f;
        for (int i = 0; i < SCALE_ATTEMPTS; i++) {
            tentativa = redimensionarPorFator(tentativa, 0.9);
            byte[] comprimida = escreverJpeg(tentativa, quality);
            if (comprimida.length < melhor.length) {
                melhor = comprimida;
            }
            quality = Math.max(0.55f, quality - 0.04f);

            if (melhor.length < originalBytes.length) {
                break;
            }
        }

        return melhor;
    }

    private byte[] escreverJpeg(BufferedImage image, float quality) {
        try {
            BufferedImage rgbImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = rgbImage.createGraphics();
            g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            g2d.drawImage(image, 0, 0, null);
            g2d.dispose();

            ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
            ByteArrayOutputStream output = new ByteArrayOutputStream();

            try (ImageOutputStream ios = ImageIO.createImageOutputStream(output)) {
                writer.setOutput(ios);
                ImageWriteParam param = writer.getDefaultWriteParam();
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(quality);
                writer.write(null, new IIOImage(rgbImage, null, null), param);
            } finally {
                writer.dispose();
            }

            return output.toByteArray();
        } catch (IOException ex) {
            throw new RegraDeNegocioException("Falha ao comprimir imagem.");
        }
    }

    private BufferedImage redimensionarSeNecessario(BufferedImage source, int maxWidth, int maxHeight) {
        int width = source.getWidth();
        int height = source.getHeight();

        double scale = Math.min((double) maxWidth / width, (double) maxHeight / height);
        if (scale >= 1.0d) {
            return source;
        }

        int newWidth = Math.max(1, (int) Math.round(width * scale));
        int newHeight = Math.max(1, (int) Math.round(height * scale));
        return redimensionar(source, newWidth, newHeight);
    }

    private BufferedImage redimensionarPorFator(BufferedImage source, double factor) {
        int newWidth = Math.max(1, (int) Math.round(source.getWidth() * factor));
        int newHeight = Math.max(1, (int) Math.round(source.getHeight() * factor));
        return redimensionar(source, newWidth, newHeight);
    }

    private BufferedImage redimensionar(BufferedImage source, int newWidth, int newHeight) {
        Image scaled = source.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
        BufferedImage target = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = target.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g2d.drawImage(scaled, 0, 0, null);
        g2d.dispose();
        return target;
    }

    private String montarNomeArquivo(UUID petId) {
        LocalDate hoje = LocalDate.now();
        return String.format(
                Locale.ROOT,
                "pets/%d/%02d/%s-%s.jpg",
                hoje.getYear(),
                hoje.getMonthValue(),
                petId,
                UUID.randomUUID());
    }

    private void enviarParaSupabase(String objectPath, byte[] content) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectPath)
                .contentType("image/jpeg")
                .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(content));
        } catch (SdkException ex) {
            throw new RegraDeNegocioException("Erro ao enviar imagem para o Supabase: " + ex.getMessage());
        }
    }

    private String construirUrlPublica(String objectPath) {
        String base = supabaseUrl.endsWith("/")
                ? supabaseUrl.substring(0, supabaseUrl.length() - 1)
                : supabaseUrl;

        String path = objectPath.startsWith("/")
                ? objectPath.substring(1)
                : objectPath;

        return base + "/storage/v1/object/public/" + bucketName + "/" + path;
    }

    private ImageType detectImageTypeByMagicBytes(byte[] bytes) {
        if (bytes.length >= 3
                && (bytes[0] & 0xFF) == 0xFF
                && (bytes[1] & 0xFF) == 0xD8
                && (bytes[2] & 0xFF) == 0xFF) {
            return ImageType.JPEG;
        }

        if (bytes.length >= 8
                && (bytes[0] & 0xFF) == 0x89
                && bytes[1] == 0x50
                && bytes[2] == 0x4E
                && bytes[3] == 0x47
                && bytes[4] == 0x0D
                && bytes[5] == 0x0A
                && bytes[6] == 0x1A
                && bytes[7] == 0x0A) {
            return ImageType.PNG;
        }

        return ImageType.UNKNOWN;
    }

    private enum ImageType {
        JPEG,
        PNG,
        UNKNOWN
    }
}