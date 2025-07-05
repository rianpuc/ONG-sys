package com.ong.db.itemdoado;

import com.ong.db.doacao.Doacao;
import com.ong.db.item.Item;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item_doado")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Item")
public class ItemDoado {
    @EmbeddedId
    private ItemDoadoID ID;
    @ManyToOne
    @MapsId("ID_Item")
    @JoinColumn(name = "ID_Item")
    private Item ID_Item;
    @ManyToOne
    @MapsId("ID_Doacao")
    @JoinColumn(name = "ID_Doacao")
    private Doacao ID_Doacao;
    @Column(name = "Quantidade")
    private int Quantidade;
}
