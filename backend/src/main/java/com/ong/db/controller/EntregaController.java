package com.ong.db.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.entrega.EntregaRepository;
import com.ong.db.entrega.EntregaResponseDTO;

@RestController
@RequestMapping("entrega")
public class EntregaController {
    @Autowired
    private EntregaRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<EntregaResponseDTO> getAll() {
        List<EntregaResponseDTO> entregas = repository.findAll().stream().map(EntregaResponseDTO::new).toList();
        return entregas;
    }
}
