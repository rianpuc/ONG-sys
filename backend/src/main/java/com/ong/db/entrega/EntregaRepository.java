package com.ong.db.entrega;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EntregaRepository extends JpaRepository<Entrega, Integer>, JpaSpecificationExecutor<Entrega> {
    @Query("SELECT COUNT(e) FROM Entrega e WHERE e.Data_Entrega >= :inicio AND e.Data_Entrega <= :fim")
    long countEntregasEntreDatas(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
