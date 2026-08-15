package com.avaliaplus.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MensagemRequest {
    @NotNull
    private Long destinatarioId;

    @NotBlank
    private String mensagem;
}
