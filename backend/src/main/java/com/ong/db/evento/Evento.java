package com.ong.db.evento;

import java.sql.Date;
import com.ong.db.instituicao.Instituicao;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evento")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Evento")
public class Evento {
    @Id
    @Column(name = "ID_Evento")
    private int ID_Evento;
    @Column(name = "Local")
    private String Local;
    @Column(name = "Data")
    private Date Data;
    @ManyToOne
    @JoinColumn(name = "Instituicao")
    private Instituicao Instituicao;
}
