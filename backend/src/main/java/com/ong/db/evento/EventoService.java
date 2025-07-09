package com.ong.db.evento;

import java.util.List;
import java.sql.Date;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.rsocket.RSocketProperties.Server.Spec;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ong.db.instituicao.Instituicao;
import com.ong.db.instituicao.InstituicaoRepository;

@Service
public class EventoService {
    @Autowired
    private EventoRepository repository;
    @Autowired
    private InstituicaoRepository instituicaoRepository;

    public List<EventoResponseDTO> getAll(String local, LocalDate data, String cnpj) {
        Specification<Evento> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        if (local != null && !local.isEmpty()) {
            spec = spec.and(temLocal(local));
        }
        if (data != null) {
            spec = spec.and(temData(data));
        }
        if (cnpj != null && !cnpj.isEmpty()) {
            spec = spec.and(temOrganizador(cnpj));
        }
        spec = spec.and(isAtivo(true));
        List<EventoResponseDTO> eventos = repository.findAll(spec).stream().map(EventoResponseDTO::new).toList();
        return eventos;
    }

    public EventoResponseDTO insert(EventoRequestDTO dados) {
        Instituicao instituicao = instituicaoRepository.findById(dados.Organizador())
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));
        Evento novoEvento = new Evento();
        novoEvento.setLocal(dados.Local());
        novoEvento.setData(dados.Data());
        novoEvento.setInstituicao(instituicao);
        novoEvento.setStatus(true);
        Evento eventoSalvo = repository.save(novoEvento);
        return new EventoResponseDTO(eventoSalvo);
    }

    public EventoResponseDTO update(Integer ID, EventoRequestDTO dados) {
        Instituicao instituicao = instituicaoRepository.findById(dados.Organizador())
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));
        Evento evento = repository.findById(ID).orElseThrow(() -> new RuntimeException("Evento não encontrado!"));
        evento.setLocal(dados.Local());
        evento.setData(dados.Data());
        evento.setInstituicao(instituicao);
        Evento eventoAtualizado = repository.save(evento);
        return new EventoResponseDTO(eventoAtualizado);
    }

    public void delete(Integer ID) {
        if (!repository.existsById(ID)) {
            throw new RuntimeException("Evento não encontrado!");
        }
        Evento evento = repository.findById(ID).get();
        evento.setStatus(false);
        repository.save(evento);
    }

    private static Specification<Evento> temLocal(String local) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("Local")), "%" + local.toLowerCase() + "%");
    }

    private static Specification<Evento> temData(LocalDate data) {
        return (root, query, cb) -> cb.equal(root.get("Data"), data);
    }

    private static Specification<Evento> temOrganizador(String cnpj) {
        return (root, query, cb) -> cb.equal(root.get("Instituicao"), cnpj);
    }

    private static Specification<Evento> isAtivo(boolean ativo) {
        return (root, query, cb) -> cb.equal(root.get("Status"), ativo);
    }

}
