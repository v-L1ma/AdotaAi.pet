package com.adotaai.adotaai.Application.Util;

import java.util.ArrayList;
import java.util.List;

public class BaseResponse<T> {

    private String message;
    private List<T> data;
    private List<String> errors;

    public BaseResponse() {
        this.data = new ArrayList<>();
        this.errors = new ArrayList<>();
    }

    public BaseResponse(String message, List<T> data, List<String> errors) {
        this.message = message;
        this.data = data != null ? data : new ArrayList<>();
        this.errors = errors != null ? errors : new ArrayList<>();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data != null ? data : new ArrayList<>();
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors != null ? errors : new ArrayList<>();
    }
}
