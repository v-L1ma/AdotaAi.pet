package com.adotaai.adotaai.WebApi.Config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.adotaai.adotaai.Application.Util.BaseResponse;
import com.adotaai.adotaai.Domain.Exception.RecursoNaoEncontradoException;
import com.adotaai.adotaai.Domain.Exception.RegraDeNegocioException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<BaseResponse<String>> handleRecursoNaoEncontrado(RecursoNaoEncontradoException ex) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Recurso não encontrado");
        response.getErrors().add(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<BaseResponse<String>> handleRegraDeNegocio(RegraDeNegocioException ex) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Erro de regra de negócio");
        response.getErrors().add(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Erro de validação nos campos");

        ex.getBindingResult().getFieldErrors().forEach(error ->
                response.getErrors().add(error.getField() + ": " + error.getDefaultMessage())
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<BaseResponse<String>> handleRuntimeException(RuntimeException ex) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Erro interno do servidor");
        response.getErrors().add(ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}