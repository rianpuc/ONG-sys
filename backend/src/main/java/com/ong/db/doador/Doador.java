package com.ong.db.doador;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Doador")
public class Doador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Doador")
    private int ID_Doador;
    @Column(name = "CPF")
    private String CPF;
    @Column(name = "CNPJ")
    private String CNPJ;
    @Column(name = "Nome_Doador")
    private String Nome_Doador;
    @Column(name = "Tipo_Doador")
    private String Tipo_Doador;
    @Column(name = "Ativo")
    private boolean Ativo;
    @Column(name = "Criado")
    private LocalDate Criado;
}
