package com.avaliaplus.controller;

import com.avaliaplus.dto.evento.*;
import com.avaliaplus.model.enums.StatusEtapa;
import com.avaliaplus.service.EventoConselhoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
@Tag(name = "Eventos de Conselho")
@SecurityRequirement(name = "bearerAuth")
public class EventoConselhoController {

    private final EventoConselhoService eventoService;

    @PostMapping
    @PreAuthorize("hasRole('PEDAGOGICO')")
    @Operation(summary = "Criar evento de conselho")
    public ResponseEntity<EventoConselhoResponse> criar(@Valid @RequestBody EventoConselhoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventoService.criar(request));
    }

    @GetMapping
    @Operation(summary = "Listar eventos")
    public ResponseEntity<List<EventoConselhoResponse>> listar() {
        return ResponseEntity.ok(eventoService.listar());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar evento por ID")
    public ResponseEntity<EventoConselhoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.buscarPorId(id));
    }

    @PatchMapping("/{id}/etapa/{etapa}")
    @PreAuthorize("hasRole('PEDAGOGICO')")
    @Operation(summary = "Atualizar status de etapa do evento")
    public ResponseEntity<EventoConselhoResponse> atualizarStatus(@PathVariable Long id,
                                                                   @PathVariable String etapa,
                                                                   @RequestParam StatusEtapa status) {
        return ResponseEntity.ok(eventoService.atualizarStatus(id, etapa, status));
    }
}
