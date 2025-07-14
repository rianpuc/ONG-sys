package com.ong.db.doacao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ong.db.doador.Doador;
import com.ong.db.doador.DoadorRepository;
import com.ong.db.item.Item;
import com.ong.db.item.ItemRepository;
import com.ong.db.itemdoado.ItemDoado;
import com.ong.db.itemdoado.ItemDoadoID;
import com.ong.db.itemdoado.ItemDoadoRepository;
import com.ong.db.itemdoado.ItemDoadoRequestDTO;

import jakarta.persistence.criteria.Join;

@Service
public class DoacaoService {
    @Autowired
    private DoacaoRepository doacaoRepository;
    @Autowired
    private DoadorRepository doadorRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ItemDoadoRepository itemDoadoRepository;

    @Query
    public List<DoacaoResponseDTO> getAll(LocalDate antes, LocalDate depois, Integer doador,
            Integer item, Integer maiorQue, Integer menorQue, Integer igualA) {
        Specification<Doacao> spec = (root, query, cb) -> cb.conjunction();
        if (antes != null) {
            spec = spec.and(dataAntesDe(antes));
        }
        if (depois != null) {
            spec = spec.and(dataDepoisDe(depois));
        }
        if (doador != null) {
            spec = spec.and(doadorIgual(doador));
        }
        if (item != null) {
            spec = spec.and(itemIgual(item));
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
        List<DoacaoResponseDTO> doacoes = doacaoRepository.findAll(spec).stream().map(DoacaoResponseDTO::new).toList();
        return doacoes;
    }

    @Transactional
    public DoacaoResponseDTO insert(DoacaoRequestDTO dados) {
        Doador doador = doadorRepository.findById(dados.Doador())
                .orElseThrow(() -> new RuntimeException("Doador não encontrado!"));
        Doacao novaDoacao = new Doacao();
        novaDoacao.setDoador(doador);
        novaDoacao.setStatus(true);
        novaDoacao.setData(dados.Data());
        Doacao doacaoSalva = doacaoRepository.save(novaDoacao);
        for (ItemDoadoRequestDTO itemDTO : dados.itensDoados()) {
            Item item = itemRepository.findById(itemDTO.ID_Item())
                    .orElseThrow(() -> new RuntimeException("Item não encontrado!"));
            int estoqueAtual = item.getQuantidade_Atual();
            item.setQuantidade_Atual(estoqueAtual + itemDTO.Quantidade());
            itemRepository.save(item);
            ItemDoado itemDoado = new ItemDoado();
            itemDoado.setItem(item);
            itemDoado.setDoacao(doacaoSalva);
            itemDoado.setQuantidade(itemDTO.Quantidade());
            itemDoado.setID(new ItemDoadoID(item.getID_Item(), doacaoSalva.getID()));
            itemDoado.setStatus(true);
            itemDoadoRepository.save(itemDoado);
        }
        Doacao doacaoCompleta = doacaoRepository.findById(novaDoacao.getID()).get();
        return new DoacaoResponseDTO(doacaoCompleta);
    }

    @Transactional
    public DoacaoResponseDTO update(Integer ID, DoacaoRequestDTO dados) {
        Doacao doacao = doacaoRepository.findById(ID).orElseThrow(() -> new RuntimeException("Doacao não encontrada!"));
        /* LIMPANDO TODAS OS ITENS VINCULADOS A ESSA DOACAO */
        for (ItemDoado itemAntigo : doacao.getItens()) {
            Item item = itemAntigo.getItem();
            int estoqueAtual = item.getQuantidade_Atual();
            item.setQuantidade_Atual(estoqueAtual - itemAntigo.getQuantidade());
            itemRepository.save(item);
        }
        itemDoadoRepository.deleteAll(doacao.getItens());
        doacao.getItens().clear();
        /* COLOCANDO NOVAS INFORMACOES NA DOACAO */
        Doador novoDoador = doadorRepository.findById(dados.Doador())
                .orElseThrow(() -> new RuntimeException("Doador não encontrado!"));
        doacao.setData(dados.Data());
        doacao.setDoador(novoDoador);
        /* COLOCANDO TODOS OS ITENS NOVAMENTE NA TABELA */
        for (ItemDoadoRequestDTO itemNovo : dados.itensDoados()) {
            Item item = itemRepository.findById(itemNovo.ID_Item())
                    .orElseThrow(() -> new RuntimeException("Item não encontrado!"));
            item.setQuantidade_Atual(item.getQuantidade_Atual() + itemNovo.Quantidade());
            itemRepository.save(item);
            ItemDoado novoItemDoado = new ItemDoado();
            novoItemDoado.setDoacao(doacao);
            novoItemDoado.setItem(item);
            novoItemDoado.setID(new ItemDoadoID(item.getID_Item(), doacao.getID()));
            novoItemDoado.setQuantidade(itemNovo.Quantidade());
            novoItemDoado.setStatus(true);
            doacao.getItens().add(itemDoadoRepository.save(novoItemDoado));
        }
        return new DoacaoResponseDTO(doacao);
    }

    public void delete(Integer ID) {
        if (!doacaoRepository.existsById(ID)) {
            throw new RuntimeException("Doacao nao encontrada!");
        }
        Doacao doacao = doacaoRepository.findById(ID).get();
        for (ItemDoado itemAntigo : doacao.getItens()) {
            Item item = itemAntigo.getItem();
            int estoqueAtual = item.getQuantidade_Atual();
            item.setQuantidade_Atual(estoqueAtual - itemAntigo.getQuantidade());
            itemRepository.save(item);
            itemAntigo.setStatus(false);
            itemDoadoRepository.save(itemAntigo);
        }
        doacao.setStatus(false);
        doacaoRepository.save(doacao);
    }

    Specification<Doacao> dataAntesDe(LocalDate date) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("Data"), date);
    }

    Specification<Doacao> dataDepoisDe(LocalDate date) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("Data"), date);
    }

    Specification<Doacao> doadorIgual(Integer doador) {
        return (root, query, cb) -> cb.equal(root.get("Doador").get("ID_Doador"), doador);
    }

    Specification<Doacao> itemIgual(Integer item) {
        return (root, query, cb) -> {
            Join<Doacao, ItemDoado> joinItens = root.join("itens");
            return cb.equal(joinItens.get("Item").get("ID_Item"), item);
        };
    }

    Specification<Doacao> quantidadeMaiorQue(Integer valor) {
        return (root, query, cb) -> {
            Join<Doacao, ItemDoado> joinItens = root.join("itens");
            return cb.greaterThan(joinItens.get("Quantidade"), valor);
        };
    }

    Specification<Doacao> quantidadeMenorQue(Integer valor) {
        return (root, query, cb) -> {
            Join<Doacao, ItemDoado> joinItens = root.join("itens");
            return cb.lessThan(joinItens.get("Quantidade"), valor);
        };
    }

    Specification<Doacao> quantidadeIgualA(Integer valor) {
        return (root, query, cb) -> {
            Join<Doacao, ItemDoado> joinItens = root.join("itens");
            return cb.equal(joinItens.get("Quantidade"), valor);
        };
    }

    Specification<Doacao> isAtivo(boolean ativo) {
        return (root, query, cb) -> cb.equal(root.get("Status"), ativo);
    }
}
