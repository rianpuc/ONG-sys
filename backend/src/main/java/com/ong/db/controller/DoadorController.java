package com.ong.db.controller;

import com.ong.db.doador.DoadorRepository;
import com.ong.db.doador.DoadorResponseDTO;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("doador")
public class DoadorController {
    @Autowired
    private DoadorRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<DoadorResponseDTO> getAll() {
        List<DoadorResponseDTO> doadores = repository.findAll().stream().map(DoadorResponseDTO::new).toList();
        return doadores;
    }
}
