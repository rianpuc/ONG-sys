package com.ong.db.doacao;

import java.time.LocalDate;
import java.util.List;
import com.ong.db.itemdoado.ItemDoadoRequestDTO;

public record DoacaoRequestDTO(LocalDate Data, Integer Doador, List<ItemDoadoRequestDTO> itensDoados) {

}
