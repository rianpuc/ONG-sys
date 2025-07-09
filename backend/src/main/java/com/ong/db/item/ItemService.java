package com.ong.db.item;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.rsocket.RSocketProperties.Server.Spec;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ItemService {
    @Autowired
    private ItemRepository repository;

    public List<ItemResponseDTO> getAll(String nome, String tipo, Integer maiorQue, Integer menorQue, Integer igual) {
        Specification<Item> spec = (root, query, cb) -> cb.conjunction();
        if (nome != null && !nome.isEmpty()) {
            spec = spec.and(temNome(nome));
        }
        if (tipo != null && !tipo.isEmpty()) {
            spec = spec.and(temTipo(tipo));
        }
        if (maiorQue != null) {
            spec = spec.and(quantidadeMaiorQue(maiorQue));
        }
        if (menorQue != null) {
            spec = spec.and(quantidadeMenorQue(menorQue));
        }
        if (igual != null) {
            spec = spec.and(quantidadeIgualA(igual));
        }
        spec = spec.and(isAtivo(true));
        return repository.findAll(spec).stream().map(ItemResponseDTO::new).toList();
    }

    public ItemResponseDTO insert(ItemRequestDTO dados) {
        Item novoItem = new Item();
        novoItem.setNome_Item(dados.Nome_Item());
        novoItem.setTipo_Item(dados.Tipo_Item());
        novoItem.setQuantidade_Atual(dados.Quantidade_Atual());
        novoItem.setStatus(true);
        Item itemSalvo = repository.save(novoItem);
        return new ItemResponseDTO(itemSalvo);
    }

    public ItemResponseDTO update(Integer ID, ItemRequestDTO dados) {
        if (!repository.existsById(ID))
            throw new RuntimeException("Item não encontrado!");
        System.out.println(dados);
        Item item = repository.findById(ID).get();
        item.setNome_Item(dados.Nome_Item());
        item.setTipo_Item(dados.Tipo_Item());
        item.setQuantidade_Atual(dados.Quantidade_Atual());
        Item itemAtualizado = repository.save(item);
        return new ItemResponseDTO(itemAtualizado);
    }

    public void delete(Integer ID) {
        if (!repository.existsById(ID))
            throw new RuntimeException("Item não encontrado!");
        Item itemDeletar = repository.findById(ID).get();
        itemDeletar.setStatus(false);
        repository.save(itemDeletar);
    }

    private static Specification<Item> temNome(String nome) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Nome_Item")), "%" + nome.toLowerCase() + "%");
    }

    private static Specification<Item> temTipo(String tipo) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Tipo_Item")), "%" + tipo.toLowerCase() + "%");
    }

    private static Specification<Item> quantidadeMaiorQue(Integer valor) {
        return (root, query, cb) -> cb.greaterThan(root.get("Quantidade_Atual"), valor);
    }

    private static Specification<Item> quantidadeMenorQue(Integer valor) {
        return (root, query, cb) -> cb.lessThan(root.get("Quantidade_Atual"), valor);
    }

    private static Specification<Item> quantidadeIgualA(Integer valor) {
        return (root, query, cb) -> cb.equal(root.get("Quantidade_Atual"), valor);
    }

    private static Specification<Item> isAtivo(boolean status) {
        return (root, query, cb) -> cb.equal(root.get("Status"), status);
    }
}
