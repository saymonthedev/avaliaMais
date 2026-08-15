package com.avaliaplus.dto.auth;

import com.avaliaplus.model.enums.PerfilUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String nome;
    private String email;
    private PerfilUsuario perfil;
    private Long turmaId;
    private Boolean isRepresentante;
}
