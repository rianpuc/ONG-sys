package com.ong.db.receptor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "receptor")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "CPF")
public class Receptor {
    @Id
    @Column(name = "CPF")
    private String CPF;
    @Column(name = "Nome")
    private String Nome;
    @Column(name = "Endereço")
    private String Endereco;
}
