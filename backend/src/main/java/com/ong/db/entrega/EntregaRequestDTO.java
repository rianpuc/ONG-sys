package com.ong.db.entrega;

import java.time.LocalDate;
import java.util.List;

import com.ong.db.itementrega.ItemEntregaRequestDTO;

public record EntregaRequestDTO(LocalDate Data, Integer Evento, String Receptor,
        List<ItemEntregaRequestDTO> itensEntregues) {

}
