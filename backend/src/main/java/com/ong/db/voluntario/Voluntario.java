package com.ong.db.voluntario;

import com.ong.db.instituicao.Instituicao;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "voluntario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "CPF")
public class Voluntario {
    @Id
    @Column(name = "CPF")
    private String CPF;
    @Column(name = "Nome")
    private String Nome;
    @Column(name = "Funcao")
    private String Funcao;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Instituicao")
    private Instituicao Instituicao;
}
