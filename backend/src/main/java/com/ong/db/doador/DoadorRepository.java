package com.ong.db.doador;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DoadorRepository extends JpaRepository<Doador, Integer>, JpaSpecificationExecutor<Doador> {
    boolean existsByCPF(String CPF);

    boolean existsByCNPJ(String CNPJ);

}
