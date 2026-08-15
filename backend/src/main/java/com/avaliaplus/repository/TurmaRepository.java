package com.avaliaplus.repository;

import com.avaliaplus.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByAno(Integer ano);
    List<Turma> findByCursoContainingIgnoreCase(String curso);
}
