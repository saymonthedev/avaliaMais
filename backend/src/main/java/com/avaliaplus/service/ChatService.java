package com.avaliaplus.service;

import com.avaliaplus.dto.chat.*;
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
public class ChatService {

    private final MensagemChatRepository mensagemRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public MensagemResponse enviar(MensagemRequest request, String emailRemetente) {
        Usuario remetente = usuarioRepository.findByEmail(emailRemetente)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Usuario destinatario = usuarioRepository.findById(request.getDestinatarioId())
                .orElseThrow(() -> new EntityNotFoundException("Destinatário não encontrado"));

        // Regra: não-pedagógicos só podem enviar mensagens para o pedagógico
        if (!remetente.getPerfil().equals(PerfilUsuario.PEDAGOGICO) &&
            !destinatario.getPerfil().equals(PerfilUsuario.PEDAGOGICO)) {
            throw new AccessDeniedException("Mensagens diretas são permitidas apenas com a equipe pedagógica");
        }

        MensagemChat mensagem = MensagemChat.builder()
                .remetente(remetente)
                .destinatario(destinatario)
                .mensagem(request.getMensagem())
                .lido(false)
                .build();

        return toResponse(mensagemRepository.save(mensagem));
    }

    public List<MensagemResponse> buscarConversa(Long outroId, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return mensagemRepository.findConversa(usuario.getId(), outroId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void marcarComoLido(Long outroId, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        mensagemRepository.findByDestinatarioIdAndLidoFalse(usuario.getId()).stream()
                .filter(m -> m.getRemetente().getId().equals(outroId))
                .forEach(m -> {
                    m.setLido(true);
                    mensagemRepository.save(m);
                });
    }

    public long contarNaoLidas(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return mensagemRepository.countByDestinatarioIdAndLidoFalse(usuario.getId());
    }

    private MensagemResponse toResponse(MensagemChat m) {
        MensagemResponse r = new MensagemResponse();
        r.setId(m.getId());
        r.setRemetenteId(m.getRemetente().getId());
        r.setRemetenteNome(m.getRemetente().getNome());
        r.setDestinatarioId(m.getDestinatario().getId());
        r.setDestinatarioNome(m.getDestinatario().getNome());
        r.setMensagem(m.getMensagem());
        r.setLido(m.getLido());
        r.setDataEnvio(m.getDataEnvio());
        return r;
    }
}
