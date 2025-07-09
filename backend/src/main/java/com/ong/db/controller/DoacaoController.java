package com.ong.db.controller;

import com.ong.db.doacao.DoacaoRequestDTO;
import com.ong.db.doacao.DoacaoResponseDTO;
import com.ong.db.doacao.DoacaoService;

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

@RestController
@RequestMapping("doacao")
public class DoacaoController {
    @Autowired
    private DoacaoService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<DoacaoResponseDTO> getAll(
            @RequestParam(name = "antes", required = false) LocalDate antes,
            @RequestParam(name = "depois", required = false) LocalDate depois,
            @RequestParam(name = "Doador", required = false) Integer doador,
            @RequestParam(name = "Item", required = false) Integer item,
            @RequestParam(name = "maiorQue", required = false) Integer maiorQue,
            @RequestParam(name = "menorQue", required = false) Integer menorQue,
            @RequestParam(name = "igualA", required = false) Integer igualA) {
        return service.getAll(antes, depois, doador, item, maiorQue, menorQue, igualA);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public DoacaoResponseDTO insert(@RequestBody DoacaoRequestDTO dados) {
        return service.insert(dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping("/{ID}")
    public DoacaoResponseDTO update(@PathVariable Integer ID, @RequestBody DoacaoRequestDTO dados) {
        return service.update(ID, dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/{ID}")
    public ResponseEntity<Void> delete(@PathVariable Integer ID) {
        service.delete(ID);
        return ResponseEntity.noContent().build();
    }

}
