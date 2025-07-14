package com.ong.db.stats;

import java.util.List;

//, TopItemDTO maisEntregue, List<TopItemDTO> menores3Itens
public record ItemStatsResponseDTO(List<TopItemDTO> maisDoado, List<TopItemDTO> maisEntregue,
        List<TopItemDTO> menoresItensEmEstoque) {

}
