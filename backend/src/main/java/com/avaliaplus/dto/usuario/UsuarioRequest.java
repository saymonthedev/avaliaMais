package com.avaliaplus.dto.usuario;

import com.avaliaplus.model.enums.PerfilUsuario;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UsuarioRequest {
    @NotBlank
    private String nome;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String senha;

    @NotNull
    private PerfilUsuario perfil;

    private Long turmaId;
    private Boolean isRepresentante = false;
}
