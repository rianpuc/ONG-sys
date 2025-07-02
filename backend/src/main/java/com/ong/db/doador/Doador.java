package com.ong.db.doador;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
@Entity
@Table(name="doador")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Doador")
public class Doador {
    @Id
    private int ID_Doador;
    private String CPF;
    private String CNPJ;
    private String Nome_Doador;
    private String Tipo_Doador;
}
