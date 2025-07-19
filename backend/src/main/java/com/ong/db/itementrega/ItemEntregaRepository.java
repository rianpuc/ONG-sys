package com.ong.db.itementrega;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ong.db.stats.TopItemDTO;

public interface ItemEntregaRepository extends JpaRepository<ItemEntrega, Integer> {
    @Query("SELECT COALESCE(SUM(ie.Quantidade), 0) FROM ItemEntrega ie WHERE ie.ID_Entrega.Evento.ID_Evento = :eventoId")
    long sumQuantidadeByEventoId(@Param("eventoId") Integer eventoId);

    @Query("SELECT new com.ong.db.stats.TopItemDTO(ie.ID_Item.Nome_Item, SUM(ie.Quantidade)) FROM Entrega e JOIN ItemEntrega ie ON ie.ID_Entrega.ID_Entrega = e.ID_Entrega JOIN Item i ON i.ID_Item = ie.ID_Item.ID_Item WHERE e.data BETWEEN :inicio AND :fim GROUP BY ie.ID_Item.ID_Item HAVING SUM(ie.Quantidade) = (SELECT MAX(quantidade_total) FROM (SELECT SUM(ie2.Quantidade) as quantidade_total FROM Entrega e2 JOIN ItemEntrega ie2 ON ie2.ID_Entrega.ID_Entrega = e2.ID_Entrega WHERE e2.data BETWEEN :inicio AND :fim GROUP BY ie2.ID_Item.ID_Item) AS subquery)")
    List<TopItemDTO> getMaioresItensEntregues(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
