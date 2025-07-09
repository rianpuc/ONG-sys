package com.ong.db.controller;

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

import com.ong.db.receptor.ReceptorRequestDTO;
import com.ong.db.receptor.ReceptorResponseDTO;
import com.ong.db.receptor.ReceptorService;

@RestController
@RequestMapping("receptor")
public class ReceptorController {
    @Autowired
    private ReceptorService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<ReceptorResponseDTO> getAll(
            @RequestParam(name = "cpf", required = false) String CPF,
            @RequestParam(name = "nome", required = false) String Nome,
            @RequestParam(name = "endereco", required = false) String Endereco) {
        return service.getAll(CPF, Nome, Endereco);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public ReceptorResponseDTO insert(@RequestBody ReceptorRequestDTO dados) {
        return service.insert(dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping("/{CPF}")
    public ReceptorResponseDTO update(@PathVariable String CPF, @RequestBody ReceptorRequestDTO dados) {
        return service.update(CPF, dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/{CPF}")
    public ResponseEntity<Void> delete(@PathVariable String CPF) {
        service.delete(CPF);
        return ResponseEntity.noContent().build();
    }
}
