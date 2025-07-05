package com.ong.db.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.voluntario.VoluntarioRepository;
import com.ong.db.voluntario.VoluntarioResponseDTO;

@RestController
@RequestMapping("voluntario")
public class VoluntarioController {
    @Autowired
    private VoluntarioRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<VoluntarioResponseDTO> getAll() {
        List<VoluntarioResponseDTO> voluntarios = repository.findAll().stream().map(VoluntarioResponseDTO::new)
                .toList();
        return voluntarios;
    }
}
