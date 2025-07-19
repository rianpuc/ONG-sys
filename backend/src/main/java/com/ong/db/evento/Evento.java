package com.ong.db.evento;

import java.time.LocalDate;

import com.ong.db.instituicao.Instituicao;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "evento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Evento")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Evento")
    private int ID_Evento;
    @Column(name = "Local")
    private String Local;
    @Column(name = "Data")
    private LocalDate data;
    @ManyToOne
    @JoinColumn(name = "Instituicao")
    private Instituicao Instituicao;
    @Column(name = "Status")
    private boolean Status;
}
