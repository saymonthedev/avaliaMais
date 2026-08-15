package com.avaliaplus.repository;

import com.avaliaplus.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByAlunoId(Long alunoId);
    List<Feedback> findByEventoConselhoId(Long eventoId);
    Optional<Feedback> findByAlunoIdAndEventoConselhoId(Long alunoId, Long eventoId);
}
