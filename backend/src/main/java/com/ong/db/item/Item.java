package com.ong.db.item;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ID_Item")
public class Item {
    @Id
    @Column(name="ID_Item")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID_Item;
    @Column(name="Nome_Item")
    private String Nome_Item;
    @Column(name="Tipo_Item")
    private String Tipo_Item;
    @Column(name="Quantidade_Atual")
    private int Quantidade_Atual;
    public Item(ItemRequestDTO data){
        this.Nome_Item = data.Nome_Item();
        this.Tipo_Item = data.Tipo_Item();
        this.Quantidade_Atual = data.Quantidade_Atual();
    }
}
