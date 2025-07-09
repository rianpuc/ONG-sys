package com.ong.db.receptor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ReceptorRepository extends JpaRepository<Receptor, String>, JpaSpecificationExecutor<Receptor> {

}
