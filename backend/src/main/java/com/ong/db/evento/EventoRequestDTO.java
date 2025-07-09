package com.ong.db.evento;

import java.time.LocalDate;

public record EventoRequestDTO(String Local, LocalDate Data, String Organizador) {

}
