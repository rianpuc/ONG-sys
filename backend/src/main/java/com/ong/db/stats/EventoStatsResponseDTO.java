package com.ong.db.stats;

import java.time.LocalDate;

public record EventoStatsResponseDTO(String localEvento, LocalDate dataEvento, String statusEvento, long diasEvento,
                long totalItens) {

}
