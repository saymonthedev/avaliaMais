package com.avaliaplus.dto.evento;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EventoConselhoRequest {
    @NotNull
    private LocalDate data;

    @NotNull
    private Long turmaId;

    private Integer metaPreenchimento;

    private List<String> disciplinas;
}
