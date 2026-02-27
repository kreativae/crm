import { useState, useRef, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Kanban,
  MessageCircle,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  Search,
  Sparkles,
  ChevronDown,
  Check,
  UserCircle,
  UsersRound,
  BarChart2,
} from 'lucide-react';
import type { Page } from '../types';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  page: Page;
  setPage: (p: Page) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  onLogout?: () => void;
  onOpenSearch?: () => void;
}

const roleColors: Record<string, string> = {
  owner: 'from-violet-500 to-fuchsia-500',
  admin: 'from-blue-500 to-indigo-500',
  vendedor: 'from-emerald-500 to-green-500',
  atendimento: 'from-orange-500 to-amber-500',
  financeiro: 'from-rose-500 to-pink-500',
};

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  vendedor: 'Vendedor',
  atendimento: 'Atendimento',
  financeiro: 'Financeiro',
};

export function Sidebar({ page, setPage, open, setOpen, onLogout, onOpenSearch }: SidebarProps) {
  const { teamMembers, addNotification, clients, deals, tasks, activeUserId, setActiveUserId } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Calcular badges reais
  const badges = useMemo(() => {
    // Total de clientes
    const totalClients = clients.length;
    
    // Deals ativos (não fechados e não perdidos)
    const activeDeals = deals.filter(d => d.stage !== 'closed' && d.stage !== 'lost').length;
    
    // Conversas abertas (simulado - em produção viria do contexto de conversas)
    const openConversations = 5; // Valor fixo por enquanto, pode ser integrado com omnichannel
    
    // Tarefas pendentes (não concluídas)
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    
    // Membros ativos da equipe
    const activeMembers = teamMembers.filter(m => m.status === 'active').length;
    
    return {
      clients: totalClients > 0 ? totalClients.toString() : null,
      crm: activeDeals > 0 ? activeDeals.toString() : null,
      omnichannel: openConversations > 0 ? openConversations.toString() : null,
      tasks: pendingTasks > 0 ? pendingTasks.toString() : null,
      team: activeMembers > 0 ? activeMembers.toString() : null,
    };
  }, [clients, deals, tasks, teamMembers]);

  // Navegação com badges dinâmicos
  const nav = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard, badge: null, color: 'violet' },
    { id: 'clients' as Page, label: 'Clientes', icon: Users, badge: badges.clients, color: 'blue' },
    { id: 'crm' as Page, label: 'CRM & Leads', icon: Kanban, badge: badges.crm, color: 'emerald' },
    { id: 'omnichannel' as Page, label: 'Omnichannel', icon: MessageCircle, badge: badges.omnichannel, color: 'orange' },
    { id: 'tasks' as Page, label: 'Tarefas', icon: CheckSquare, badge: badges.tasks, color: 'rose' },
    { id: 'team' as Page, label: 'Equipe', icon: UsersRound, badge: badges.team, color: 'cyan' },
    { id: 'reports' as Page, label: 'Relatórios', icon: BarChart2, badge: null, color: 'amber' },
    { id: 'settings' as Page, label: 'Configurações', icon: Settings, badge: null, color: 'slate' },
  ];

  const activeMembers = teamMembers.filter(m => m.status === 'active');
  const currentUser = teamMembers.find(m => m.id === activeUserId) || activeMembers[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchUser = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      setActiveUserId(memberId);
      setUserMenuOpen(false);
      addNotification('success', 'Usuário trocado', `Logado como ${member.name}`);
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 ease-out',
        open ? 'w-[260px]' : 'w-[76px]'
      )}
      style={{
        background: 'linear-gradient(165deg, #1a1035 0%, #0f0823 50%, #0a0618 100%)',
      }}
    >
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/3 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-20 -left-10 w-32 h-32 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)' }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Logo */}
      <div className={cn(
        'flex items-center h-[72px] shrink-0 relative z-10',
        open ? 'px-5' : 'px-0 justify-center'
      )}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative group">
            {/* Logo glow */}
            <div 
              className="absolute inset-0 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
            />
            <div 
              className="relative w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)' }}
            >
              {/* Glass shine effect */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
              }} />
              <Zap className="w-5 h-5 text-white relative z-10 drop-shadow-sm" />
            </div>
          </div>
          {open && (
            <div className="min-w-0 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  Nexus<span className="text-violet-400">CRM</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-violet-300 rounded border border-violet-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-white/30 font-medium mt-0.5">Gestão Inteligente</p>
            </div>
          )}
        </div>
      </div>

      {/* Search (only when open) */}
      {open && (
        <div className="px-4 pt-1 pb-3 relative z-10 animate-fade-in-up">
          <button 
            onClick={onOpenSearch}
            className="w-full group flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200"
          >
            <Search className="w-4 h-4 text-white/25 shrink-0 group-hover:text-white/40 transition-colors" />
            <span className="text-sm text-white/25 flex-1 text-left group-hover:text-white/40 transition-colors">Buscar...</span>
            <kbd className="text-[10px] text-white/15 bg-white/[0.04] px-2 py-1 rounded-md font-mono border border-white/[0.06] group-hover:border-white/[0.1] transition-colors">⌘K</kbd>
          </button>
        </div>
      )}

      {/* Search button (only when collapsed) */}
      {!open && (
        <div className="px-3 pt-1 pb-3 flex justify-center relative z-10">
          <button 
            onClick={onOpenSearch}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/25 hover:bg-white/[0.06] hover:border-white/[0.1] hover:text-white/40 transition-all duration-200 group"
            title="Buscar (⌘K)"
          >
            <Search className="w-5 h-5" />
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap border border-white/10 z-[100] translate-x-2 group-hover:translate-x-0">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-white/10" />
              Buscar
              <kbd className="ml-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn('flex-1 overflow-y-auto relative z-10 mt-1', open ? 'px-3' : 'px-3')}>
        <div className={cn('space-y-1', !open && 'flex flex-col items-center')}>
          {open && (
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <Sparkles className="w-3 h-3 text-white/20" />
              <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.2em]">
                Menu
              </p>
            </div>
          )}
          {nav.map((item, index) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                title={!open ? item.label : undefined}
                style={{ animationDelay: `${index * 50}ms` }}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  open ? 'w-full px-3 py-2.5' : 'w-12 h-12 justify-center',
                  active
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/90'
                )}
              >
                {/* Hover background */}
                <div className={cn(
                  'absolute inset-0 rounded-xl transition-all duration-200',
                  active 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover:opacity-100',
                  active
                    ? ''
                    : 'bg-white/[0.04]'
                )} style={active ? {
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.12) 100%)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                } : undefined} />

                {/* Active left indicator */}
                <div className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-200',
                  active ? 'h-6 opacity-100' : 'h-0 opacity-0'
                )} style={{ background: 'linear-gradient(180deg, #a78bfa, #8b5cf6)' }} />

                {/* Icon container */}
                <div className={cn(
                  'relative z-10 flex items-center justify-center rounded-lg transition-all duration-200',
                  open ? 'w-8 h-8' : 'w-9 h-9',
                  active 
                    ? 'bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-400' 
                    : 'text-white/40 group-hover:text-white/80'
                )}>
                  <Icon className={cn(open ? 'w-[18px] h-[18px]' : 'w-5 h-5')} />
                </div>

                {open && (
                  <>
                    <span className="flex-1 text-left relative z-10 text-[13px] font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        'relative z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full min-w-[24px] text-center transition-all duration-200',
                        active
                          ? 'bg-violet-500/25 text-violet-300 border border-violet-400/20'
                          : 'bg-white/[0.06] text-white/40 group-hover:bg-white/[0.1] group-hover:text-white/60'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip when closed */}
                {!open && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap border border-white/10 z-[100] translate-x-2 group-hover:translate-x-0">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-white/10" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-violet-500/20 text-violet-300 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Notification dot when collapsed */}
                {!open && item.badge && (
                  <div className={cn(
                    'absolute top-2 right-2 w-2 h-2 rounded-full transition-all duration-200',
                    active ? 'bg-violet-400' : 'bg-violet-500/60'
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="relative z-10 shrink-0">
        {/* Divider with glow */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* User Switcher */}
        <div className={cn('p-3', !open && 'px-3 py-3')} ref={userMenuRef}>
          <div className="relative">
            {/* Current User Button */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl transition-all duration-200 group',
                open ? 'p-2.5 hover:bg-white/[0.04]' : 'p-2 justify-center hover:bg-white/[0.04]',
                userMenuOpen && 'bg-white/[0.06] ring-1 ring-white/10'
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div 
                  className={cn(
                    'relative w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-lg overflow-hidden bg-gradient-to-br',
                    currentUser ? roleColors[currentUser.role] || 'from-violet-500 to-fuchsia-500' : 'from-violet-500 to-fuchsia-500'
                  )}
                >
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
                  }} />
                  <span className="relative z-10">
                    {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0618] shadow-lg shadow-emerald-500/50" />
              </div>

              {open && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-white truncate">
                      {currentUser?.name || 'Selecionar Usuário'}
                    </p>
                    <p className="text-xs text-white/30 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {currentUser ? (roleLabels[currentUser.role] || currentUser.role) : 'Offline'}
                    </p>
                  </div>
                  <ChevronDown className={cn(
                    'w-4 h-4 text-white/30 transition-transform duration-200 shrink-0',
                    userMenuOpen && 'rotate-180'
                  )} />
                </>
              )}

              {/* Tooltip when collapsed */}
              {!open && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap border border-white/10 z-[100] translate-x-2 group-hover:translate-x-0">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-white/10" />
                  {currentUser?.name || 'Trocar Usuário'}
                </div>
              )}
            </button>

            {/* User Switcher Dropdown */}
            {userMenuOpen && (
              <div 
                className={cn(
                  'absolute bottom-full mb-2 rounded-xl border border-white/10 shadow-2xl overflow-hidden',
                  open ? 'left-0 right-0' : 'left-0 w-64'
                )}
                style={{ 
                  background: 'linear-gradient(165deg, #1e1245 0%, #150d30 100%)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-violet-400" />
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Trocar Usuário</p>
                  </div>
                </div>

                {/* User List */}
                <div className="max-h-[280px] overflow-y-auto py-1.5 px-1.5 space-y-0.5 custom-scrollbar">
                  {activeMembers.map((member) => {
                    const isActive = member.id === activeUserId;
                    const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const gradient = roleColors[member.role] || 'from-violet-500 to-fuchsia-500';
                    
                    return (
                      <button
                        key={member.id}
                        onClick={() => switchUser(member.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item',
                          isActive 
                            ? 'bg-violet-500/15 ring-1 ring-violet-500/20' 
                            : 'hover:bg-white/[0.04]'
                        )}
                      >
                        {/* Avatar */}
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0 bg-gradient-to-br shadow-md overflow-hidden',
                          gradient
                        )}>
                          <div className="absolute inset-0" style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)'
                          }} />
                          <span className="relative z-10">{initials}</span>
                        </div>

                        {/* Name & Role */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className={cn(
                            'text-[13px] font-medium truncate transition-colors',
                            isActive ? 'text-violet-300' : 'text-white/70 group-hover/item:text-white/90'
                          )}>
                            {member.name}
                          </p>
                          <p className="text-[11px] text-white/30 truncate">
                            {roleLabels[member.role] || member.role}
                          </p>
                        </div>

                        {/* Check indicator */}
                        {isActive && (
                          <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-violet-400" />
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {activeMembers.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <UserCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
                      <p className="text-xs text-white/30">Nenhum membro ativo</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.06] px-3 py-2">
                  <p className="text-[10px] text-white/20 text-center">
                    {activeMembers.length} membro{activeMembers.length !== 1 ? 's' : ''} ativo{activeMembers.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {open && onLogout && (
            <button
              onClick={onLogout}
              className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 text-[13px] font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          )}

          {!open && onLogout && (
            <button
              onClick={onLogout}
              className="w-full mt-2 flex items-center justify-center p-2 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap border border-white/10 z-[100] translate-x-2 group-hover:translate-x-0">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-white/10" />
                Sair da conta
              </div>
            </button>
          )}
        </div>

        {/* Toggle Button */}
        <div className={cn('px-3 pb-4', !open && 'px-3')}>
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              'flex items-center justify-center rounded-xl border border-white/[0.06] text-white/30 hover:text-white/70 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200',
              open ? 'w-full py-2.5 gap-2 text-[12px] font-medium' : 'w-full h-10'
            )}
          >
            {open ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Recolher</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
