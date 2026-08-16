package com.avaliaplus.config;

import com.avaliaplus.model.*;
import com.avaliaplus.model.enums.PerfilUsuario;
import com.avaliaplus.model.enums.StatusEtapa;
import com.avaliaplus.model.enums.TipoFormulario;
import com.avaliaplus.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final TurmaRepository turmaRepository;
    private final EventoConselhoRepository eventoConselhoRepository;
    private final FormularioRepository formularioRepository;
    private final FeedbackRepository feedbackRepository;
    private final MensagemChatRepository mensagemChatRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            log.info("Banco de dados já populado, pulando seed.");
            return;
        }

        log.info("Populando banco de dados com dados de teste...");
        String senha = passwordEncoder.encode("senha123");

        // ── Turmas ──────────────────────────────────────────────────────────
        Turma turmaADS = turmaRepository.save(Turma.builder()
                .nome("3º Ano A").curso("Análise e Desenvolvimento de Sistemas").ano(2024).build());
        Turma turmaRedes = turmaRepository.save(Turma.builder()
                .nome("2º Ano B").curso("Técnico em Redes").ano(2024).build());
        Turma turmaInfo = turmaRepository.save(Turma.builder()
                .nome("1º Ano C").curso("Técnico em Informática").ano(2025).build());

        // ── Usuários – Administração / Gestão ────────────────────────────────
        Usuario admin = usuarioRepository.save(Usuario.builder()
                .nome("Administrador").email("admin@avalia.com")
                .senha(passwordEncoder.encode("admin123")).perfil(PerfilUsuario.ADMINISTRADOR).ativo(true).build());

        Usuario pedagogico = usuarioRepository.save(Usuario.builder()
                .nome("Carla Pedagógico").email("pedagogico@avalia.com")
                .senha(senha).perfil(PerfilUsuario.PEDAGOGICO).ativo(true).build());

        Usuario coordenacao = usuarioRepository.save(Usuario.builder()
                .nome("Roberto Coordenação").email("coordenacao@avalia.com")
                .senha(senha).perfil(PerfilUsuario.PEDAGOGICO).ativo(true).build());

        Usuario supervisao = usuarioRepository.save(Usuario.builder()
                .nome("Fernanda Supervisão").email("supervisao@avalia.com")
                .senha(senha).perfil(PerfilUsuario.SUPERVISAO).ativo(true).build());

        // ── Professores ──────────────────────────────────────────────────────
        Usuario profCarlos = usuarioRepository.save(Usuario.builder()
                .nome("Carlos Silva").email("prof.carlos@avalia.com")
                .senha(senha).perfil(PerfilUsuario.PROFESSOR).ativo(true).build());

        Usuario profAna = usuarioRepository.save(Usuario.builder()
                .nome("Ana Lima").email("prof.ana@avalia.com")
                .senha(senha).perfil(PerfilUsuario.PROFESSOR).ativo(true).build());

        Usuario profMarcos = usuarioRepository.save(Usuario.builder()
                .nome("Marcos Oliveira").email("prof.marcos@avalia.com")
                .senha(senha).perfil(PerfilUsuario.PROFESSOR).ativo(true).build());

        // ── Representantes ───────────────────────────────────────────────────
        Usuario repADS = usuarioRepository.save(Usuario.builder()
                .nome("João Representante (ADS)").email("rep.ads@avalia.com")
                .senha(senha).perfil(PerfilUsuario.REPRESENTANTE)
                .turma(turmaADS).isRepresentante(true).ativo(true).build());

        Usuario repRedes = usuarioRepository.save(Usuario.builder()
                .nome("Maria Representante (Redes)").email("rep.redes@avalia.com")
                .senha(senha).perfil(PerfilUsuario.REPRESENTANTE)
                .turma(turmaRedes).isRepresentante(true).ativo(true).build());

        // ── Alunos – Turma ADS ───────────────────────────────────────────────
        Usuario aluno1 = usuarioRepository.save(Usuario.builder()
                .nome("Lucas Andrade").email("lucas@avalia.com")
                .senha(senha).perfil(PerfilUsuario.ALUNO).turma(turmaADS).ativo(true).build());

        Usuario aluno2 = usuarioRepository.save(Usuario.builder()
                .nome("Beatriz Costa").email("beatriz@avalia.com")
                .senha(senha).perfil(PerfilUsuario.ALUNO).turma(turmaADS).ativo(true).build());

        Usuario aluno3 = usuarioRepository.save(Usuario.builder()
                .nome("Felipe Souza").email("felipe@avalia.com")
                .senha(senha).perfil(PerfilUsuario.ALUNO).turma(turmaADS).ativo(true).build());

        // ── Alunos – Turma Redes ─────────────────────────────────────────────
        Usuario aluno4 = usuarioRepository.save(Usuario.builder()
                .nome("Gabriela Martins").email("gabriela@avalia.com")
                .senha(senha).perfil(PerfilUsuario.ALUNO).turma(turmaRedes).ativo(true).build());

        Usuario aluno5 = usuarioRepository.save(Usuario.builder()
                .nome("Rafael Pereira").email("rafael@avalia.com")
                .senha(senha).perfil(PerfilUsuario.ALUNO).turma(turmaRedes).ativo(true).build());

        // ── Alunos – Turma Info ──────────────────────────────────────────────
        usuarioRepository.save(Usuario.builder()
                .nome("Isabela Ferreira").email("isabela@avalia.com")
                .senha(senha).perfil(PerfilUsuario.ALUNO).turma(turmaInfo).ativo(true).build());

        usuarioRepository.save(Usuario.builder()
                .nome("Thiago Nascimento").email("thiago@avalia.com")
                .senha(senha).perfil(PerfilUsuario.ALUNO).turma(turmaInfo).ativo(true).build());

        // ── Eventos de Conselho ──────────────────────────────────────────────
        EventoConselho eventoADS = eventoConselhoRepository.save(EventoConselho.builder()
                .data(LocalDate.of(2024, 6, 15))
                .turma(turmaADS)
                .metaPreenchimento(80)
                .disciplinas("[\"Banco de Dados\",\"Programação Web\",\"Redes\",\"Engenharia de Software\"]")
                .statusPreConselhoTurma(StatusEtapa.CONCLUIDO)
                .statusPreConselhoProfessores(StatusEtapa.EM_ANDAMENTO)
                .statusFeedbackFinal(StatusEtapa.PENDENTE)
                .feedbackLiberado(false)
                .build());

        EventoConselho eventoRedes = eventoConselhoRepository.save(EventoConselho.builder()
                .data(LocalDate.of(2024, 7, 20))
                .turma(turmaRedes)
                .metaPreenchimento(75)
                .disciplinas("[\"Hardware\",\"Redes de Computadores\",\"Sistemas Operacionais\"]")
                .statusPreConselhoTurma(StatusEtapa.EM_ANDAMENTO)
                .statusPreConselhoProfessores(StatusEtapa.PENDENTE)
                .statusFeedbackFinal(StatusEtapa.PENDENTE)
                .feedbackLiberado(false)
                .build());

        eventoConselhoRepository.save(EventoConselho.builder()
                .data(LocalDate.of(2025, 3, 10))
                .turma(turmaInfo)
                .metaPreenchimento(70)
                .disciplinas("[\"Lógica de Programação\",\"Montagem e Manutenção\"]")
                .statusPreConselhoTurma(StatusEtapa.PENDENTE)
                .statusPreConselhoProfessores(StatusEtapa.PENDENTE)
                .statusFeedbackFinal(StatusEtapa.PENDENTE)
                .feedbackLiberado(false)
                .build());

        // ── Formulários ──────────────────────────────────────────────────────
        String respostasTurma = """
                {
                  "pontosFortes": "A turma demonstrou grande engajamento nas aulas práticas e trabalhos em grupo.",
                  "oportunidadesMelhoria": "Alguns alunos têm dificuldade com os conteúdos teóricos de fundamentos.",
                  "sugestaoSupervisao": "Solicitar mais recursos de laboratório para as aulas de redes.",
                  "autoavaliacao": "A turma se avalia como dedicada, mas reconhece que pode melhorar a pontualidade."
                }
                """;

        formularioRepository.save(Formulario.builder()
                .tipo(TipoFormulario.PRE_CONSELHO_TURMA)
                .usuario(repADS)
                .eventoConselho(eventoADS)
                .respostasJson(respostasTurma)
                .build());

        String respostasProfessor = """
                {
                  "pontosFortesTurma": "Turma participativa e com alunos que demonstram interesse em aprender.",
                  "oportunidadesMelhoria": "Parte da turma apresenta baixo rendimento nas avaliações escritas.",
                  "avaliacaoGeral": "No geral a turma está evoluindo, mas precisa de acompanhamento mais próximo.",
                  "observacoes": "Lucas Andrade: excelente desempenho. Beatriz Costa: precisa de reforço em fundamentos."
                }
                """;

        formularioRepository.save(Formulario.builder()
                .tipo(TipoFormulario.PRE_CONSELHO_PROFESSOR)
                .usuario(profCarlos)
                .eventoConselho(eventoADS)
                .respostasJson(respostasProfessor)
                .build());

        String respostasFeedbackFinal = """
                {
                  "pontosFortes": "Turma com ótimo potencial e bom relacionamento interpessoal.",
                  "oportunidadesMelhoria": "Necessário reforço em disciplinas de fundamentos teóricos.",
                  "encaminhamentos": "Proposto acompanhamento pedagógico individualizado para 3 alunos."
                }
                """;

        formularioRepository.save(Formulario.builder()
                .tipo(TipoFormulario.FEEDBACK_FINAL)
                .usuario(pedagogico)
                .eventoConselho(eventoADS)
                .respostasJson(respostasFeedbackFinal)
                .build());

        // Formulário pré-conselho turma para turma Redes
        String respostasRedes = """
                {
                  "pontosFortes": "Grupo unido, com boa comunicação entre os colegas.",
                  "oportunidadesMelhoria": "A turma sente falta de mais aulas práticas em laboratório.",
                  "sugestaoSupervisao": "Mais investimento em equipamentos de rede.",
                  "autoavaliacao": "Nos consideramos esforçados, mas precisamos de mais suporte dos professores."
                }
                """;

        formularioRepository.save(Formulario.builder()
                .tipo(TipoFormulario.PRE_CONSELHO_TURMA)
                .usuario(repRedes)
                .eventoConselho(eventoRedes)
                .respostasJson(respostasRedes)
                .build());

        // ── Feedbacks Finais ─────────────────────────────────────────────────
        feedbackRepository.save(Feedback.builder()
                .eventoConselho(eventoADS)
                .aluno(aluno1)
                .feedbackFinal("Lucas demonstrou excelente desempenho ao longo do semestre. Recomendamos sua continuidade no curso.")
                .pontosFortes("Proativo, entrega atividades com qualidade e auxilia os colegas.")
                .oportunidadesMelhoria("Pode melhorar a organização das apresentações orais.")
                .build());

        feedbackRepository.save(Feedback.builder()
                .eventoConselho(eventoADS)
                .aluno(aluno2)
                .feedbackFinal("Beatriz tem bom potencial, porém precisa de reforço em fundamentos de banco de dados.")
                .pontosFortes("Pontual, participativa e com boa escrita acadêmica.")
                .oportunidadesMelhoria("Dificuldade com SQL e modelagem relacional. Indicado acompanhamento pedagógico.")
                .build());

        feedbackRepository.save(Feedback.builder()
                .eventoConselho(eventoADS)
                .aluno(aluno3)
                .feedbackFinal("Felipe apresentou evolução significativa no segundo bimestre.")
                .pontosFortes("Criatividade nos projetos práticos e boa resolução de problemas.")
                .oportunidadesMelhoria("Atenção à frequência e entrega de atividades dentro do prazo.")
                .build());

        // ── Mensagens de Chat ────────────────────────────────────────────────
        mensagemChatRepository.save(MensagemChat.builder()
                .remetente(aluno1).destinatario(pedagogico)
                .mensagem("Olá Carla, teria como verificar minha situação no conselho de junho?")
                .lido(true).build());

        mensagemChatRepository.save(MensagemChat.builder()
                .remetente(pedagogico).destinatario(aluno1)
                .mensagem("Olá Lucas! Claro, vou verificar e te retorno ainda hoje.")
                .lido(true).build());

        mensagemChatRepository.save(MensagemChat.builder()
                .remetente(pedagogico).destinatario(aluno1)
                .mensagem("Lucas, seu feedback já está disponível. Pode acessar pelo sistema. Qualquer dúvida, estamos à disposição!")
                .lido(false).build());

        mensagemChatRepository.save(MensagemChat.builder()
                .remetente(aluno3).destinatario(pedagogico)
                .mensagem("Quando sai o resultado do conselho de junho para nossa turma?")
                .lido(false).build());

        mensagemChatRepository.save(MensagemChat.builder()
                .remetente(profCarlos).destinatario(pedagogico)
                .mensagem("Carla, finalizei o preenchimento do pré-conselho da turma ADS. Qualquer ajuste, é só avisar.")
                .lido(true).build());

        mensagemChatRepository.save(MensagemChat.builder()
                .remetente(pedagogico).destinatario(profCarlos)
                .mensagem("Perfeito, Carlos! Obrigada. Vou revisar e comunicar qualquer pendência.")
                .lido(false).build());

        log.info("✅ Seed concluído: {} usuários, {} turmas, {} eventos, {} formulários, {} feedbacks, {} mensagens.",
                usuarioRepository.count(), turmaRepository.count(), eventoConselhoRepository.count(),
                formularioRepository.count(), feedbackRepository.count(), mensagemChatRepository.count());
    }
}
