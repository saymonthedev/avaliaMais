package com.avaliaplus.controller;

import com.avaliaplus.dto.chat.*;
import com.avaliaplus.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "Chat")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/enviar")
    @Operation(summary = "Enviar mensagem via REST")
    public ResponseEntity<MensagemResponse> enviar(@Valid @RequestBody MensagemRequest request,
                                                    @AuthenticationPrincipal UserDetails user) {
        MensagemResponse response = chatService.enviar(request, user.getUsername());
        // Notificar via WebSocket o destinatário
        messagingTemplate.convertAndSendToUser(
                response.getDestinatarioId().toString(),
                "/queue/mensagens",
                response
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/conversa/{outroId}")
    @Operation(summary = "Buscar histórico de conversa")
    public ResponseEntity<List<MensagemResponse>> conversa(@PathVariable Long outroId,
                                                            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(chatService.buscarConversa(outroId, user.getUsername()));
    }

    @PatchMapping("/conversa/{outroId}/lido")
    @Operation(summary = "Marcar conversa como lida")
    public ResponseEntity<Void> marcarLido(@PathVariable Long outroId,
                                            @AuthenticationPrincipal UserDetails user) {
        chatService.marcarComoLido(outroId, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nao-lidas")
    @Operation(summary = "Contar mensagens não lidas")
    public ResponseEntity<Map<String, Long>> naoLidas(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(Map.of("total", chatService.contarNaoLidas(user.getUsername())));
    }

    // WebSocket handler para mensagens em tempo real
    @MessageMapping("/chat.enviar")
    public void enviarWs(@Payload MensagemRequest request,
                         @AuthenticationPrincipal UserDetails user) {
        MensagemResponse response = chatService.enviar(request, user.getUsername());
        messagingTemplate.convertAndSendToUser(
                response.getDestinatarioId().toString(),
                "/queue/mensagens",
                response
        );
    }
}
