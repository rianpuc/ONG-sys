package com.ong.db.receptor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ong.db.stats.ReceptorAusenteDTO;

public interface ReceptorRepository extends JpaRepository<Receptor, String>, JpaSpecificationExecutor<Receptor> {
    @Query("SELECT COUNT(r.CPF) FROM Receptor r WHERE r.Criado BETWEEN :inicio AND :fim")
    long getReceptoresCriadosEntreDatas(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT new com.ong.db.stats.ReceptorAusenteDTO(r.Nome, r.CPF) FROM Receptor r WHERE r.CPF NOT IN (SELECT en.Receptor.CPF FROM Entrega en JOIN Evento e ON e.ID_Evento = en.Evento.ID_Evento WHERE e.Data = (SELECT MAX(Data) FROM Evento WHERE Data < :hoje))")
    List<ReceptorAusenteDTO> getReceptoresAusentes(@Param("hoje") LocalDate hoje);

}
