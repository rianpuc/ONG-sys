package com.ong.db.itemdoado;

public record ItemDoadoResponseDTO(Integer ID_Item, String nomeItem, String tipoItem, int quantidade) {
    public ItemDoadoResponseDTO(ItemDoado itemDoado) {
        this(itemDoado.getID_Item().getID_Item(), itemDoado.getID_Item().getNome_Item(),
                itemDoado.getID_Item().getTipo_Item(), itemDoado.getQuantidade());
    }

}