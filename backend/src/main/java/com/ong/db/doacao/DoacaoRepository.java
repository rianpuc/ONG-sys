package com.ong.db.doacao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DoacaoRepository extends JpaRepository<Doacao, Integer>, JpaSpecificationExecutor<Doacao> {

}
