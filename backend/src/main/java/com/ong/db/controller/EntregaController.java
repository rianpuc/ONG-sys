package com.ong.db.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.entrega.EntregaRequestDTO;
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
            @RequestParam(name = "Evento", required = false) Integer evento,
            @RequestParam(name = "Receptor", required = false) String receptor,
            @RequestParam(name = "Item", required = false) Integer item,
            @RequestParam(name = "maiorQue", required = false) Integer maiorQue,
            @RequestParam(name = "menorQue", required = false) Integer menorQue,
            @RequestParam(name = "igualA", required = false) Integer igualA) {
        return service.getAll(evento, receptor, item, maiorQue, menorQue, igualA);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public EntregaResponseDTO insert(@RequestBody EntregaRequestDTO dados) {
        return service.insert(dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping("/{ID}")
    public EntregaResponseDTO update(@PathVariable Integer ID, @RequestBody EntregaRequestDTO dados) {
        return service.update(ID, dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/{ID}")
    public ResponseEntity<Void> delete(@PathVariable Integer ID) {
        service.delete(ID);
        return ResponseEntity.noContent().build();
    }
}
