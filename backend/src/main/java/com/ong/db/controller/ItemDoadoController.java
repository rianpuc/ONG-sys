package com.ong.db.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ong.db.itemdoado.ItemDoadoRepository;
import com.ong.db.itemdoado.ItemDoadoResponseDTO;
import com.ong.db.itemdoado.ItemDoado;

@RestController
@RequestMapping("item_doado")
public class ItemDoadoController {
    @Autowired
    private ItemDoadoRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<ItemDoadoResponseDTO> getAll() {
        List<ItemDoadoResponseDTO> itens = repository.findAll().stream().map(ItemDoadoResponseDTO::new).toList();
        return itens;
    }
}
