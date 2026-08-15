package com.avaliaplus.dto.formulario;

import com.avaliaplus.model.enums.TipoFormulario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FormularioRequest {
    @NotNull
    private TipoFormulario tipo;

    @NotNull
    private Long eventoId;

    @NotBlank
    private String respostasJson;
}
