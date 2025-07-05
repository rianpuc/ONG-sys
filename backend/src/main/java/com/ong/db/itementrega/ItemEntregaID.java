package com.ong.db.itementrega;

import java.io.Serializable;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class ItemEntregaID implements Serializable {
    private int ID_Item;
    private int ID_Entrega;
}
