package com.ong.db.stats;

import java.util.List;

public record DoacaoStatsResponseDTO(long doacoesMesAtual, long doacoesMesAnterior, List<TopItemDTO> top3Itens) {

}
