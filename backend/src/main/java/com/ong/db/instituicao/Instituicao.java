package com.ong.db.instituicao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "instituicao")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "CNPJ")
public class Instituicao {
    @Id
    @Column(name = "CNPJ")
    private String CNPJ;
    @Column(name = "Nome")
    private String Nome;
    @Column(name = "Endereço")
    private String Endereco;
}
