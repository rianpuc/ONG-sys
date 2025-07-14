package com.ong.db.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.ong.db.stats.TopItemDTO;

public interface ItemRepository extends JpaRepository<Item, Integer>, JpaSpecificationExecutor<Item> {

    @Query("SELECT i.Nome_Item, i.Quantidade_Atual FROM Item i GROUP BY i.ID_Item HAVING i.Quantidade_Atual = (SELECT MIN(i2.Quantidade_Atual) FROM Item i2)")
    List<TopItemDTO> menoresItensEmEstoque();
}
