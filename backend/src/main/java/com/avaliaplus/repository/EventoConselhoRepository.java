package com.avaliaplus.repository;

import com.avaliaplus.model.EventoConselho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoConselhoRepository extends JpaRepository<EventoConselho, Long> {
    List<EventoConselho> findByTurmaId(Long turmaId);
    List<EventoConselho> findByTurmaIdOrderByDataDesc(Long turmaId);
}
