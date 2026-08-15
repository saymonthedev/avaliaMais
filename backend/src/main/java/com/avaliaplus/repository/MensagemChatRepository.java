package com.avaliaplus.repository;

import com.avaliaplus.model.MensagemChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemChatRepository extends JpaRepository<MensagemChat, Long> {

    @Query("SELECT m FROM MensagemChat m WHERE " +
           "(m.remetente.id = :userId AND m.destinatario.id = :outroId) OR " +
           "(m.remetente.id = :outroId AND m.destinatario.id = :userId) " +
           "ORDER BY m.dataEnvio ASC")
    List<MensagemChat> findConversa(Long userId, Long outroId);

    List<MensagemChat> findByDestinatarioIdAndLidoFalse(Long destinatarioId);

    long countByDestinatarioIdAndLidoFalse(Long destinatarioId);
}
