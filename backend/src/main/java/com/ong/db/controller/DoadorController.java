package com.ong.db.controller;

import com.ong.db.doador.DoadorRequestDTO;
import com.ong.db.doador.DoadorResponseDTO;
import com.ong.db.doador.DoadorService;

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

@RestController
@RequestMapping("doador")
public class DoadorController {
    @Autowired
    private DoadorService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<DoadorResponseDTO> getAll(
            @RequestParam(name = "CPF", required = false) String cpf,
            @RequestParam(name = "CNPJ", required = false) String cnpj,
            @RequestParam(name = "Nome_Doador", required = false) String nome,
            @RequestParam(name = "Tipo_Doador", required = false) String tipo) {
        return service.getAll(cpf, cnpj, nome, tipo);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public DoadorResponseDTO insert(@RequestBody DoadorRequestDTO dados) {
        return service.insert(dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping("/{ID}")
    public DoadorResponseDTO update(@PathVariable Integer ID, @RequestBody DoadorRequestDTO dados) {
        return service.update(ID, dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/{ID}")
    public ResponseEntity<Void> delete(@PathVariable Integer ID) {
        service.delete(ID);
        return ResponseEntity.noContent().build();
    }
}
