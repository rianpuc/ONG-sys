package com.ong.db.itementrega;

public record ItemEntregaResponseDTO(Integer ID_Item, String nomeItem, String tipoItem, Integer Quantidade) {
    public ItemEntregaResponseDTO(ItemEntrega itemEntrega) {
        this(itemEntrega.getID_Item().getID_Item(), itemEntrega.getID_Item().getNome_Item(),
                itemEntrega.getID_Item().getTipo_Item(), itemEntrega.getQuantidade());
    }
}
