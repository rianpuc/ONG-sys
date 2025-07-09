package com.ong.db.voluntario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VoluntarioRepository extends JpaRepository<Voluntario, String>, JpaSpecificationExecutor<Voluntario> {

}
