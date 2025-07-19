package com.ong.db.doacao;

import com.ong.db.doador.Doador;
import com.ong.db.itemdoado.ItemDoado;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID")
public class Doacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Doacao")
    private int ID;
    @Column(name = "Data")
    private LocalDate data;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Doador")
    private Doador Doador;
    @Column(name = "Status")
    private boolean Status;
    @OneToMany(mappedBy = "Doacao", fetch = FetchType.LAZY)
    private List<ItemDoado> itens = new ArrayList<>();
}
