package com.adotaai.adotaai.WebApi.Controller;

import com.adotaai.adotaai.Application.DTO.RacaDTO;
import com.adotaai.adotaai.Application.Service.LookupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/lookups")
public class LookupController {

    @Autowired
    private LookupService lookupService;

    @GetMapping("/racas")
    public List<RacaDTO> listarRacas() {
        return lookupService.listarRacas();
    }
}
