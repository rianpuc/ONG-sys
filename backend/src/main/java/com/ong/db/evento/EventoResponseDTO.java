package com.ong.db.evento;

import java.sql.Date;

public record EventoResponseDTO(Integer ID_Evento, String Local, Date Data, String Organizador) {
    public EventoResponseDTO(Evento evento) {
        this(evento.getID_Evento(), evento.getLocal(), evento.getData(), evento.getInstituicao().getNome());
    }
}
