package com.ong.db.entrega;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.criteria.Join;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ong.db.evento.Evento;
import com.ong.db.evento.EventoRepository;
import com.ong.db.item.Item;
import com.ong.db.item.ItemRepository;
import com.ong.db.itementrega.ItemEntrega;
import com.ong.db.itementrega.ItemEntregaID;
import com.ong.db.itementrega.ItemEntregaRepository;
import com.ong.db.itementrega.ItemEntregaRequestDTO;
import com.ong.db.receptor.Receptor;
import com.ong.db.receptor.ReceptorRepository;

@Service
public class EntregaService {
    @Autowired
    private EntregaRepository entregaRepository;
    @Autowired
    private ReceptorRepository receptorRepository;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ItemEntregaRepository itemEntregaRepository;

    public List<EntregaResponseDTO> getAll(Integer evento, String receptor,
            Integer item, Integer maiorQue, Integer menorQue, Integer igualA) {
        Specification<Entrega> spec = (root, query, cb) -> cb.conjunction();
        if (evento != null) {
            spec = spec.and(temEvento(evento));
        }
        if (receptor != null && !receptor.isEmpty()) {
            spec = spec.and(temReceptor(receptor));
        }
        if (item != null) {
            spec = spec.and(temItem(item));
        }
        if (maiorQue != null) {
            spec = spec.and(quantidadeMaiorQue(maiorQue));
        }
        if (menorQue != null) {
            spec = spec.and(quantidadeMenorQue(menorQue));
        }
        if (igualA != null) {
            spec = spec.and(quantidadeIgualA(igualA));
        }
        spec = spec.and(isAtivo(true));
        List<EntregaResponseDTO> entregas = entregaRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "data"))
                .stream().map(EntregaResponseDTO::new)
                .toList();
        return entregas;
    }

    @Transactional
    public EntregaResponseDTO insert(EntregaRequestDTO dados) {
        Receptor receptor = receptorRepository.findById(dados.Receptor())
                .orElseThrow(() -> new RuntimeException("Receptor não encontrado!"));
        Entrega novaEntrega = new Entrega();
        novaEntrega.setReceptor(receptor);
        Evento evento = eventoRepository.findById(dados.Evento())
                .orElseThrow(() -> new RuntimeException("Evento não encontrado!"));
        novaEntrega.setEvento(evento);
        if (dados.Data().isAfter(LocalDate.now())) {
            new RuntimeException("Não é possível registrar uma entrega para um evento que ainda não aconteceu!");
        }
        novaEntrega.setData(dados.Data());
        novaEntrega.setStatus(true);
        Entrega entregaSalva = entregaRepository.save(novaEntrega);
        for (ItemEntregaRequestDTO itemDTO : dados.itensEntregues()) {
            Item item = itemRepository.findById(itemDTO.ID_Item())
                    .orElseThrow(() -> new RuntimeException("Item não encontrado!"));
            int estoqueAtual = item.getQuantidade_Atual();
            if (itemDTO.Quantidade() > estoqueAtual) {
                throw new RuntimeException("Quantidade entregue maior que estoque!");
            }
            item.setQuantidade_Atual(estoqueAtual - itemDTO.Quantidade());
            itemRepository.save(item);
            ItemEntrega itemEntrega = new ItemEntrega();
            itemEntrega.setID_Entrega(entregaSalva);
            itemEntrega.setID_Item(item);
            itemEntrega.setQuantidade(itemDTO.Quantidade());
            itemEntrega.setStatus(true);
            itemEntrega.setID(new ItemEntregaID(item.getID_Item(), entregaSalva.getID_Entrega()));
            itemEntregaRepository.save(itemEntrega);
        }
        Entrega entregaCompleta = entregaRepository.findById(entregaSalva.getID_Entrega()).get();
        return new EntregaResponseDTO(entregaCompleta);
    }

    @Transactional
    public EntregaResponseDTO update(Integer ID, EntregaRequestDTO dados) {
        Entrega entrega = entregaRepository.findById(ID)
                .orElseThrow(() -> new RuntimeException("Entrega não encontrada!"));
        for (ItemEntrega itemAntigo : entrega.getItens()) {
            Item item = itemAntigo.getID_Item();
            int estoqueAtual = item.getQuantidade_Atual();
            item.setQuantidade_Atual(estoqueAtual + itemAntigo.getQuantidade());
            itemRepository.save(item);
        }
        itemEntregaRepository.deleteAll(entrega.getItens());
        entrega.getItens().clear();
        /* COLOCANDO NOVAS INFORMACOES NA ENTREGA */
        Receptor novoReceptor = receptorRepository.findById(dados.Receptor())
                .orElseThrow(() -> new RuntimeException("Receptor nao encontrado!"));
        Evento novoEvento = eventoRepository.findById(dados.Evento())
                .orElseThrow(() -> new RuntimeException("Evento nao encontrado!"));
        entrega.setData(dados.Data());
        entrega.setReceptor(novoReceptor);
        entrega.setEvento(novoEvento);
        entrega.setStatus(true);
        /* COLOCANDO NOVOS ITENS NA ENTREGA */
        for (ItemEntregaRequestDTO itemDTO : dados.itensEntregues()) {
            Item item = itemRepository.findById(itemDTO.ID_Item())
                    .orElseThrow(() -> new RuntimeException("Item nao encontrado!"));
            int estoqueAtual = item.getQuantidade_Atual();
            if (itemDTO.Quantidade() > estoqueAtual) {
                throw new RuntimeException("Quantidade entregue maior que estoque!");
            }
            item.setQuantidade_Atual(estoqueAtual - itemDTO.Quantidade());
            itemRepository.save(item);
            ItemEntrega itemEntrega = new ItemEntrega();
            itemEntrega.setID_Entrega(entrega);
            itemEntrega.setID_Item(item);
            itemEntrega.setQuantidade(itemDTO.Quantidade());
            itemEntrega.setStatus(true);
            itemEntrega.setID(new ItemEntregaID(item.getID_Item(), entrega.getID_Entrega()));
            entrega.getItens().add(itemEntregaRepository.save(itemEntrega));
        }
        return new EntregaResponseDTO(entrega);
    }

    public void delete(Integer ID) {
        if (!entregaRepository.existsById(ID)) {
            throw new RuntimeException("Entrega nao encontrada!");
        }
        Entrega entrega = entregaRepository.findById(ID).get();
        for (ItemEntrega itemEntrega : entrega.getItens()) {
            Item item = itemEntrega.getID_Item();
            int estoqueAtual = item.getQuantidade_Atual();
            item.setQuantidade_Atual(estoqueAtual + itemEntrega.getQuantidade());
            itemRepository.save(item);
            itemEntrega.setStatus(false);
            itemEntregaRepository.save(itemEntrega);
        }
        entrega.setStatus(false);
        entregaRepository.save(entrega);
    }

    private static Specification<Entrega> isAtivo(boolean status) {
        return (root, query, cb) -> cb.equal(root.get("Status"), status);
    }

    private static Specification<Entrega> temEvento(Integer evento) {
        return (root, query, cb) -> cb.equal(root.get("Evento").get("ID_Evento"), evento);
    }

    private static Specification<Entrega> temReceptor(String receptor) {
        return (root, query, cb) -> cb.equal(root.get("Receptor").get("CPF"), receptor);
    }

    private static Specification<Entrega> temItem(Integer item) {
        return (root, query, cb) -> {
            Join<Entrega, ItemEntrega> joinItens = root.join("itens");
            return cb.equal(joinItens.get("ID_Item").get("ID_Item"), item);
        };
    }

    private static Specification<Entrega> quantidadeMaiorQue(Integer valor) {
        return (root, query, cb) -> {
            Join<Entrega, ItemEntrega> joinItens = root.join("itens");
            return cb.greaterThan(joinItens.get("Quantidade"), valor);
        };
    }

    private static Specification<Entrega> quantidadeMenorQue(Integer valor) {
        return (root, query, cb) -> {
            Join<Entrega, ItemEntrega> joinItens = root.join("itens");
            return cb.lessThan(joinItens.get("Quantidade"), valor);
        };
    }

    private static Specification<Entrega> quantidadeIgualA(Integer valor) {
        return (root, query, cb) -> {
            Join<Entrega, ItemEntrega> joinItens = root.join("itens");
            return cb.equal(joinItens.get("Quantidade"), valor);
        };
    }

}
