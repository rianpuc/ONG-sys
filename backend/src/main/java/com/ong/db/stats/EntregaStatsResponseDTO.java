package com.ong.db.stats;

import java.util.List;

public record EntregaStatsResponseDTO(long entregasRealizadas, List<ItemDoadoEntregue> balancoMensal) {

}
