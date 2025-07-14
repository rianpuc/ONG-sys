package com.ong.db.stats;

public record StatsResponseDTO(DoacaoStatsResponseDTO doacaoStats, DoadorStatsResponseDTO doadorStats,
        EntregaStatsResponseDTO entregaStats, EventoStatsResponseDTO eventoStats, ItemStatsResponseDTO itemStats,
        ReceptorStatsResponseDTO receptorStats, VoluntarioStatsResponseDTO voluntarioStats) {

}
