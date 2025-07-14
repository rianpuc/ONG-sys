package com.ong.db.stats;

import java.util.List;

public record ReceptorStatsResponseDTO(long receptoresRegistrados, List<ReceptorAusenteDTO> receptoresAusentes) {

}
