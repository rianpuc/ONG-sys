package com.ong.db.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.entrega.EntregaResponseDTO;
import com.ong.db.entrega.EntregaService;

@RestController
@RequestMapping("entrega")
public class EntregaController {
    @Autowired
    private EntregaService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<EntregaResponseDTO> getAll(
            @RequestParam(name = "antes", required = false) LocalDate antes,
            @RequestParam(name = "depois", required = false) LocalDate depois,
            @RequestParam(name = "Evento", required = false) Integer evento,
            @RequestParam(name = "Receptor", required = false) String receptor,
            @RequestParam(name = "Item", required = false) Integer item,
            @RequestParam(name = "maiorQue", required = false) Integer maiorQue,
            @RequestParam(name = "menorQue", required = false) Integer menorQue,
            @RequestParam(name = "igualA", required = false) Integer igualA) {
        return service.getAll(antes, depois, evento, receptor, item, maiorQue, menorQue, igualA);
    }
}
