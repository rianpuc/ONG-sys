package com.ong.db.itemdoado;

public record ItemDoadoResponseDTO(Integer ID_Item, String nomeItem, String tipoItem, int quantidade) {
    public ItemDoadoResponseDTO(ItemDoado itemDoado) {
        this(itemDoado.getItem().getID_Item(), itemDoado.getItem().getNome_Item(),
                itemDoado.getItem().getTipo_Item(), itemDoado.getQuantidade());
    }

}