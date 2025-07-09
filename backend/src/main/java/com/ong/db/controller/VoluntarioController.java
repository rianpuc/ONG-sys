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
import com.ong.db.voluntario.VoluntarioRequestDTO;
import com.ong.db.voluntario.VoluntarioResponseDTO;
import com.ong.db.voluntario.VoluntarioService;

@RestController
@RequestMapping("voluntario")
public class VoluntarioController {
    @Autowired
    private VoluntarioService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<VoluntarioResponseDTO> getAll(
            @RequestParam(name = "nome", required = false) String nome,
            @RequestParam(name = "cpf", required = false) String cpf,
            @RequestParam(name = "funcao", required = false) String funcao,
            @RequestParam(name = "instituicaoId", required = false) String instituicaoID) {
        return service.getAll(nome, cpf, funcao, instituicaoID);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public VoluntarioResponseDTO insert(@RequestBody VoluntarioRequestDTO dados) {
        return service.insert(dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping("/{CPF}")
    public VoluntarioResponseDTO update(@PathVariable String CPF, @RequestBody VoluntarioRequestDTO dados) {
        return service.update(CPF, dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/{CPF}")
    public ResponseEntity<Void> delete(@PathVariable String CPF) {
        service.delete(CPF);
        return ResponseEntity.noContent().build();
    }
}
