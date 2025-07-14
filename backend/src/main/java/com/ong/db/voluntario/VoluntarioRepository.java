package com.ong.db.voluntario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.ong.db.stats.VoluntarioFuncDTO;

public interface VoluntarioRepository extends JpaRepository<Voluntario, String>, JpaSpecificationExecutor<Voluntario> {
    @Query("SELECT new com.ong.db.stats.VoluntarioFuncDTO(v.Funcao, COUNT(v.CPF)) FROM Voluntario v GROUP BY v.CPF")
    List<VoluntarioFuncDTO> getVoluntariosPorFuncao();

}
