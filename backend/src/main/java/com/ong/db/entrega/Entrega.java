package com.ong.db.entrega;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.ong.db.itementrega.ItemEntrega;
import com.ong.db.evento.Evento;
import com.ong.db.receptor.Receptor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "entrega")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Entrega")
public class Entrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Entrega")
    private Integer ID_Entrega;
    @Column(name = "Data_Entrega")
    private LocalDate data;
    @Column(name = "Status")
    private boolean Status;
    @ManyToOne
    @JoinColumn(name = "Evento")
    private Evento Evento;
    @ManyToOne
    @JoinColumn(name = "Receptor")
    private Receptor Receptor;
    @OneToMany(mappedBy = "ID_Entrega", fetch = FetchType.LAZY)
    private List<ItemEntrega> itens = new ArrayList<>();

}
