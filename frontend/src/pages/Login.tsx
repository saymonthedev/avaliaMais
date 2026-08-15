import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const features = [
  { icon: '📋', text: 'Gestão de pré-conselhos e conselhos de classe' },
  { icon: '💬', text: 'Chat em tempo real com equipe pedagógica' },
  { icon: '📊', text: 'Dashboards e relatórios de acompanhamento' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(email, senha);
      setAuth(data);
      navigate('/dashboard');
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero */}
      <div className="auth-hero">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="auth-logo-mark" style={{ margin: '0 auto 14px' }}>A+</div>
          <div className="auth-brand">AVALIA<span>+</span></div>
        </div>
        <div className="auth-headline">
          Conselhos de classe<br />mais inteligentes
        </div>
        <p className="auth-subtext">
          Centralize, automatize e acompanhe todo o processo de pré-conselhos e feedbacks educacionais em um só lugar.
        </p>
        <div style={{ marginTop: 48 }}>
          {features.map((f) => (
            <div key={f.text} className="auth-feature">
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-panel">
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div className="logo-icon" style={{ width: 40, height: 40, fontSize: 15 }}>A+</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              AVALIA<span style={{ color: 'var(--primary)' }}>+</span>
            </span>
          </div>
          <div className="login-title">Bem-vindo de volta</div>
          <div className="login-subtitle">Entre com suas credenciais para continuar</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail institucional</label>
            <input
              className="form-control"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Problemas para acessar? Entre em contato com<br />a equipe pedagógica da sua instituição.
        </p>

        <div style={{ position: 'absolute', bottom: 28, left: 44, right: 44, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            AVALIA+ © {new Date().getFullYear()} — Sistema de Gestão de Conselhos
          </p>
        </div>
      </div>
    </div>
  );
}
