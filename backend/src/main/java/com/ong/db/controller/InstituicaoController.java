package com.ong.db.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.instituicao.InstituicaoRepository;
import com.ong.db.instituicao.InstituicaoResponseDTO;

@RestController
@RequestMapping("instituicao")
public class InstituicaoController {
    @Autowired
    private InstituicaoRepository repository;

    @GetMapping
    private List<InstituicaoResponseDTO> getAll() {
        List<InstituicaoResponseDTO> instituicoes = repository.findAll().stream().map(InstituicaoResponseDTO::new)
                .toList();
        return instituicoes;
    }
}
