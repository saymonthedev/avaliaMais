import { useEffect, useState, useRef, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { usuarioService } from '../services/usuarioService';
import { useAuthStore } from '../store/authStore';
import type { MensagemChat, Usuario } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function initials(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function Chat() {
  const { perfil, email } = useAuthStore();
  const [contatos, setContatos] = useState<Usuario[]>([]);
  const [selecionado, setSelecionado] = useState<Usuario | null>(null);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    usuarioService.listar().then((us) => {
      // Filtra contatos conforme regra de negócio
      if (perfil === 'PEDAGOGICO') {
        setContatos(us.filter((u) => u.email !== email && u.ativo));
      } else {
        setContatos(us.filter((u) => u.perfil === 'PEDAGOGICO' && u.ativo));
      }
    });
  }, [perfil, email]);

  const loadConversa = useCallback((contato: Usuario) => {
    setLoading(true);
    chatService.conversa(contato.id).then((msgs) => {
      setMensagens(msgs);
      chatService.marcarLido(contato.id).catch(() => {});
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selecionado) loadConversa(selecionado);
  }, [selecionado, loadConversa]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = async () => {
    if (!selecionado || !texto.trim()) return;
    const msg = texto.trim();
    setTexto('');
    try {
      const nova = await chatService.enviar(selecionado.id, msg);
      setMensagens((prev) => [...prev, nova]);
    } catch { setTexto(msg); }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } };

  const meuEmail = email;

  return (
    <div className="chat-layout">
      {/* Lista de contatos */}
      <div className="chat-list">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {perfil === 'PEDAGOGICO' ? 'Todas as conversas' : 'Equipe Pedagógica'}
        </div>
        {contatos.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}><p style={{ fontSize: 13 }}>Nenhum contato disponível</p></div>
        ) : contatos.map((c) => (
          <div
            key={c.id}
            className={`chat-item ${selecionado?.id === c.id ? 'active' : ''}`}
            onClick={() => setSelecionado(c)}
          >
            <div className="chat-avatar">{initials(c.nome)}</div>
            <div style={{ minWidth: 0 }}>
              <div className="chat-name">{c.nome}</div>
              <div className="chat-preview">{c.perfil}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Janela de chat */}
      <div className="chat-window">
        {!selecionado ? (
          <div className="empty-state" style={{ flex: 1 }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <p>Selecione um contato para iniciar uma conversa</p>
          </div>
        ) : (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="chat-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{initials(selecionado.nome)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selecionado.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selecionado.perfil}</div>
              </div>
            </div>

            <div className="chat-messages">
              {loading ? (
                <div className="empty-state"><p>Carregando mensagens...</p></div>
              ) : mensagens.length === 0 ? (
                <div className="empty-state"><p>Nenhuma mensagem ainda. Diga olá! 👋</p></div>
              ) : mensagens.map((m) => {
                const isMine = m.remetenteId !== selecionado.id;
                return (
                  <div key={m.id} className={`msg-wrap ${isMine ? 'mine' : 'other'}`}>
                    <div className={`msg-bubble ${isMine ? 'msg-mine' : 'msg-other'}`}>{m.mensagem}</div>
                    <div className="msg-time">
                      {format(new Date(m.dataEnvio), "dd/MM HH:mm", { locale: ptBR })}
                      {isMine && <span style={{ marginLeft: 6 }}>{m.lido ? '✓✓' : '✓'}</span>}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-bar">
              <input
                placeholder="Digite uma mensagem..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
              />
              <button className="btn btn-primary btn-sm" onClick={enviar} disabled={!texto.trim()}>Enviar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
