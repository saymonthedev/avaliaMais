package com.avaliaplus.dto.feedback;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotNull
    private Long alunoId;

    @NotNull
    private Long eventoId;

    @NotBlank
    private String feedbackFinal;

    private String pontosFortes;
    private String oportunidadesMelhoria;
}
