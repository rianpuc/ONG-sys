package com.ong.db.controller;

import com.ong.db.doacao.Doacao;
import com.ong.db.doacao.DoacaoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("doacao")
public class DoacaoController {
    @Autowired
    private DoacaoRepository repository;
    @GetMapping
    public List<Doacao> getAll(){
        List<Doacao> doacoes = repository.findAll();
        return doacoes;
    }
}
