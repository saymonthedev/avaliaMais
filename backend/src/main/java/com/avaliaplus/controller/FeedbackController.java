package com.avaliaplus.controller;

import com.avaliaplus.dto.feedback.*;
import com.avaliaplus.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
@Tag(name = "Feedbacks")
@SecurityRequirement(name = "bearerAuth")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('PEDAGOGICO')")
    @Operation(summary = "Consolidar feedback final do aluno")
    public ResponseEntity<FeedbackResponse> consolidar(@Valid @RequestBody FeedbackRequest request,
                                                        @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(feedbackService.consolidar(request, user.getUsername()));
    }

    @GetMapping("/aluno/{alunoId}")
    @Operation(summary = "Buscar feedbacks de um aluno")
    public ResponseEntity<List<FeedbackResponse>> listarPorAluno(@PathVariable Long alunoId,
                                                                   @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(feedbackService.listarPorAluno(alunoId, user.getUsername()));
    }

    @GetMapping("/evento/{eventoId}")
    @PreAuthorize("hasAnyRole('PEDAGOGICO', 'SUPERVISAO')")
    @Operation(summary = "Buscar feedbacks de um evento")
    public ResponseEntity<List<FeedbackResponse>> listarPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(feedbackService.listarPorEvento(eventoId));
    }
}
