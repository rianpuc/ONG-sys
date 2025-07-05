package com.ong.db.entrega;

import java.sql.Date;
import java.util.List;

import com.ong.db.itementrega.ItemEntrega;
import com.ong.db.evento.Evento;
import com.ong.db.receptor.Receptor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entrega")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Entrega")
public class Entrega {
    @Id
    @Column(name = "ID_Entrega")
    private int ID_Entrega;
    @Column(name = "Data_Entrega")
    private Date Data_Entrega;
    @ManyToOne
    @JoinColumn(name = "Evento")
    private Evento Evento;
    @ManyToOne
    @JoinColumn(name = "Receptor")
    private Receptor Receptor;
    @OneToMany(mappedBy = "ID_Entrega", fetch = FetchType.LAZY)
    private List<ItemEntrega> itens;
}
