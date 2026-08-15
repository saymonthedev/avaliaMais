package com.avaliaplus.service;

import com.avaliaplus.dto.formulario.*;
import com.avaliaplus.model.*;
import com.avaliaplus.model.enums.PerfilUsuario;
import com.avaliaplus.model.enums.StatusEtapa;
import com.avaliaplus.model.enums.TipoFormulario;
import com.avaliaplus.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormularioService {

    private final FormularioRepository formularioRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoConselhoRepository eventoRepository;

    @Transactional
    public FormularioResponse submeter(FormularioRequest request, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        EventoConselho evento = eventoRepository.findById(request.getEventoId())
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));

        validarPermissao(usuario, evento, request.getTipo());

        if (formularioRepository.findByUsuarioIdAndEventoConselhoIdAndTipo(
                usuario.getId(), evento.getId(), request.getTipo()).isPresent()) {
            throw new IllegalStateException("Formulário já enviado para este evento");
        }

        Formulario formulario = Formulario.builder()
                .tipo(request.getTipo())
                .usuario(usuario)
                .eventoConselho(evento)
                .respostasJson(request.getRespostasJson())
                .build();

        return toResponse(formularioRepository.save(formulario));
    }

    public List<FormularioResponse> listarPorEvento(Long eventoId) {
        return formularioRepository.findByEventoConselhoId(eventoId)
                .stream().map(this::toResponse).toList();
    }

    public List<FormularioResponse> listarPorUsuario(Long usuarioId) {
        return formularioRepository.findByUsuarioId(usuarioId)
                .stream().map(this::toResponse).toList();
    }

    private void validarPermissao(Usuario usuario, EventoConselho evento, TipoFormulario tipo) {
        switch (tipo) {
            case PRE_CONSELHO_TURMA -> {
                if (!usuario.getPerfil().equals(PerfilUsuario.REPRESENTANTE)) {
                    throw new AccessDeniedException("Apenas representantes podem preencher o pré-conselho da turma");
                }
                if (!evento.getStatusPreConselhoTurma().equals(StatusEtapa.EM_ANDAMENTO)) {
                    throw new IllegalStateException("Pré-conselho da turma não está aberto");
                }
                if (!usuario.getTurma().getId().equals(evento.getTurma().getId())) {
                    throw new AccessDeniedException("Representante não pertence à turma do evento");
                }
            }
            case PRE_CONSELHO_PROFESSOR -> {
                if (!usuario.getPerfil().equals(PerfilUsuario.PROFESSOR)) {
                    throw new AccessDeniedException("Apenas professores podem preencher o pré-conselho");
                }
                if (!evento.getStatusPreConselhoProfessores().equals(StatusEtapa.EM_ANDAMENTO)) {
                    throw new IllegalStateException("Pré-conselho de professores não está aberto");
                }
            }
            case FEEDBACK_FINAL -> {
                if (!usuario.getPerfil().equals(PerfilUsuario.PEDAGOGICO)) {
                    throw new AccessDeniedException("Apenas o pedagógico pode preencher o feedback final");
                }
                if (!evento.getStatusFeedbackFinal().equals(StatusEtapa.EM_ANDAMENTO)) {
                    throw new IllegalStateException("Feedback final não está aberto");
                }
            }
        }
    }

    private FormularioResponse toResponse(Formulario f) {
        FormularioResponse r = new FormularioResponse();
        r.setId(f.getId());
        r.setTipo(f.getTipo());
        r.setUsuarioId(f.getUsuario().getId());
        r.setUsuarioNome(f.getUsuario().getNome());
        r.setEventoId(f.getEventoConselho().getId());
        r.setRespostasJson(f.getRespostasJson());
        r.setDataSubmissao(f.getDataSubmissao());
        return r;
    }
}
