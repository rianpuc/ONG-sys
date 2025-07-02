package com.ong.db.doacao;
import com.ong.db.doador.Doador;
import java.sql.Date;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doacao")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID")
public class Doacao {
    @Id @Column(name = "ID_Doacao")
    private int ID;
    @Column(name = "Data")
    private Date Data;
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "Doador") 
    private Doador Doador;
}
