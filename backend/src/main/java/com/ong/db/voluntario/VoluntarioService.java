package com.ong.db.voluntario;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.ong.db.instituicao.Instituicao;
import com.ong.db.instituicao.InstituicaoRepository;

@Service
public class VoluntarioService {
    @Autowired
    private VoluntarioRepository repository;
    @Autowired
    private InstituicaoRepository instituicaoRepository;

    public List<VoluntarioResponseDTO> getAll(String nome, String cpf, String funcao, String instituicaoID) {
        Specification<Voluntario> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        if (nome != null && !nome.isEmpty()) {
            spec = spec.and(temNome(nome));
        }
        if (cpf != null && !cpf.isEmpty()) {
            spec = spec.and(temCpf(cpf));
        }
        if (funcao != null && !funcao.isEmpty()) {
            spec = spec.and(temFuncao(funcao));
        }
        if (instituicaoID != null) {
            spec = spec.and(temInstituicao(instituicaoID));
        }
        List<VoluntarioResponseDTO> voluntarios = repository.findAll(spec).stream().map(VoluntarioResponseDTO::new)
                .toList();
        return voluntarios;
    }

    public VoluntarioResponseDTO insert(VoluntarioRequestDTO dados) {
        Instituicao instituicao = instituicaoRepository.findById(dados.instituicaoId())
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));
        Voluntario novoVoluntario = new Voluntario();
        novoVoluntario.setNome(dados.Nome());
        novoVoluntario.setCPF(dados.CPF());
        novoVoluntario.setFuncao(dados.Funcao());
        novoVoluntario.setInstituicao(instituicao);
        Voluntario voluntarioSalvo = repository.save(novoVoluntario);
        return new VoluntarioResponseDTO(voluntarioSalvo);
    }

    public VoluntarioResponseDTO update(String CPF, VoluntarioRequestDTO dados) {
        Voluntario voluntario = repository.findById(CPF)
                .orElseThrow(() -> new RuntimeException("Voluntário não encontrado!"));
        Instituicao instituicao = instituicaoRepository.findById(dados.instituicaoId())
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));
        voluntario.setNome(dados.Nome());
        voluntario.setFuncao(dados.Funcao());
        voluntario.setInstituicao(instituicao);
        Voluntario novoVoluntario = repository.save(voluntario);
        return new VoluntarioResponseDTO(novoVoluntario);
    }

    public void delete(String CPF) {
        if (!repository.existsById(CPF)) {
            throw new RuntimeException("Voluntário não encontrado, impossível deletar!");
        }
        repository.deleteById(CPF);
    }

    private static Specification<Voluntario> temNome(String nome) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Nome")), "%" + nome.toLowerCase() + "%");
    }

    private static Specification<Voluntario> temCpf(String cpf) {
        return (root, query, cb) -> cb.equal(root.get("CPF"), cpf);
    }

    private static Specification<Voluntario> temFuncao(String funcao) {
        return (root, query, cb) -> cb.equal(root.get("Funcao"), funcao);
    }

    private static Specification<Voluntario> temInstituicao(String instituicaoID) {
        return (root, query, cb) -> cb.equal(root.get("Instituicao").get("CNPJ"), instituicaoID);
    }

}
