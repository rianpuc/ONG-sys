package com.ong.db.entrega;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.ong.db.itementrega.ItemEntregaResponseDTO;

public record EntregaResponseDTO(Integer ID_Entrega, Date Data_Entrega, String Local_Evento, String Nome_Receptor,
        List<ItemEntregaResponseDTO> itensEntregues) {
    public EntregaResponseDTO(Entrega entrega) {
        this(entrega.getID_Entrega(), entrega.getData_Entrega(), entrega.getEvento().getLocal(),
                entrega.getReceptor().getNome(),
                entrega.getItens().stream().map(ItemEntregaResponseDTO::new).collect(Collectors.toList()));
    }
}
