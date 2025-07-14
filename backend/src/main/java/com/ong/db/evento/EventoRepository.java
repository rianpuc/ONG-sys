package com.ong.db.evento;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventoRepository extends JpaRepository<Evento, Integer>, JpaSpecificationExecutor<Evento> {

    @Query("SELECT new com.ong.db.evento.Evento(e.ID_Evento, e.Local, e.Data, e.Instituicao, e.Status) FROM Evento e WHERE e.Data > :data AND e.Status = true ORDER BY e.Data ASC")
    Optional<Evento> findTopByDataAfterOrderByDataAsc(@Param("data") LocalDate data);

    @Query("SELECT new com.ong.db.evento.Evento(e.ID_Evento, e.Local, e.Data, e.Instituicao, e.Status) FROM Evento e WHERE e.Data <= :data AND e.Status = true ORDER BY e.Data DESC")
    Optional<Evento> findTopByDataBeforeOrderByDataDesc(@Param("data") LocalDate data);

}
