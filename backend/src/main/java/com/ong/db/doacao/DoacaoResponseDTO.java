package com.ong.db.doacao;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.ong.db.doador.DoadorResponseDTO;
import com.ong.db.itemdoado.ItemDoadoResponseDTO;

public record DoacaoResponseDTO(Integer ID_Doacao, Date Data, DoadorResponseDTO Doador,
        List<ItemDoadoResponseDTO> itensDoados) {
    public DoacaoResponseDTO(Doacao doacao) {
        this(doacao.getID(), doacao.getData(), new DoadorResponseDTO(doacao.getDoador()),
                doacao.getItens().stream().map(ItemDoadoResponseDTO::new).collect(Collectors.toList()));
    }

}
