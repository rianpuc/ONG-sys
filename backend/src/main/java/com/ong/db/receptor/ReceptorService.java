package com.ong.db.receptor;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ReceptorService {
    @Autowired
    private ReceptorRepository repository;

    public List<ReceptorResponseDTO> getAll(String CPF, String Nome, String Endereco) {
        Specification<Receptor> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        if (CPF != null && !CPF.isEmpty()) {
            spec = spec.and(temCpf(CPF));
        }
        if (Nome != null && !Nome.isEmpty()) {
            spec = spec.and(temNome(Nome));
        }
        if (Endereco != null && !Endereco.isEmpty()) {
            spec = spec.and(temEndereco(Endereco));
        }
        spec = spec.and(isAtivo(true));
        List<ReceptorResponseDTO> receptores = repository.findAll(spec).stream().map(ReceptorResponseDTO::new).toList();
        return receptores;
    }

    public ReceptorResponseDTO insert(ReceptorRequestDTO dados) {
        Receptor novoReceptor = new Receptor();
        novoReceptor.setCPF(dados.CPF());
        novoReceptor.setNome(dados.Nome());
        novoReceptor.setEndereco(dados.Endereco());
        novoReceptor.setStatus(true);
        novoReceptor.setCriado(LocalDate.now());
        Receptor receptorSalvo = repository.save(novoReceptor);
        return new ReceptorResponseDTO(receptorSalvo);
    }

    public ReceptorResponseDTO update(String CPF, ReceptorRequestDTO dados) {
        Receptor receptor = repository.findById(CPF)
                .orElseThrow(() -> new RuntimeException("Receptor não encontrado!"));
        receptor.setCPF(dados.CPF());
        receptor.setEndereco(dados.Endereco());
        receptor.setNome(dados.Nome());
        receptor.setStatus(true);
        Receptor novoReceptor = repository.save(receptor);
        return new ReceptorResponseDTO(novoReceptor);
    }

    public void delete(String CPF) {
        if (!repository.existsById(CPF)) {
            throw new RuntimeException("Receptor não encontrado, impossível deletar!");
        }
        Receptor receptor = repository.findById(CPF).get();
        receptor.setStatus(false);
        repository.save(receptor);
    }

    private Specification<Receptor> isAtivo(boolean b) {
        return (root, query, cb) -> cb.equal(root.get("Status"), b);
    }

    private static Specification<Receptor> temCpf(String cpf) {
        return (root, query, cb) -> cb.equal(root.get("CPF"), cpf);
    }

    private static Specification<Receptor> temNome(String nome) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Nome")), "%" + nome.toLowerCase() + "%");
    }

    private static Specification<Receptor> temEndereco(String endereco) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Endereco")), "%" + endereco.toLowerCase() + "%");
    }
}
