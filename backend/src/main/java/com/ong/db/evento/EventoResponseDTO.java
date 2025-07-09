package com.ong.db.evento;

import java.time.LocalDate;

public record EventoResponseDTO(Integer ID_Evento, String Local, LocalDate Data, String Organizador) {
    public EventoResponseDTO(Evento evento) {
        this(evento.getID_Evento(), evento.getLocal(), evento.getData(), evento.getInstituicao().getNome());
    }
}
