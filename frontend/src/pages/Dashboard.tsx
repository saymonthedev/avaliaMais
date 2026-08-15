import { useEffect, useState } from 'react';
import { eventoService } from '../services/eventoService';
import { usuarioService } from '../services/usuarioService';
import { turmaService } from '../services/turmaService';
import { useAuthStore } from '../store/authStore';
import type { EventoConselho, StatusEtapa } from '../types';

function statusLabel(s: StatusEtapa) {
  const map: Record<StatusEtapa, { label: string; cls: string }> = {
    PENDENTE: { label: 'Pendente', cls: 'badge-gray' },
    EM_ANDAMENTO: { label: 'Em andamento', cls: 'badge-yellow' },
    CONCLUIDO: { label: 'Concluído', cls: 'badge-green' },
    CANCELADO: { label: 'Cancelado', cls: 'badge-red' },
  };
  return map[s] ?? { label: s, cls: 'badge-gray' };
}

export default function Dashboard() {
  const { perfil } = useAuthStore();
  const [eventos, setEventos] = useState<EventoConselho[]>([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalTurmas, setTotalTurmas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      eventoService.listar(),
      usuarioService.listar().catch(() => []),
      turmaService.listar().catch(() => []),
    ]).then(([ev, us, tu]) => {
      setEventos(ev);
      setTotalUsuarios(us.length);
      setTotalTurmas(tu.length);
    }).finally(() => setLoading(false));
  }, []);

  const eventosPendentes = eventos.filter(
    (e) => e.statusPreConselhoTurma !== 'CONCLUIDO' || e.statusPreConselhoProfessores !== 'CONCLUIDO'
  ).length;

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Carregando dashboard...</div>
    </div>
  );

  return (
    <div className="page">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div>
            <div className="stat-value">{eventos.length}</div>
            <div className="stat-label">Eventos de conselho</div>
          </div>
        </div>
        {(perfil === 'PEDAGOGICO' || perfil === 'ADMINISTRADOR') && (
          <>
            <div className="stat-card">
              <div className="stat-icon green">👥</div>
              <div>
                <div className="stat-value">{totalUsuarios}</div>
                <div className="stat-label">Usuários cadastrados</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">🏫</div>
              <div>
                <div className="stat-value">{totalTurmas}</div>
                <div className="stat-label">Turmas ativas</div>
              </div>
            </div>
          </>
        )}
        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div>
            <div className="stat-value">{eventosPendentes}</div>
            <div className="stat-label">Eventos em andamento</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Eventos de Conselho Recentes</span>
        </div>
        {eventos.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>📋</span>
            <p>Nenhum evento de conselho encontrado.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Data</th>
                  <th>Pré-conselho Turma</th>
                  <th>Pré-conselho Prof.</th>
                  <th>Feedback Final</th>
                  <th>Feedback Liberado</th>
                </tr>
              </thead>
              <tbody>
                {eventos.slice(0, 10).map((ev) => {
                  const s1 = statusLabel(ev.statusPreConselhoTurma);
                  const s2 = statusLabel(ev.statusPreConselhoProfessores);
                  const s3 = statusLabel(ev.statusFeedbackFinal);
                  return (
                    <tr key={ev.id}>
                      <td><strong>{ev.turmaNome}</strong></td>
                      <td>{new Date(ev.data).toLocaleDateString('pt-BR')}</td>
                      <td><span className={`badge ${s1.cls}`}>{s1.label}</span></td>
                      <td><span className={`badge ${s2.cls}`}>{s2.label}</span></td>
                      <td><span className={`badge ${s3.cls}`}>{s3.label}</span></td>
                      <td>
                        <span className={`badge ${ev.feedbackLiberado ? 'badge-green' : 'badge-gray'}`}>
                          {ev.feedbackLiberado ? 'Sim' : 'Não'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
