package com.avaliaplus.dto.chat;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MensagemResponse {
    private Long id;
    private Long remetenteId;
    private String remetenteNome;
    private Long destinatarioId;
    private String destinatarioNome;
    private String mensagem;
    private Boolean lido;
    private LocalDateTime dataEnvio;
}
