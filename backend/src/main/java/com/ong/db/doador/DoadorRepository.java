package com.ong.db.doador;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ong.db.stats.DoadorTipoCount;

public interface DoadorRepository extends JpaRepository<Doador, Integer>, JpaSpecificationExecutor<Doador> {
    boolean existsByCPF(String CPF);

    boolean existsByCNPJ(String CNPJ);

    @Query("SELECT COUNT(d) FROM Doador d WHERE d.Criado >= :inicio AND d.Criado <= :fim")
    long countDoadoresEntreDatas(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT new com.ong.db.stats.DoadorTipoCount(d.Tipo_Doador, COUNT(d)) " +
            "FROM Doador d WHERE d.Ativo = true GROUP BY d.Tipo_Doador")
    List<DoadorTipoCount> countTipoDoadores();

    @Query("SELECT COUNT(d) FROM Doador d WHERE d.Ativo = true")
    long countAllAtivos();

}
