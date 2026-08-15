package com.avaliaplus.service;

import com.avaliaplus.dto.evento.*;
import com.avaliaplus.model.EventoConselho;
import com.avaliaplus.model.Turma;
import com.avaliaplus.model.enums.StatusEtapa;
import com.avaliaplus.repository.EventoConselhoRepository;
import com.avaliaplus.repository.FormularioRepository;
import com.avaliaplus.repository.TurmaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventoConselhoService {

    private final EventoConselhoRepository eventoRepository;
    private final TurmaRepository turmaRepository;
    private final FormularioRepository formularioRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public EventoConselhoResponse criar(EventoConselhoRequest request) {
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));

        String disciplinasJson = null;
        if (request.getDisciplinas() != null) {
            try {
                disciplinasJson = objectMapper.writeValueAsString(request.getDisciplinas());
            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException("Erro ao processar disciplinas");
            }
        }

        EventoConselho evento = EventoConselho.builder()
                .data(request.getData())
                .turma(turma)
                .metaPreenchimento(request.getMetaPreenchimento())
                .disciplinas(disciplinasJson)
                .statusPreConselhoTurma(StatusEtapa.PENDENTE)
                .statusPreConselhoProfessores(StatusEtapa.PENDENTE)
                .statusFeedbackFinal(StatusEtapa.PENDENTE)
                .feedbackLiberado(false)
                .build();

        return toResponse(eventoRepository.save(evento));
    }

    public List<EventoConselhoResponse> listar() {
        return eventoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public EventoConselhoResponse buscarPorId(Long id) {
        return toResponse(eventoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado")));
    }

    @Transactional
    public EventoConselhoResponse atualizarStatus(Long id, String etapa, StatusEtapa status) {
        EventoConselho evento = eventoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));

        switch (etapa) {
            case "pre-conselho-turma" -> evento.setStatusPreConselhoTurma(status);
            case "pre-conselho-professores" -> evento.setStatusPreConselhoProfessores(status);
            case "feedback-final" -> evento.setStatusFeedbackFinal(status);
            case "liberar-feedback" -> evento.setFeedbackLiberado(status == StatusEtapa.CONCLUIDO);
            default -> throw new IllegalArgumentException("Etapa inválida: " + etapa);
        }

        return toResponse(eventoRepository.save(evento));
    }

    @SuppressWarnings("unchecked")
    private EventoConselhoResponse toResponse(EventoConselho e) {
        EventoConselhoResponse r = new EventoConselhoResponse();
        r.setId(e.getId());
        r.setData(e.getData());
        r.setTurmaId(e.getTurma().getId());
        r.setTurmaNome(e.getTurma().getNome());
        r.setMetaPreenchimento(e.getMetaPreenchimento());
        r.setStatusPreConselhoTurma(e.getStatusPreConselhoTurma());
        r.setStatusPreConselhoProfessores(e.getStatusPreConselhoProfessores());
        r.setStatusFeedbackFinal(e.getStatusFeedbackFinal());
        r.setFeedbackLiberado(e.getFeedbackLiberado());
        r.setDataCriacao(e.getDataCriacao());

        if (e.getDisciplinas() != null) {
            try {
                r.setDisciplinas(objectMapper.readValue(e.getDisciplinas(), List.class));
            } catch (JsonProcessingException ex) {
                r.setDisciplinas(List.of());
            }
        }

        r.setTotalFormulariosPreenchidos(formularioRepository.findByEventoConselhoId(e.getId()).size());
        return r;
    }
}
