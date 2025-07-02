package com.ong.db.item;

public record ItemResponseDTO(Integer ID_Item, String Nome_Item, String Tipo_Item, Integer Quantidade_Atual) {
    public ItemResponseDTO(Item item){
        this(item.getID_Item(), item.getNome_Item(), item.getTipo_Item(), item.getQuantidade_Atual());
    }
}
