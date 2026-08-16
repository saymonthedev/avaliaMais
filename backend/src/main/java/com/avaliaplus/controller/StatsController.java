package com.avaliaplus.controller;

import com.avaliaplus.repository.EventoConselhoRepository;
import com.avaliaplus.repository.FormularioRepository;
import com.avaliaplus.repository.TurmaRepository;
import com.avaliaplus.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final UsuarioRepository usuarioRepository;
    private final TurmaRepository turmaRepository;
    private final EventoConselhoRepository eventoConselhoRepository;
    private final FormularioRepository formularioRepository;

    @GetMapping
    public StatsResponse getStats() {
        return new StatsResponse(
            usuarioRepository.count(),
            turmaRepository.count(),
            eventoConselhoRepository.count(),
            formularioRepository.count()
        );
    }

    public record StatsResponse(
        long totalUsuarios,
        long totalTurmas,
        long totalEventos,
        long totalFormularios
    ) {}
}
