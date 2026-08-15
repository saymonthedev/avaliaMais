package com.avaliaplus.dto.formulario;

import com.avaliaplus.model.enums.TipoFormulario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FormularioResponse {
    private Long id;
    private TipoFormulario tipo;
    private Long usuarioId;
    private String usuarioNome;
    private Long eventoId;
    private String respostasJson;
    private LocalDateTime dataSubmissao;
}
