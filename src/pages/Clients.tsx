import { useState } from 'react';
import {
  Search, Plus, Filter, MoreVertical, Mail, Phone,
  Building2, User, Tag, Star, X, ChevronDown,
  Edit3, Trash2, Save, XCircle, TrendingUp, Users,
  ArrowUpRight, ChevronRight, Target, ClipboardList,
} from 'lucide-react';
import { useApp, Client } from '../context/AppContext';
import { cn } from '../utils/cn';

type ClientStatus = Client['status'];

const statusConfig: Record<ClientStatus, { label: string; color: string; dot: string }> = {
  lead: { label: 'Lead', color: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
  negotiation: { label: 'Em Negociação', color: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
  active: { label: 'Ativo', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  inactive: { label: 'Inativo', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  lost: { label: 'Perdido', color: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' },
};

function formatCurrency(v: number) {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);
}

function getInitialsBg(name: string, type: string) {
  if (type === 'PJ') return 'linear-gradient(135deg, #3b82f6, #06b6d4)';
  const colors = [
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #10b981, #059669)',
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

export function Clients() {
  const { 
    clients, 
    updateClient, 
    deleteClient, 
    setIsCreateClientModalOpen,
    setIsCreateDealModalOpen,
    setIsCreateTaskModalOpen,
    setPrefillData,
    getDealsByClient,
    getTasksByRelation,
    navigateToDeal,
    setCurrentPage
  } = useApp();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSaveClient = (updatedClient: Client) => {
    updateClient(updatedClient.id, updatedClient);
    setEditingClient(null);
    if (selectedClient?.id === updatedClient.id) setSelectedClient(updatedClient);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Todas as negociações e tarefas relacionadas serão excluídas.')) {
      deleteClient(clientId);
      setSelectedClient(null);
    }
  };

  const handleCreateDeal = (client: Client) => {
    setPrefillData({ clientId: client.id, assignedTo: client.assignedTo });
    setIsCreateDealModalOpen(true);
  };

  const handleCreateTask = (client: Client) => {
    setPrefillData({ 
      relationType: 'client', 
      relationId: client.id,
      assignedTo: client.assignedTo 
    });
    setIsCreateTaskModalOpen(true);
  };

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = filtered.reduce((s, c) => s + c.estimatedValue, 0);
  const activeCount = filtered.filter(c => c.status === 'active').length;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ padding: '16px' }}>
      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0 mb-4">
        {[
          { label: 'Total de Contatos', value: String(clients.length), icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Clientes Ativos', value: String(clients.filter(c => c.status === 'active').length), icon: TrendingUp, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Em Negociação', value: String(clients.filter(c => c.status === 'negotiation').length), icon: ArrowUpRight, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Valor Total Est.', value: formatCurrency(clients.reduce((s, c) => s + c.estimatedValue, 0)), icon: Star, color: '#6366f1', bg: '#eef2ff' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-3 sm:p-4 flex items-center gap-3"
              style={{ borderColor: 'rgba(139, 92, 246, 0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] sm:text-[14px] font-bold text-slate-800 truncate">{stat.value}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: 'rgba(139, 92, 246, 0.15)',
              background: 'white',
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
              showFilters
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showFilters && 'rotate-180')} />
          </button>
          <button 
            onClick={() => setIsCreateClientModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Cliente</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border flex-shrink-0 mb-4"
          style={{ borderColor: 'rgba(139, 92, 246, 0.1)' }}
        >
          <button
            onClick={() => setStatusFilter('all')}
            className={cn('px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all border',
              statusFilter === 'all'
                ? 'text-white border-transparent'
                : 'text-slate-600 bg-white border-slate-200 hover:border-violet-300'
            )}
            style={statusFilter === 'all' ? { background: 'linear-gradient(135deg, #7c3aed, #6366f1)', borderColor: 'transparent' } : {}}
          >
            Todos ({clients.length})
          </button>
          {(Object.entries(statusConfig) as [ClientStatus, { label: string; color: string }][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={cn('px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all border',
                statusFilter === key
                  ? 'text-white border-transparent'
                  : 'text-slate-600 bg-white border-slate-200 hover:border-violet-300'
              )}
              style={statusFilter === key ? { background: 'linear-gradient(135deg, #7c3aed, #6366f1)', borderColor: 'transparent' } : {}}
            >
              {val.label} ({clients.filter(c => c.status === key).length})
            </button>
          ))}
        </div>
      )}

      {/* Summary row */}
      <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-slate-500 flex-shrink-0 mb-3 flex-wrap">
        <span className="font-semibold text-slate-700">{filtered.length}</span> contatos
        {statusFilter !== 'all' && <span className="hidden sm:inline">· filtrado por <strong className="text-violet-600">{statusConfig[statusFilter].label}</strong></span>}
        <span className="mx-1 hidden sm:inline">·</span>
        <span className="hidden sm:inline">Valor total: <strong className="text-slate-700">{formatCurrency(totalValue)}</strong></span>
        <span className="mx-1 hidden sm:inline">·</span>
        <span><strong className="text-emerald-600">{activeCount}</strong> ativos</span>
      </div>

      {/* Table Container - takes remaining height */}
      <div className="flex-1 bg-white rounded-2xl border overflow-hidden min-h-0"
        style={{ borderColor: 'rgba(139, 92, 246, 0.08)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
      >
        <div className="h-full overflow-auto">
          <table className="w-full min-w-[600px]">
            <thead className="sticky top-0 z-10">
              <tr style={{ background: 'linear-gradient(180deg, #faf9ff 0%, #f8f7ff 100%)' }}>
                <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 border-b whitespace-nowrap" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.08)' }}>
                  Cliente
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 border-b hidden md:table-cell whitespace-nowrap" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.08)' }}>
                  Contato
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 border-b whitespace-nowrap" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.08)' }}>
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 border-b hidden lg:table-cell whitespace-nowrap" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.08)' }}>
                  Score
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 border-b hidden lg:table-cell whitespace-nowrap" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.08)' }}>
                  Valor Est.
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 border-b hidden xl:table-cell whitespace-nowrap" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.08)' }}>
                  Responsável
                </th>
                <th className="w-10 px-4 py-3 border-b" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.08)' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client, idx) => (
                <tr
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={cn(
                    'cursor-pointer transition-all group border-b',
                    selectedClient?.id === client.id
                      ? 'bg-violet-50/70'
                      : idx % 2 === 0 ? 'hover:bg-slate-50/80' : 'bg-slate-50/30 hover:bg-slate-50/80'
                  )}
                  style={{ borderBottomColor: 'rgba(139, 92, 246, 0.05)' }}
                >
                  {/* Client */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-sm"
                        style={{ background: getInitialsBg(client.name, client.type) }}
                      >
                        {client.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-[13px] group-hover:text-violet-700 transition-colors truncate">{client.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {client.type === 'PJ' ? <Building2 className="w-3 h-3 text-slate-400 shrink-0" /> : <User className="w-3 h-3 text-slate-400 shrink-0" />}
                          <span className="text-[11px] text-slate-400">{client.type}</span>
                          {client.tags.slice(0, 1).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium hidden sm:inline"
                              style={{ background: '#f5f3ff', color: '#7c3aed' }}
                            >{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />{client.phone}
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full border whitespace-nowrap', statusConfig[client.status].color)}>
                      <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusConfig[client.status].dot)} />
                      <span className="hidden sm:inline">{statusConfig[client.status].label}</span>
                      <span className="sm:hidden">{statusConfig[client.status].label.slice(0, 3)}</span>
                    </span>
                  </td>
                  {/* Score */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${client.score}%`,
                            background: client.score >= 70
                              ? 'linear-gradient(90deg, #10b981, #059669)'
                              : client.score >= 40
                                ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                : 'linear-gradient(90deg, #ef4444, #dc2626)',
                          }}
                        />
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">{client.score}</span>
                    </div>
                  </td>
                  {/* Value */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-[13px] font-bold text-slate-800 whitespace-nowrap">{formatCurrency(client.estimatedValue)}</span>
                  </td>
                  {/* Assigned */}
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                      >
                        {client.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-[12px] text-slate-600 truncate">{client.assignedTo.split(' ')[0]}</span>
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Users className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium text-slate-600">Nenhum cliente encontrado</p>
              <p className="text-sm mt-1">Tente ajustar os filtros ou a busca</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel Backdrop */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setSelectedClient(null)} />
      )}

      {/* Detail Panel */}
      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={(c) => setEditingClient(c)}
          onDelete={handleDeleteClient}
          onCreateDeal={handleCreateDeal}
          onCreateTask={handleCreateTask}
          getDealsByClient={getDealsByClient}
          getTasksByRelation={getTasksByRelation}
          navigateToDeal={navigateToDeal}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Edit Modal */}
      {editingClient && (
        <EditClientModal client={editingClient} onClose={() => setEditingClient(null)} onSave={handleSaveClient} />
      )}
    </div>
  );
}

function ClientDetailPanel({ 
  client, 
  onClose, 
  onEdit, 
  onDelete,
  onCreateDeal,
  onCreateTask,
  getDealsByClient,
  getTasksByRelation,
  navigateToDeal,
  setCurrentPage
}: {
  client: Client; 
  onClose: () => void; 
  onEdit: (c: Client) => void; 
  onDelete: (id: string) => void;
  onCreateDeal: (c: Client) => void;
  onCreateTask: (c: Client) => void;
  getDealsByClient: (clientId: string) => any[];
  getTasksByRelation: (type: string, id: string) => any[];
  navigateToDeal: (dealId: string) => void;
  setCurrentPage: (page: string) => void;
}) {
  const clientDeals = getDealsByClient(client.id);
  const clientTasks = getTasksByRelation('client', client.id);
  
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white z-50 flex flex-col animate-slide-in shadow-2xl border-l"
      style={{ borderLeftColor: 'rgba(139, 92, 246, 0.1)' }}
    >
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-5 pb-4 shrink-0"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-violet-200 text-[11px] font-medium uppercase tracking-widest">Perfil do Cliente</span>
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(client)} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all" title="Editar">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(client.id)} className="p-2 rounded-lg bg-white/15 hover:bg-red-500/40 text-white transition-all" title="Excluir">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
              style={{ background: getInitialsBg(client.name, client.type) }}
            >
              {client.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{client.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white')}>
                  <div className={cn('w-1.5 h-1.5 rounded-full', statusConfig[client.status].dot)} />
                  {statusConfig[client.status].label}
                </span>
                <span className="text-violet-200 text-[12px]">{client.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Lead Score */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> Lead Score
            </span>
            <span className="text-xl font-bold text-slate-900">{client.score}<span className="text-sm text-slate-400">/100</span></span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${client.score}%`,
                background: client.score >= 70
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : client.score >= 40
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'linear-gradient(90deg, #ef4444, #dc2626)',
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {client.score >= 70 ? '🟢 Altamente qualificado' : client.score >= 40 ? '🟡 Em qualificação' : '🔴 Necessita atenção'}
          </p>
        </div>

        {/* Value Card */}
        <div className="rounded-xl p-4 border"
          style={{ background: 'linear-gradient(135deg, #f5f3ff, #eef2ff)', borderColor: 'rgba(139, 92, 246, 0.15)' }}
        >
          <p className="text-[12px] font-semibold text-violet-600 mb-1">Valor Estimado</p>
          <p className="text-2xl font-bold text-violet-800">{formatCurrency(client.estimatedValue)}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onCreateDeal(client)}
            className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
          >
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] font-semibold text-emerald-700">Nova Negociação</span>
          </button>
          <button
            onClick={() => onCreateTask(client)}
            className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span className="text-[12px] font-semibold text-blue-700">Nova Tarefa</span>
          </button>
        </div>

        {/* Related Deals */}
        {clientDeals.length > 0 && (
          <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f0ff' }}>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Negociações ({clientDeals.length})
            </p>
            <div className="space-y-2">
              {clientDeals.map(deal => (
                <button
                  key={deal.id}
                  onClick={() => navigateToDeal(deal.id)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-violet-50 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700 truncate">{deal.title}</p>
                    <p className="text-[11px] text-slate-400">{formatCurrency(deal.value)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Tasks */}
        {clientTasks.length > 0 && (
          <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f0ff' }}>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" /> Tarefas ({clientTasks.length})
            </p>
            <div className="space-y-2">
              {clientTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setCurrentPage('tasks')}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700 truncate">{task.title}</p>
                    <p className="text-[11px] text-slate-400">{task.dueDate}</p>
                  </div>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0',
                    task.status === 'done' ? 'bg-green-100 text-green-700' :
                    task.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  )}>
                    {task.status === 'done' ? 'Concluída' : task.status === 'in_progress' ? 'Em progresso' : 'A fazer'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-white rounded-xl p-4 border space-y-3" style={{ borderColor: '#f1f0ff' }}>
          <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Contato</h4>
          {[
            { icon: Mail, label: client.email },
            { icon: Phone, label: client.phone },
            { icon: client.type === 'PJ' ? Building2 : User, label: client.document },
          ].map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-[13px] text-slate-700 truncate">{label}</span>
            </div>
          ))}
        </div>

        {/* Responsible */}
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f0ff' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
          >
            {client.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] text-slate-400">Responsável</p>
            <p className="text-[13.5px] font-semibold text-slate-800 truncate">{client.assignedTo}</p>
          </div>
        </div>

        {/* Tags */}
        {client.tags.length > 0 && (
          <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f0ff' }}>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {client.tags.map(tag => (
                <span key={tag} className="text-[12px] px-3 py-1 rounded-full font-semibold border"
                  style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#e9d5ff' }}
                >{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f0ff' }}>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Notas</p>
            <p className="text-[13px] text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100">{client.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f0ff' }}>
          <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-4">Timeline</p>
          <div className="space-y-0">
            {[
              { time: 'Hoje, 10:32', text: 'Mensagem recebida via WhatsApp', color: '#10b981' },
              { time: 'Ontem, 15:00', text: 'Proposta enviada por email', color: '#8b5cf6' },
              { time: '12/07/2024', text: 'Reunião de qualificação', color: '#3b82f6' },
              { time: client.createdAt, text: 'Cliente cadastrado no sistema', color: '#94a3b8' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ backgroundColor: item.color }} />
                  {i < 3 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: '#f1f5f9', minHeight: '20px' }} />}
                </div>
                <div className="pb-1 min-w-0">
                  <p className="text-[11px] text-slate-400">{item.time}</p>
                  <p className="text-[13px] text-slate-700 mt-0.5">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-slate-50/80 flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(client)}
          className="flex-1 py-2.5 text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
        >
          <Edit3 className="w-4 h-4" /> Editar
        </button>
        <button 
          onClick={() => onCreateDeal(client)}
          className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all bg-white"
        >
          <Target className="w-4 h-4" /> Negociação
        </button>
      </div>
    </div>
  );
}

function EditClientModal({ client, onClose, onSave }: {
  client: Client; onClose: () => void; onSave: (c: Client) => void;
}) {
  const { teamMembers } = useApp();
  
  const [formData, setFormData] = useState({
    name: client.name, email: client.email, phone: client.phone,
    document: client.document, type: client.type, status: client.status,
    tags: client.tags.join(', '), score: client.score,
    estimatedValue: client.estimatedValue, assignedTo: client.assignedTo,
    notes: client.notes,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Nome é obrigatório';
    if (!formData.email.trim()) e.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email inválido';
    if (!formData.phone.trim()) e.phone = 'Telefone é obrigatório';
    if (!formData.document.trim()) e.document = 'Documento é obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      onSave({
        ...client,
        name: formData.name, email: formData.email, phone: formData.phone,
        document: formData.document, type: formData.type as 'PF' | 'PJ',
        status: formData.status as Client['status'],
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        score: Number(formData.score), estimatedValue: Number(formData.estimatedValue),
        assignedTo: formData.assignedTo, notes: formData.notes,
      });
      setSaving(false);
    }, 600);
  };

  const inputClass = (field: string) => cn(
    'w-full px-3.5 py-2.5 border rounded-xl text-[13px] focus:outline-none transition-all',
    errors[field] ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-violet-400'
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden px-5 py-4 flex items-center justify-between shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Editar Cliente</h2>
              <p className="text-violet-200 text-[11px]">Atualize as informações do contato</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Nome *</label>
              <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className={inputClass('name')} placeholder="Nome completo ou razão social" />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Email *</label>
              <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className={inputClass('email')} placeholder="email@empresa.com" />
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Telefone *</label>
              <input type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className={inputClass('phone')} placeholder="(11) 99999-9999" />
              {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Documento *</label>
              <input type="text" value={formData.document} onChange={e => handleChange('document', e.target.value)} className={inputClass('document')} placeholder="CPF ou CNPJ" />
              {errors.document && <p className="text-[11px] text-red-500 mt-1">{errors.document}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Tipo</label>
              <select value={formData.type} onChange={e => handleChange('type', e.target.value)} className={inputClass('type')}>
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Status</label>
              <select value={formData.status} onChange={e => handleChange('status', e.target.value)} className={inputClass('status')}>
                {(Object.entries(statusConfig) as [Client['status'], { label: string }][]).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Responsável</label>
              <select value={formData.assignedTo} onChange={e => handleChange('assignedTo', e.target.value)} className={inputClass('assignedTo')}>
                {teamMembers.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Lead Score (0-100)</label>
              <input type="number" min="0" max="100" value={formData.score} onChange={e => handleChange('score', parseInt(e.target.value) || 0)} className={inputClass('score')} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Valor Estimado (R$)</label>
              <input type="number" min="0" value={formData.estimatedValue} onChange={e => handleChange('estimatedValue', parseInt(e.target.value) || 0)} className={inputClass('estimatedValue')} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Tags (separadas por vírgula)</label>
              <input type="text" value={formData.tags} onChange={e => handleChange('tags', e.target.value)} className={inputClass('tags')} placeholder="VIP, Enterprise, Parceiro..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Notas</label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} className={cn(inputClass('notes'), 'resize-none')} placeholder="Observações sobre o cliente..." />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-4 border-t border-slate-100 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <XCircle className="w-4 h-4" /> Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</>
            ) : (
              <><Save className="w-4 h-4" /> Salvar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
