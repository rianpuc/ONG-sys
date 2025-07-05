package com.ong.db.itementrega;

import com.ong.db.entrega.Entrega;
import com.ong.db.item.Item;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item_da_entrega")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ItemEntrega {
    @EmbeddedId
    private ItemEntregaID ID;
    @ManyToOne
    @MapsId("ID_Item")
    @JoinColumn(name = "ID_Item")
    private Item ID_Item;
    @ManyToOne
    @MapsId("ID_Entrega")
    @JoinColumn(name = "ID_Entrega")
    private Entrega ID_Entrega;
    @Column(name = "Quantidade")
    private int Quantidade;
}
