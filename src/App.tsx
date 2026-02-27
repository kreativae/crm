import { useState, useEffect, useRef } from 'react';
import type { Page } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { CRM } from './pages/CRM';
import { Omnichannel } from './pages/Omnichannel';
import { Tasks } from './pages/Tasks';
import { Settings } from './pages/Settings';
import Team from './pages/Team';
import Reports from './pages/Reports';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { AppProvider, useApp } from './context/AppContext';
import Notifications from './components/Notifications';
import { CreateClientModal, CreateDealModal, CreateTaskModal } from './components/CreateModals';
import OnboardingTour from './components/OnboardingTour';
import { Bell, Search, Zap, ChevronDown, Plus, UserPlus, Target, ClipboardList, Users, X, ArrowRight, DollarSign, CheckCircle2, LogOut, Settings as SettingsIcon, User, CreditCard, Menu } from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot-password';

const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão executiva do seu negócio' },
  clients: { title: 'Clientes', subtitle: 'Gerencie sua base de contatos' },
  crm: { title: 'CRM & Leads', subtitle: 'Pipeline de vendas' },
  omnichannel: { title: 'Omnichannel', subtitle: 'Central unificada de comunicação' },
  tasks: { title: 'Tarefas', subtitle: 'Gestão operacional da equipe' },
  team: { title: 'Equipe', subtitle: 'Gerencie os membros da sua equipe' },
  reports: { title: 'Relatórios', subtitle: 'Analise e exporte dados' },
  settings: { title: 'Configurações', subtitle: 'Personalize seu workspace' },
};

// Main App Content
function AppContent() {
  const {
    currentPage,
    setCurrentPage,
    setIsCreateClientModalOpen,
    setIsCreateDealModalOpen,
    setIsCreateTaskModalOpen,
    notifications,
    clients,
    deals,
    tasks,
    activeUser,
    showOnboarding,
    finishOnboarding,
    undoStack,
    undo,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Filter search results
  const searchResults = {
    clients: clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    ).slice(0, 5),
    deals: deals.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5),
    tasks: tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
  };

  const hasResults = searchResults.clients.length > 0 || searchResults.deals.length > 0 || searchResults.tasks.length > 0;

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    window.location.reload();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'clients': return <Clients />;
      case 'crm': return <CRM />;
      case 'omnichannel': return <Omnichannel />;
      case 'tasks': return <Tasks />;
      case 'team': return <Team />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const pageInfo = pageTitles[currentPage as Page] || pageTitles.dashboard;
  const sidebarWidth = sidebarOpen ? 256 : 72;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#f4f2fb' }}>
      <Sidebar
        page={currentPage as Page}
        setPage={(p) => setCurrentPage(p)}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={handleLogout}
        onOpenSearch={() => setShowSearch(true)}
      />

      {/* Main content area */}
      <div
        className="flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth, width: `calc(100vw - ${sidebarWidth}px)` }}
      >
        {/* Top Header Bar */}
        {currentPage !== 'omnichannel' && (
          <header className="h-16 min-h-[64px] shrink-0 flex items-center justify-between px-6 lg:px-8 sticky top-0"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              borderBottom: '1px solid rgba(124,58,237,0.06)',
              boxShadow: '0 1px 0 rgba(124,58,237,0.03), 0 4px 20px rgba(0,0,0,0.03)',
              zIndex: 50,
            }}
          >
            {/* Left: Mobile menu button + title */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-violet-100 hover:bg-violet-50 transition-all"
              >
                <Menu className="w-5 h-5 text-violet-600" />
              </button>
              
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[17px] font-extrabold leading-tight tracking-tight" style={{ color: '#0f0a2e' }}>{pageInfo.title}</h1>
                  <div className="hidden sm:flex h-5 w-px bg-gradient-to-b from-transparent via-violet-200 to-transparent" />
                  <p className="hidden sm:block text-[12px] leading-tight font-medium" style={{ color: '#a5a0bd' }}>{pageInfo.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2" style={{ position: 'relative', zIndex: 100 }}>
              {/* Quick Actions */}
              <div className="relative">
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Criar</span>
                </button>
                
                {showQuickActions && (
                  <>
                    <div 
                      className="fixed inset-0" 
                      style={{ zIndex: 999 }}
                      onClick={() => setShowQuickActions(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-scale-in"
                      style={{ zIndex: 1000 }}
                    >
                      <button
                        onClick={() => {
                          setIsCreateClientModalOpen(true);
                          setShowQuickActions(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-violet-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Novo Cliente</p>
                          <p className="text-xs text-gray-500">Adicionar lead ou cliente</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setIsCreateDealModalOpen(true);
                          setShowQuickActions(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-emerald-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Target className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Nova Negociação</p>
                          <p className="text-xs text-gray-500">Criar oportunidade</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setIsCreateTaskModalOpen(true);
                          setShowQuickActions(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <ClipboardList className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Nova Tarefa</p>
                          <p className="text-xs text-gray-500">Criar atividade</p>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Search */}
              <button 
                onClick={() => setShowSearch(true)}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-all"
                style={{ borderColor: 'rgba(139, 92, 246, 0.12)', background: 'rgba(139, 92, 246, 0.02)' }}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-[13px]">Buscar...</span>
                <kbd className="hidden lg:inline-flex text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-mono ml-1">⌘K</kbd>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl border hover:bg-slate-50 transition-all"
                  style={{ borderColor: 'rgba(139, 92, 246, 0.12)' }}
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0" 
                      style={{ zIndex: 998 }}
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in"
                      style={{ zIndex: 999 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notificações</h3>
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                          {notifications.length} novas
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Nenhuma notificação</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notif) => (
                            <div 
                              key={notif.id} 
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  notif.type === 'success' ? 'bg-emerald-100' :
                                  notif.type === 'error' ? 'bg-red-100' :
                                  notif.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                                }`}>
                                  <CheckCircle2 className={`w-4 h-4 ${
                                    notif.type === 'success' ? 'text-emerald-600' :
                                    notif.type === 'error' ? 'text-red-600' :
                                    notif.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                                  }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 font-medium truncate">{notif.title}</p>
                                  <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                          <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                            Ver todas as notificações
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Avatar */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border hover:bg-slate-50 transition-all"
                  style={{ borderColor: 'rgba(139, 92, 246, 0.12)' }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ 
                      background: activeUser?.role === 'owner' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' :
                                  activeUser?.role === 'admin' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                                  activeUser?.role === 'vendedor' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                  activeUser?.role === 'atendimento' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                  'linear-gradient(135deg, #ec4899, #db2777)'
                    }}
                  >
                    {activeUser?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-[12px] font-semibold text-slate-800 leading-tight">{activeUser?.name || 'Usuário'}</p>
                    <p className="text-[10px] text-slate-400 leading-tight capitalize">{activeUser?.role || 'Usuário'}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden md:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0" 
                      style={{ zIndex: 998 }}
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in"
                      style={{ zIndex: 999 }}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-indigo-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                            style={{ 
                              background: activeUser?.role === 'owner' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' :
                                          activeUser?.role === 'admin' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                                          activeUser?.role === 'vendedor' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                          activeUser?.role === 'atendimento' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                          'linear-gradient(135deg, #ec4899, #db2777)'
                            }}
                          >
                            {activeUser?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{activeUser?.name || 'Usuário'}</p>
                            <p className="text-xs text-gray-500">{activeUser?.email || 'usuario@email.com'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setCurrentPage('settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">Meu Perfil</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage('settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <SettingsIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">Configurações</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage('team');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">Minha Equipe</span>
                        </button>
                        <button
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">Assinatura</span>
                          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">PRO</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="py-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          <span className="text-sm text-gray-700 group-hover:text-red-600">Sair da Conta</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main 
          className={`flex-1 w-full ${(currentPage === 'omnichannel' || currentPage === 'crm' || currentPage === 'clients') ? 'overflow-hidden' : 'overflow-auto'}`}
          style={{ 
            background: (currentPage === 'omnichannel' || currentPage === 'crm' || currentPage === 'clients') ? '#f8fafc' : 'linear-gradient(180deg, #f6f5fb 0%, #f0edf8 100%)',
            height: (currentPage === 'omnichannel' || currentPage === 'crm' || currentPage === 'clients') ? 'calc(100vh - 64px)' : 'auto'
          }}
        >
          <div 
            key={currentPage} 
            className={`page-enter w-full ${(currentPage === 'omnichannel' || currentPage === 'crm' || currentPage === 'clients') ? 'h-full' : 'min-h-full'}`}
            style={{ height: (currentPage === 'omnichannel' || currentPage === 'crm' || currentPage === 'clients') ? '100%' : 'auto' }}
          >
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 flex items-start justify-center pt-[8vh]" style={{ zIndex: 99999 }}>
          <div 
            className="absolute inset-0 modal-overlay"
            onClick={() => { setShowSearch(false); setSearchQuery(''); }}
          />
          <div 
            className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl overflow-hidden animate-pop-in"
            style={{ boxShadow: '0 0 0 1px rgba(124,58,237,0.06), 0 25px 50px -12px rgba(0,0,0,0.25), 0 0 80px rgba(124,58,237,0.08)' }}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-violet-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar clientes, negociações, tarefas..."
                className="flex-1 text-base outline-none placeholder:text-gray-400"
              />
              <kbd className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono">ESC</kbd>
              <button 
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-violet-500" />
                  </div>
                  <p className="text-gray-600 font-medium">Digite para buscar</p>
                  <p className="text-sm text-gray-400 mt-1">Busque por clientes, negociações ou tarefas</p>
                </div>
              ) : !hasResults ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Nenhum resultado encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">Tente buscar com outros termos</p>
                </div>
              ) : (
                <div className="py-2">
                  {/* Clients Results */}
                  {searchResults.clients.length > 0 && (
                    <div className="mb-2">
                      <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        Clientes ({searchResults.clients.length})
                      </div>
                      {searchResults.clients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => {
                            setCurrentPage('clients');
                            setShowSearch(false);
                            setSearchQuery('');
                          }}
                          className="w-full px-5 py-3 flex items-center gap-4 hover:bg-violet-50 transition-colors text-left"
                        >
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                          >
                            {client.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{client.name}</p>
                            <p className="text-sm text-gray-500 truncate">{client.email}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            client.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            client.status === 'negotiation' ? 'bg-amber-100 text-amber-700' :
                            client.status === 'lead' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {client.status === 'active' ? 'Ativo' :
                             client.status === 'negotiation' ? 'Negociação' :
                             client.status === 'lead' ? 'Lead' : client.status}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-300" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Deals Results */}
                  {searchResults.deals.length > 0 && (
                    <div className="mb-2">
                      <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" />
                        Negociações ({searchResults.deals.length})
                      </div>
                      {searchResults.deals.map((deal) => (
                        <button
                          key={deal.id}
                          onClick={() => {
                            setCurrentPage('crm');
                            setShowSearch(false);
                            setSearchQuery('');
                          }}
                          className="w-full px-5 py-3 flex items-center gap-4 hover:bg-emerald-50 transition-colors text-left"
                        >
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                          >
                            <Target className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{deal.title}</p>
                            <p className="text-sm text-gray-500">
                              {deal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                            {deal.stage}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-300" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tasks Results */}
                  {searchResults.tasks.length > 0 && (
                    <div className="mb-2">
                      <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Tarefas ({searchResults.tasks.length})
                      </div>
                      {searchResults.tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => {
                            setCurrentPage('tasks');
                            setShowSearch(false);
                            setSearchQuery('');
                          }}
                          className="w-full px-5 py-3 flex items-center gap-4 hover:bg-blue-50 transition-colors text-left"
                        >
                          <div 
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                              task.status === 'done' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                              task.status === 'in_progress' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                              'bg-gradient-to-br from-blue-500 to-blue-600'
                            }`}
                          >
                            <ClipboardList className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{task.title}</p>
                            <p className="text-sm text-gray-500 truncate">{task.description}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {task.priority === 'urgent' ? 'Urgente' :
                             task.priority === 'high' ? 'Alta' :
                             task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-300" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">↵</kbd>
                  para selecionar
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">ESC</kbd>
                  para fechar
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>Powered by</span>
                <span className="font-semibold text-violet-600">NexusCRM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateClientModal />
      <CreateDealModal />
      <CreateTaskModal />
      
      {/* Notifications */}
      <Notifications />

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 lg:hidden" style={{ zIndex: 99990 }}>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#0f0a2e] shadow-2xl animate-slide-in-left">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">NexusCRM</span>
              </div>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'clients', label: 'Clientes', icon: '👥' },
                { id: 'crm', label: 'CRM & Leads', icon: '📈' },
                { id: 'omnichannel', label: 'Omnichannel', icon: '💬' },
                { id: 'tasks', label: 'Tarefas', icon: '✅' },
                { id: 'team', label: 'Equipe', icon: '👥' },
                { id: 'reports', label: 'Relatórios', icon: '📊' },
                { id: 'settings', label: 'Configurações', icon: '⚙️' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    currentPage === item.id 
                      ? 'bg-violet-600/20 text-white' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Undo Notification */}
      {undoStack.length > 0 && undoStack[0] && (
        <div 
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white pl-5 pr-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-pop-in border border-white/10"
          style={{ zIndex: 99995, boxShadow: '0 0 40px rgba(0,0,0,0.3), 0 20px 40px -10px rgba(0,0,0,0.4)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Ação realizada</p>
              <p className="text-xs text-white/50">
                {undoStack[0].type === 'DELETE_CLIENT' ? 'Cliente excluído' :
                 undoStack[0].type === 'DELETE_DEAL' ? 'Negociação excluída' :
                 undoStack[0].type === 'DELETE_TASK' ? 'Tarefa excluída' :
                 undoStack[0].type === 'DELETE_TEAM_MEMBER' ? 'Membro excluído' :
                 'Ação pode ser desfeita'}
              </p>
            </div>
          </div>
          <button
            onClick={undo}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Desfazer
          </button>
        </div>
      )}

      {/* Onboarding Tour */}
      <OnboardingTour 
        isOpen={showOnboarding} 
        onClose={finishOnboarding}
        onNavigate={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

// Auth Wrapper
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      const savedToken = localStorage.getItem('nexus_token');
      if (savedToken) setIsAuthenticated(true);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    localStorage.setItem('nexus_token', 'fake_jwt_token_123');
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    localStorage.setItem('nexus_token', 'fake_jwt_token_123');
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a0718 0%, #110d2e 50%, #07050f 100%)' }}
      >
        {/* Ambient */}
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full opacity-10 animate-orb" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div className="text-center animate-fade-in-up relative z-10">
          <div className="relative mx-auto mb-6 w-20 h-20">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl animate-pulse-glow" style={{ background: 'transparent' }} />
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #4f46e5)' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
              <Zap className="w-9 h-9 text-white relative z-10 drop-shadow-lg" />
            </div>
          </div>
          <h2 className="text-white font-extrabold text-xl mb-1 tracking-tight">NexusCRM</h2>
          <p className="text-white/25 text-xs mb-6">Carregando sua workspace...</p>
          <div className="flex items-center gap-1.5 justify-center">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-violet-400/70 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (authView) {
      case 'register':
        return <Register onRegister={handleRegister} onBackToLogin={() => setAuthView('login')} />;
      case 'forgot-password':
        return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
      default:
        return <Login onLogin={handleLogin} onRegister={() => setAuthView('register')} onForgotPassword={() => setAuthView('forgot-password')} />;
    }
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
