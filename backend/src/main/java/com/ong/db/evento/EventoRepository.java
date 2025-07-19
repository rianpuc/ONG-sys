package com.ong.db.evento;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventoRepository extends JpaRepository<Evento, Integer>, JpaSpecificationExecutor<Evento> {

    @Query("SELECT new com.ong.db.evento.Evento(e.ID_Evento, e.Local, e.data, e.Instituicao, e.Status) FROM Evento e WHERE e.data > :data AND e.Status = true ORDER BY e.data ASC")
    List<Evento> findTopByDataAfterOrderByDataAsc(@Param("data") LocalDate data);

    @Query("SELECT new com.ong.db.evento.Evento(e.ID_Evento, e.Local, e.data, e.Instituicao, e.Status) FROM Evento e WHERE e.data <= :data AND e.Status = true ORDER BY e.data DESC")
    List<Evento> findTopByDataBeforeOrderByDataDesc(@Param("data") LocalDate data);

}
