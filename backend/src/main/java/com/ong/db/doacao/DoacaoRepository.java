package com.ong.db.doacao;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoacaoRepository extends JpaRepository<Doacao, Integer>, JpaSpecificationExecutor<Doacao> {

    @Query("SELECT COUNT(d) FROM Doacao d WHERE d.Data >= :inicio AND d.Data <= :fim")
    long countDoacoesEntreDatas(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

}
