package com.ong.db.entrega;

import java.time.LocalDate;
import java.util.List;

import com.ong.db.evento.EventoResponseDTO;
import com.ong.db.itementrega.ItemEntregaResponseDTO;
import com.ong.db.receptor.ReceptorResponseDTO;

public record EntregaResponseDTO(Integer ID_Entrega, LocalDate Data_Entrega, EventoResponseDTO Evento,
        ReceptorResponseDTO Receptor,
        List<ItemEntregaResponseDTO> itensEntregues) {
    public EntregaResponseDTO(Entrega entrega) {
        this(entrega.getID_Entrega(), entrega.getData(), new EventoResponseDTO(entrega.getEvento()),
                new ReceptorResponseDTO(entrega.getReceptor()),
                entrega.getItens().stream().map(ItemEntregaResponseDTO::new).toList());
    }
}
