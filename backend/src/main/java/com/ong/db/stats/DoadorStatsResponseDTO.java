package com.ong.db.stats;

import java.util.List;

public record DoadorStatsResponseDTO(long doadoresCriados, List<DoadorTipoCount> doadoresDistribuicao,
        long quantidadeDoadores) {

}
