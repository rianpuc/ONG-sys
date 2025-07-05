package com.ong.db.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ong.db.item.ItemRepository;
import com.ong.db.item.ItemRequestDTO;
import com.ong.db.item.ItemResponseDTO;
import com.ong.db.item.Item;

@RestController
@RequestMapping("item")
public class ItemController {
    @Autowired
    private ItemRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public void inserirItem(@RequestBody ItemRequestDTO data) {
        Item itemData = new Item(data);
        repository.save(itemData);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<ItemResponseDTO> getAll() {
        List<ItemResponseDTO> itens = repository.findAll().stream().map(ItemResponseDTO::new).toList();
        return itens;
    }

}
