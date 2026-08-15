package com.avaliaplus.dto.feedback;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedbackResponse {
    private Long id;
    private Long eventoId;
    private Long alunoId;
    private String alunoNome;
    private String feedbackFinal;
    private String pontosFortes;
    private String oportunidadesMelhoria;
    private LocalDateTime data;
}
