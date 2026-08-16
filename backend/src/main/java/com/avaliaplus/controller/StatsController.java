package com.avaliaplus.controller;

import com.avaliaplus.model.enums.PerfilUsuario;
import com.avaliaplus.repository.EventoConselhoRepository;
import com.avaliaplus.repository.FormularioRepository;
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
    private final EventoConselhoRepository eventoConselhoRepository;
    private final FormularioRepository formularioRepository;

    @GetMapping
    public StatsResponse getStats() {
        return new StatsResponse(
            usuarioRepository.count(),
            usuarioRepository.countByPerfil(PerfilUsuario.ALUNO),
            eventoConselhoRepository.count(),
            formularioRepository.count()
        );
    }

    public record StatsResponse(
        long totalUsuarios,
        long totalAlunos,
        long totalEventos,
        long totalFormularios
    ) {}
}
