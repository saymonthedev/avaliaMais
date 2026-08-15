package com.avaliaplus.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private EventoConselho eventoConselho;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Usuario aluno;

    @Column(name = "feedback_final", columnDefinition = "TEXT")
    private String feedbackFinal;

    @Column(name = "pontos_fortes", columnDefinition = "TEXT")
    private String pontosFortes;

    @Column(name = "oportunidades_melhoria", columnDefinition = "TEXT")
    private String oportunidadesMelhoria;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime data;
}
