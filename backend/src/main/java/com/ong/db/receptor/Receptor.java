package com.ong.db.receptor;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "receptor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "CPF")
public class Receptor {
    @Id
    @Column(name = "CPF")
    private String CPF;
    @Column(name = "Nome")
    private String Nome;
    @Column(name = "Endereco")
    private String Endereco;
    @Column(name = "Status")
    private boolean Status;
    @Column(name = "Criado")
    private LocalDate Criado;
}
