package com.ong.db.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ong.db.item.ItemRequestDTO;
import com.ong.db.item.ItemResponseDTO;
import com.ong.db.item.ItemService;

@RestController
@RequestMapping("item")
public class ItemController {
    @Autowired
    private ItemService service;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<ItemResponseDTO> getAll(
            @RequestParam(name = "Nome", required = false) String nome,
            @RequestParam(name = "Tipo", required = false) String tipo,
            @RequestParam(name = "maiorQue", required = false) Integer maiorQue,
            @RequestParam(name = "menorQue", required = false) Integer menorQue,
            @RequestParam(name = "igualA", required = false) Integer igualA) {
        return service.getAll(nome, tipo, maiorQue, menorQue, igualA);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public ItemResponseDTO insert(@RequestBody ItemRequestDTO dados) {
        return service.insert(dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping("/{ID}")
    public ItemResponseDTO update(@PathVariable Integer ID, @RequestBody ItemRequestDTO dados) {
        return service.update(ID, dados);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @DeleteMapping("/{ID}")
    public ResponseEntity<Void> delete(@PathVariable Integer ID) {
        service.delete(ID);
        return ResponseEntity.noContent().build();
    }

}
