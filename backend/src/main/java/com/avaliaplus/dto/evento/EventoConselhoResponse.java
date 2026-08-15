package com.avaliaplus.dto.evento;

import com.avaliaplus.model.enums.StatusEtapa;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventoConselhoResponse {
    private Long id;
    private LocalDate data;
    private Long turmaId;
    private String turmaNome;
    private Integer metaPreenchimento;
    private StatusEtapa statusPreConselhoTurma;
    private StatusEtapa statusPreConselhoProfessores;
    private StatusEtapa statusFeedbackFinal;
    private Boolean feedbackLiberado;
    private List<String> disciplinas;
    private long totalFormulariosPreenchidos;
    private LocalDateTime dataCriacao;
}
