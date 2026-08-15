package com.avaliaplus.model;

import com.avaliaplus.model.enums.TipoFormulario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "formulario")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Formulario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoFormulario tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private EventoConselho eventoConselho;

    // Respostas armazenadas como JSON
    @Column(name = "respostas_json", columnDefinition = "JSON", nullable = false)
    private String respostasJson;

    @CreationTimestamp
    @Column(name = "data_submissao", updatable = false)
    private LocalDateTime dataSubmissao;
}
