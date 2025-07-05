package com.ong.db.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.receptor.ReceptorRepository;
import com.ong.db.receptor.ReceptorResponseDTO;

@RestController
@RequestMapping("receptor")
public class ReceptorController {
    @Autowired
    private ReceptorRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<ReceptorResponseDTO> getAll() {
        List<ReceptorResponseDTO> receptores = repository.findAll().stream().map(ReceptorResponseDTO::new).toList();
        return receptores;
    }
}
