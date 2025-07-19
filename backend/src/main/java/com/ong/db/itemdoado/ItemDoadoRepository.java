package com.ong.db.itemdoado;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ong.db.stats.ItemDoadoEntregue;
import com.ong.db.stats.TopItemDTO;

public interface ItemDoadoRepository extends JpaRepository<ItemDoado, Integer> {
        @Query("SELECT new com.ong.db.stats.TopItemDTO(id.Item.Nome_Item, SUM(id.Quantidade)) " +
                        "FROM ItemDoado id " +
                        "WHERE id.Doacao.data >= :inicio AND id.Doacao.data <= :fim AND id.Status = true " +
                        "GROUP BY id.Item.Nome_Item " +
                        "ORDER BY SUM(id.Quantidade) DESC " +
                        "LIMIT 3")
        List<TopItemDTO> getTop3ItensDoados(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

        @Query("SELECT new com.ong.db.stats.ItemDoadoEntregue(i.Nome_Item, " +
                        "   COALESCE(doado.totalDoado, 0L), " +
                        "   COALESCE(entregue.totalEntregue, 0L)) " +
                        "FROM Item i " +
                        "LEFT JOIN (SELECT id.Item.ID_Item AS itemId, SUM(id.Quantidade) AS totalDoado " +
                        "           FROM ItemDoado id WHERE id.Doacao.data BETWEEN :inicio AND :fim AND id.Status = true "
                        +
                        "           GROUP BY id.Item.ID_Item) AS doado ON i.ID_Item = doado.itemId " +
                        "LEFT JOIN (SELECT ie.ID_Item.ID_Item AS itemId, SUM(ie.Quantidade) AS totalEntregue " +
                        "           FROM ItemEntrega ie WHERE ie.ID_Entrega.data >= :inicio AND ie.ID_Entrega.data <= :fim AND ie.Status = true "
                        +
                        "           GROUP BY ie.ID_Item.ID_Item) AS entregue ON i.ID_Item = entregue.itemId")
        List<ItemDoadoEntregue> getBalancoMensalItens(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

        @Query("SELECT new com.ong.db.stats.TopItemDTO(id.Item.Nome_Item, SUM(id.Quantidade)) FROM Doacao d JOIN ItemDoado id ON id.Doacao.ID = d.ID JOIN Item i ON i.ID_Item = id.Item.ID_Item WHERE d.data BETWEEN :inicio AND :fim GROUP BY id.Item.ID_Item HAVING SUM(id.Quantidade) = (SELECT MAX(quantidade_total) FROM (SELECT SUM(id2.Quantidade) as quantidade_total FROM Doacao d2 JOIN ItemDoado id2 ON id2.Doacao.ID = d2.ID WHERE d2.data BETWEEN :inicio AND :fim GROUP BY id2.Item.ID_Item) AS subquery)")
        List<TopItemDTO> getMaioresItensDoados(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
