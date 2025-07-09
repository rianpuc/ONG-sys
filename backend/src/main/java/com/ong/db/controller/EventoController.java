package com.ong.db.controller;

import java.sql.Date;
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
import com.ong.db.evento.EventoResponseDTO;
import com.ong.db.evento.EventoService;
import com.ong.db.receptor.ReceptorRequestDTO;
import com.ong.db.receptor.ReceptorResponseDTO;
import com.ong.db.evento.EventoRepository;
import com.ong.db.evento.EventoRequestDTO;

@RestController
@RequestMapping("evento")
public class EventoController {
    @Autowired
    private EventoService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<EventoResponseDTO> getAll(
            @RequestParam(name = "local", required = false) String Local,
            @RequestParam(name = "data", required = false) LocalDate Data,
            @RequestParam(name = "instituicao", required = false) String CNPJ) {
        return service.getAll(Local, Data, CNPJ);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public EventoResponseDTO insert(@RequestBody EventoRequestDTO dados) {
        return service.insert(dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping("/{ID}")
    public EventoResponseDTO update(@PathVariable Integer ID, @RequestBody EventoRequestDTO dados) {
        return service.update(ID, dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/{ID}")
    public ResponseEntity<Void> delete(@PathVariable Integer ID) {
        service.delete(ID);
        return ResponseEntity.noContent().build();
    }
}
