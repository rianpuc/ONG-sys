package com.ong.db.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.stats.DoacaoStatsResponseDTO;
import com.ong.db.stats.DoadorStatsResponseDTO;
import com.ong.db.stats.EntregaStatsResponseDTO;
import com.ong.db.stats.EventoStatsResponseDTO;
import com.ong.db.stats.ItemStatsResponseDTO;
import com.ong.db.stats.ReceptorStatsResponseDTO;
import com.ong.db.stats.StatsResponseDTO;
import com.ong.db.stats.StatsService;
import com.ong.db.stats.VoluntarioStatsResponseDTO;

@RestController
@RequestMapping("stats")
public class StatsController {
    @Autowired
    private StatsService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public StatsResponseDTO getStats() {
        return service.getStats();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/doacao")
    public DoacaoStatsResponseDTO getDoacaoStats() {
        return service.doacoesStats();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/doador")
    public DoadorStatsResponseDTO getDoadorStats() {
        return service.doadoresStats();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/entrega")
    public EntregaStatsResponseDTO getEntregaStats() {
        return service.entregasStats();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/evento")
    public EventoStatsResponseDTO getEventoStats() {
        return service.eventosStats();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/item")
    public ItemStatsResponseDTO getItemStats() {
        return service.itensStats();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/receptor")
    public ReceptorStatsResponseDTO getReceptorStats() {
        return service.receptoresStats();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/voluntario")
    public VoluntarioStatsResponseDTO getVoluntarioStats() {
        return service.voluntariosStats();
    }

}
