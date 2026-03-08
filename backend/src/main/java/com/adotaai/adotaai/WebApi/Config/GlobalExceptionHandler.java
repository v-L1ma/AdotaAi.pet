package com.adotaai.adotaai.WebApi.Config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.adotaai.adotaai.Application.Util.BaseResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<BaseResponse<String>> handleRuntimeException(RuntimeException ex) {
        BaseResponse<String> response = new BaseResponse<>();
        response.setMessage("Erro");
        response.getErrors().add(ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}