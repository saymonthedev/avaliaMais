import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, MessageSquare, ClipboardList, MessageCircle, BookOpen, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import type { PerfilUsuario } from '../types';

interface NavItem {
  to: string;
  icon: ReactNode;
  label: string;
  roles?: PerfilUsuario[];
}

const NAV: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { to: '/eventos', icon: <CalendarDays size={16} />, label: 'Eventos', roles: ['PEDAGOGICO', 'SUPERVISAO', 'PROFESSOR', 'REPRESENTANTE', 'ALUNO', 'ADMINISTRADOR'] },
  { to: '/feedbacks', icon: <MessageSquare size={16} />, label: 'Feedbacks' },
  { to: '/formularios', icon: <ClipboardList size={16} />, label: 'Formulários', roles: ['REPRESENTANTE', 'PROFESSOR', 'PEDAGOGICO'] },
  { to: '/chat', icon: <MessageCircle size={16} />, label: 'Chat' },
  { to: '/turmas', icon: <BookOpen size={16} />, label: 'Turmas', roles: ['PEDAGOGICO', 'ADMINISTRADOR', 'SUPERVISAO'] },
  { to: '/usuarios', icon: <Users size={16} />, label: 'Usuários', roles: ['PEDAGOGICO', 'ADMINISTRADOR'] },
];

const perfilLabel: Record<PerfilUsuario, string> = {
  ALUNO: 'Aluno', REPRESENTANTE: 'Representante', PROFESSOR: 'Professor',
  PEDAGOGICO: 'Pedagógico', SUPERVISAO: 'Supervisão', ADMINISTRADOR: 'Administrador',
};

function initials(nome: string) {
  return nome?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?';
}

export default function Sidebar() {
  const { nome, perfil, can, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const visibleNav = NAV.filter((item) => !item.roles || can(...item.roles));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">A+</div>
        <div className="logo-text">AVALIA<span>+</span></div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {visibleNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card" onClick={handleLogout} title="Clique para sair">
          <div className="user-avatar">{initials(nome ?? '')}</div>
          <div className="user-info">
            <div className="user-name">{nome}</div>
            <div className="user-role">{perfil ? perfilLabel[perfil] : ''} · Sair</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
