package com.ong.db.doador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class DoadorService {
    @Autowired
    private DoadorRepository repository;

    public List<DoadorResponseDTO> getAll(String cpf, String cnpj, String nome, String tipo) {
        Specification<Doador> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        if (cpf != null && !cpf.isEmpty()) {
            spec = spec.and(temCpf(cpf));
        }
        if (cnpj != null && !cnpj.isEmpty()) {
            spec = spec.and(temCnpj(cnpj));
        }
        if (nome != null && !nome.isEmpty()) {
            spec = spec.and(temNome(nome));
        }
        if (tipo != null && !tipo.isEmpty()) {
            spec = spec.and(temTipo(tipo));
        }
        spec = spec.and(isAtivo(true));
        List<DoadorResponseDTO> doadores = repository.findAll(spec).stream().map(DoadorResponseDTO::new).toList();
        return doadores;
    }

    public DoadorResponseDTO insert(DoadorRequestDTO dados) {
        if (dados.Tipo_Doador() == null || (!"Fisica".equalsIgnoreCase(dados.Tipo_Doador())
                && !"Juridica".equalsIgnoreCase(dados.Tipo_Doador()))) {
            throw new IllegalArgumentException("Tipo de doador inválido. Deve ser 'Fisica' ou 'Juridica'.");
        }
        Doador novoDoador = new Doador();
        novoDoador.setNome_Doador(dados.Nome_Doador());
        novoDoador.setTipo_Doador(dados.Tipo_Doador());
        if ("Fisica".equalsIgnoreCase(dados.Tipo_Doador())) {
            if (dados.CPF() == null || dados.CPF().trim().isEmpty() || dados.CPF().length() > 11) {
                throw new IllegalArgumentException("CPF inválido para doador Pessoa Fisica.");
            }
            if (repository.existsByCPF(dados.CPF())) {
                throw new IllegalArgumentException("Um doador com este CPF já existe.");
            }
            novoDoador.setCPF(dados.CPF());
            novoDoador.setCNPJ(null);
        } else {
            if (dados.CNPJ() == null || dados.CNPJ().trim().isEmpty() || dados.CNPJ().length() > 14) {
                throw new IllegalArgumentException("CNPJ inválido para doador Pessoa Juridica.");
            }
            if (repository.existsByCNPJ(dados.CNPJ())) {
                throw new IllegalStateException("Um doador com este CNPJ já existe.");
            }
            novoDoador.setCPF(null);
            novoDoador.setCNPJ(dados.CNPJ());
        }
        novoDoador.setAtivo(true);
        Doador doadorSalvo = repository.save(novoDoador);
        return new DoadorResponseDTO(doadorSalvo);
    }

    public DoadorResponseDTO update(Integer ID, DoadorRequestDTO dados) {
        Doador doador = repository.findById(ID).orElseThrow(() -> new RuntimeException("Doador não encontrado!"));
        doador.setCPF(dados.CPF());
        doador.setCNPJ(dados.CNPJ());
        doador.setNome_Doador(dados.Nome_Doador());
        doador.setTipo_Doador(dados.Tipo_Doador());
        Doador novoDoador = repository.save(doador);
        return new DoadorResponseDTO(novoDoador);
    }

    public void delete(Integer ID) {
        if (!repository.existsById(ID)) {
            throw new RuntimeException("Doador não encontrado, impossível deletar!");
        }
        Doador doador = repository.findById(ID).get();
        doador.setAtivo(false);
        repository.save(doador);
    }

    private static Specification<Doador> temCpf(String cpf) {
        return (root, query, cb) -> cb.equal(root.get("CPF"), cpf);
    }

    private static Specification<Doador> isAtivo(boolean ativo) {
        return (root, query, cb) -> cb.equal(root.get("Ativo"), ativo);
    }

    private static Specification<Doador> temCnpj(String cnpj) {
        return (root, query, cb) -> cb.equal(root.get("CNPJ"), cnpj);
    }

    private static Specification<Doador> temNome(String nome) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Nome_Doador")), "%" + nome.toLowerCase() + "%");
    }

    private static Specification<Doador> temTipo(String tipo) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Tipo_Doador")), "%" + tipo.toLowerCase() + "%");
    }

}
