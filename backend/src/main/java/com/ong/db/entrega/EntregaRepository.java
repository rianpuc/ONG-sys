package com.ong.db.entrega;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EntregaRepository extends JpaRepository<Entrega, Integer>, JpaSpecificationExecutor<Entrega> {

}
