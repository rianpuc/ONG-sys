package com.ong.db.controller;

import com.ong.db.doacao.DoacaoRepository;
import com.ong.db.doacao.DoacaoResponseDTO;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("doacao")
public class DoacaoController {
    @Autowired
    private DoacaoRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<DoacaoResponseDTO> getAll() {
        List<DoacaoResponseDTO> doacoes = repository.findAll().stream().map(DoacaoResponseDTO::new).toList();
        return doacoes;
    }
}
