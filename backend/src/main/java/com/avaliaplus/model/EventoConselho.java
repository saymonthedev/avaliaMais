package com.avaliaplus.model;

import com.avaliaplus.model.enums.StatusEtapa;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evento_conselho")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventoConselho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @Column(name = "meta_preenchimento")
    private Integer metaPreenchimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pre_conselho_turma")
    private StatusEtapa statusPreConselhoTurma = StatusEtapa.PENDENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pre_conselho_professores")
    private StatusEtapa statusPreConselhoProfessores = StatusEtapa.PENDENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_feedback_final")
    private StatusEtapa statusFeedbackFinal = StatusEtapa.PENDENTE;

    @Column(name = "feedback_liberado")
    private Boolean feedbackLiberado = false;

    // Disciplinas vinculadas ao evento (JSON)
    @Column(columnDefinition = "JSON")
    private String disciplinas;

    @OneToMany(mappedBy = "eventoConselho", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Formulario> formularios;

    @CreationTimestamp
    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
}
