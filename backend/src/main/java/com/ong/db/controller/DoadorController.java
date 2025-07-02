package com.ong.db.controller;

import com.ong.db.doador.Doador;
import com.ong.db.doador.DoadorRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("doador")
public class DoadorController {
    @Autowired
    private DoadorRepository repository;
    public List<Doador> getAll(){
        List<Doador> doadores = repository.findAll();
        return doadores;
    }
}
