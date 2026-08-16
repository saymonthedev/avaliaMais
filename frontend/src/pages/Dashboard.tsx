import { useEffect, useState } from 'react';
import { CalendarDays, Users, BookOpen, Clock, ClipboardList } from 'lucide-react';
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
    <div className="page">
      <div className="stats-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stat-card">
            <span className="skeleton" style={{ width: 46, height: 46, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="skeleton" style={{ height: 24, width: 52 }} />
              <span className="skeleton" style={{ height: 12, width: 120 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <span className="skeleton" style={{ height: 18, width: 240, display: 'inline-block' }} />
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[0, 1, 2].map((i) => <span key={i} className="skeleton" style={{ height: 44 }} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><CalendarDays size={20} /></div>
          <div>
            <div className="stat-value">{eventos.length}</div>
            <div className="stat-label">Eventos de conselho</div>
          </div>
        </div>
        {(perfil === 'PEDAGOGICO' || perfil === 'ADMINISTRADOR') && (
          <>
            <div className="stat-card">
              <div className="stat-icon green"><Users size={20} /></div>
              <div>
                <div className="stat-value">{totalUsuarios}</div>
                <div className="stat-label">Usuários cadastrados</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><BookOpen size={20} /></div>
              <div>
                <div className="stat-value">{totalTurmas}</div>
                <div className="stat-label">Turmas cadastradas</div>
              </div>
            </div>
          </>
        )}
        <div className="stat-card">
          <div className="stat-icon orange"><Clock size={20} /></div>
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
            <ClipboardList size={40} strokeWidth={1.2} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
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
