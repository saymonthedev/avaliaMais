package com.avaliaplus.controller;

import com.avaliaplus.dto.formulario.*;
import com.avaliaplus.service.FormularioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formularios")
@RequiredArgsConstructor
@Tag(name = "Formulários")
@SecurityRequirement(name = "bearerAuth")
public class FormularioController {

    private final FormularioService formularioService;

    @PostMapping
    @Operation(summary = "Submeter formulário (pré-conselho ou feedback final)")
    public ResponseEntity<FormularioResponse> submeter(@Valid @RequestBody FormularioRequest request,
                                                        @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(formularioService.submeter(request, user.getUsername()));
    }

    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Listar formulários de um evento")
    public ResponseEntity<List<FormularioResponse>> listarPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(formularioService.listarPorEvento(eventoId));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar formulários de um usuário")
    public ResponseEntity<List<FormularioResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(formularioService.listarPorUsuario(usuarioId));
    }
}
