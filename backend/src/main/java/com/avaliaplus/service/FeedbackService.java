package com.avaliaplus.service;

import com.avaliaplus.dto.feedback.*;
import com.avaliaplus.model.*;
import com.avaliaplus.model.enums.PerfilUsuario;
import com.avaliaplus.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoConselhoRepository eventoRepository;

    @Transactional
    public FeedbackResponse consolidar(FeedbackRequest request, String emailPedagogico) {
        Usuario pedagógico = usuarioRepository.findByEmail(emailPedagogico)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        if (!pedagógico.getPerfil().equals(PerfilUsuario.PEDAGOGICO)) {
            throw new AccessDeniedException("Apenas o pedagógico pode consolidar feedbacks");
        }

        Usuario aluno = usuarioRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));

        EventoConselho evento = eventoRepository.findById(request.getEventoId())
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));

        Feedback feedback = feedbackRepository
                .findByAlunoIdAndEventoConselhoId(aluno.getId(), evento.getId())
                .orElse(Feedback.builder().aluno(aluno).eventoConselho(evento).build());

        feedback.setFeedbackFinal(request.getFeedbackFinal());
        feedback.setPontosFortes(request.getPontosFortes());
        feedback.setOportunidadesMelhoria(request.getOportunidadesMelhoria());

        return toResponse(feedbackRepository.save(feedback));
    }

    public List<FeedbackResponse> listarPorAluno(Long alunoId, String emailSolicitante) {
        Usuario solicitante = usuarioRepository.findByEmail(emailSolicitante)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // Alunos só veem feedbacks de eventos com liberação ativa
        if (solicitante.getPerfil().equals(PerfilUsuario.ALUNO) || 
            solicitante.getPerfil().equals(PerfilUsuario.REPRESENTANTE)) {
            return feedbackRepository.findByAlunoId(alunoId).stream()
                    .filter(f -> f.getEventoConselho().getFeedbackLiberado())
                    .map(this::toResponse).toList();
        }

        return feedbackRepository.findByAlunoId(alunoId).stream().map(this::toResponse).toList();
    }

    public List<FeedbackResponse> listarPorEvento(Long eventoId) {
        return feedbackRepository.findByEventoConselhoId(eventoId)
                .stream().map(this::toResponse).toList();
    }

    private FeedbackResponse toResponse(Feedback f) {
        FeedbackResponse r = new FeedbackResponse();
        r.setId(f.getId());
        r.setEventoId(f.getEventoConselho().getId());
        r.setAlunoId(f.getAluno().getId());
        r.setAlunoNome(f.getAluno().getNome());
        r.setFeedbackFinal(f.getFeedbackFinal());
        r.setPontosFortes(f.getPontosFortes());
        r.setOportunidadesMelhoria(f.getOportunidadesMelhoria());
        r.setData(f.getData());
        return r;
    }
}
