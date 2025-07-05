package com.ong.db.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ong.db.evento.EventoResponseDTO;
import com.ong.db.evento.EventoRepository;

@RestController
@RequestMapping("evento")
public class EventoController {
    @Autowired
    private EventoRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<EventoResponseDTO> getAll() {
        List<EventoResponseDTO> eventos = repository.findAll().stream().map(EventoResponseDTO::new).toList();
        return eventos;
    }

}
