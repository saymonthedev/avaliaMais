package com.avaliaplus.dto.usuario;

import com.avaliaplus.model.enums.PerfilUsuario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private PerfilUsuario perfil;
    private Long turmaId;
    private String turmaNome;
    private Boolean isRepresentante;
    private Boolean ativo;
    private LocalDateTime dataCriacao;
}
