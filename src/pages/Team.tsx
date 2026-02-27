import React, { useState } from 'react';
import { 
  Users, Search, Edit2, Trash2, X,
  Mail, Phone, Calendar, Shield, CheckCircle,
  UserPlus, ChevronRight, Target, TrendingUp,
  Building
} from 'lucide-react';
import { useApp, TeamMember } from '../context/AppContext';

const roleLabels: Record<string, string> = {
  owner: 'Proprietário',
  admin: 'Administrador',
  vendedor: 'Vendedor',
  atendimento: 'Atendimento',
  financeiro: 'Financeiro'
};

const permissionLabels: Record<string, string> = {
  view_clients: 'Ver Clientes',
  edit_clients: 'Editar Clientes',
  delete_clients: 'Excluir Clientes',
  view_deals: 'Ver Negociações',
  edit_deals: 'Editar Negociações',
  delete_deals: 'Excluir Negociações',
  view_tasks: 'Ver Tarefas',
  edit_tasks: 'Editar Tarefas',
  view_reports: 'Ver Relatórios',
  export_data: 'Exportar Dados',
  manage_users: 'Gerenciar Usuários',
  all: 'Acesso Total',
  view_all_clients: 'Ver Todos os Clientes',
  view_own_clients: 'Ver Próprios Clientes',
  manage_team: 'Gerenciar Equipe',
  access_settings: 'Acessar Configurações',
  view_dashboard: 'Ver Dashboard',
  view_conversations: 'Ver Conversas',
  send_messages: 'Enviar Mensagens',
  create_tasks: 'Criar Tarefas',
  create_deals: 'Criar Negociações',
  create_clients: 'Criar Clientes'
};

const roleColors: Record<string, string> = {
  owner: 'from-amber-500 to-orange-500',
  admin: 'from-violet-500 to-purple-500',
  vendedor: 'from-emerald-500 to-green-500',
  atendimento: 'from-blue-500 to-cyan-500',
  financeiro: 'from-pink-500 to-rose-500'
};

const roleBgColors: Record<string, string> = {
  owner: 'bg-amber-100 text-amber-700',
  admin: 'bg-violet-100 text-violet-700',
  vendedor: 'bg-emerald-100 text-emerald-700',
  atendimento: 'bg-blue-100 text-blue-700',
  financeiro: 'bg-pink-100 text-pink-700'
};

const Team: React.FC = () => {
  const { 
    teamMembers, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember,
    getTasksByTeamMember,
    getClientsByTeamMember,
    getDealsByTeamMember,
    selectedTeamMemberId,
    setSelectedTeamMemberId
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  const selectedMember = teamMembers.find(m => m.id === selectedTeamMemberId);
  
  // Filter members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Stats
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const totalTasks = teamMembers.reduce((acc, m) => acc + getTasksByTeamMember(m.name).length, 0);
  const totalDeals = teamMembers.reduce((acc, m) => acc + getDealsByTeamMember(m.name).length, 0);
  
  const handleClosePanel = () => {
    setSelectedTeamMemberId(null);
  };
  
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsCreateModalOpen(true);
  };
  
  const handleDeleteMember = (id: string) => {
    if (confirm('Tem certeza que deseja remover este membro da equipe?')) {
      deleteTeamMember(id);
      if (selectedTeamMemberId === id) {
        setSelectedTeamMemberId(null);
      }
    }
  };

  return (
    <div className="w-full min-h-full p-5 lg:p-7 space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => {
            setEditingMember(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
        >
          <UserPlus className="w-4 h-4" />
          Adicionar Membro
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total da Equipe</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{teamMembers.length}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Membros Ativos</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{activeMembers}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Tarefas Atribuídas</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{totalTasks}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Negociações Ativas</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{totalDeals}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            >
              <option value="all">Todos os Cargos</option>
              <option value="owner">Proprietário</option>
              <option value="admin">Administrador</option>
              <option value="vendedor">Vendedor</option>
              <option value="atendimento">Atendimento</option>
              <option value="financeiro">Financeiro</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const memberTasks = getTasksByTeamMember(member.name);
          const memberClients = getClientsByTeamMember(member.name);
          const memberDeals = getDealsByTeamMember(member.name);
          const pendingTasks = memberTasks.filter(t => t.status !== 'done').length;
          
          return (
            <div
              key={member.id}
              onClick={() => setSelectedTeamMemberId(member.id)}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                selectedTeamMemberId === member.id 
                  ? 'border-violet-500 ring-4 ring-violet-500/20' 
                  : 'border-gray-100 hover:border-violet-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${roleColors[member.role]} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleBgColors[member.role]}`}>
                      {roleLabels[member.role]}
                    </span>
                  </div>
                </div>
                
                <div className={`w-3 h-3 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                {member.department && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{member.department}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{memberClients.length}</p>
                  <p className="text-xs text-gray-500">Clientes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{memberDeals.length}</p>
                  <p className="text-xs text-gray-500">Negociações</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${pendingTasks > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{pendingTasks}</p>
                  <p className="text-xs text-gray-500">Tarefas</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditMember(member);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMember(member.id);
                  }}
                  className="flex items-center justify-center p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">Nenhum membro encontrado</h3>
          <p className="text-gray-400 mt-1">Tente ajustar os filtros ou adicione um novo membro</p>
        </div>
      )}
      
      {/* Quick View Panel Backdrop */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={handleClosePanel}
        />
      )}
      
      {/* Quick View Panel */}
      {selectedMember && (
        <TeamMemberDetailPanel
          member={selectedMember}
          onClose={handleClosePanel}
          onEdit={() => handleEditMember(selectedMember)}
          onDelete={() => handleDeleteMember(selectedMember.id)}
        />
      )}
      
      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <TeamMemberModal
          member={editingMember}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingMember(null);
          }}
          onSave={(data) => {
            if (editingMember) {
              updateTeamMember(editingMember.id, data);
            } else {
              addTeamMember(data as any);
            }
            setIsCreateModalOpen(false);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
};

// Team Member Detail Panel
interface TeamMemberDetailPanelProps {
  member: TeamMember;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamMemberDetailPanel: React.FC<TeamMemberDetailPanelProps> = ({ member, onClose, onEdit, onDelete }) => {
  const { getTasksByTeamMember, getClientsByTeamMember, getDealsByTeamMember, navigateToClient, navigateToDeal, navigateToTask } = useApp();
  
  const memberTasks = getTasksByTeamMember(member.name);
  const memberClients = getClientsByTeamMember(member.name);
  const memberDeals = getDealsByTeamMember(member.name);
  
  const completedTasks = memberTasks.filter(t => t.status === 'done').length;
  const pendingTasks = memberTasks.filter(t => t.status !== 'done').length;
  const totalDealValue = memberDeals.reduce((acc, d) => acc + d.value, 0);
  
  return (
    <div className="fixed top-0 right-0 w-full max-w-lg h-full bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shadow-xl`}>
              {member.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/80">{roleLabels[member.role]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'active' 
                    ? 'bg-emerald-500/30 text-emerald-100' 
                    : 'bg-gray-500/30 text-gray-200'
                }`}>
                  {member.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
            <p className="text-sm text-violet-600 font-medium">Clientes</p>
            <p className="text-2xl font-bold text-violet-700">{memberClients.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-sm text-emerald-600 font-medium">Negociações</p>
            <p className="text-2xl font-bold text-emerald-700">{memberDeals.length}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <p className="text-sm text-amber-600 font-medium">Tarefas</p>
            <p className="text-2xl font-bold text-amber-700">{pendingTasks}</p>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Informações de Contato</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{member.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Phone className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm font-medium text-gray-900">{member.phone}</p>
            </div>
          </div>
          {member.department && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Building className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Departamento</p>
                <p className="text-sm font-medium text-gray-900">{member.department}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Data de Contratação</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(member.hireDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Performance */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-gray-500">Tarefas Concluídas</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-violet-500" />
                <span className="text-xs text-gray-500">Valor em Deals</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {totalDealValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
        
        {/* Recent Clients */}
        {memberClients.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clientes Atribuídos
            </h3>
            <div className="space-y-2">
              {memberClients.slice(0, 3).map(client => (
                <div
                  key={client.id}
                  onClick={() => navigateToClient(client.id)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-violet-200 cursor-pointer transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              {memberClients.length > 3 && (
                <p className="text-sm text-center text-violet-600 font-medium">
                  +{memberClients.length - 3} mais clientes
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Recent Deals */}
        {memberDeals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Negociações Ativas
            </h3>
            <div className="space-y-2">
              {memberDeals.slice(0, 3).map(deal => (
                <div
                  key={deal.id}
                  onClick={() => navigateToDeal(deal.id)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 cursor-pointer transition-all hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{deal.title}</p>
                    <p className="text-sm text-emerald-600 font-semibold">
                      {deal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recent Tasks */}
        {memberTasks.filter(t => t.status !== 'done').length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Tarefas Pendentes
            </h3>
            <div className="space-y-2">
              {memberTasks.filter(t => t.status !== 'done').slice(0, 3).map(task => (
                <div
                  key={task.id}
                  onClick={() => navigateToTask(task.id)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-amber-200 cursor-pointer transition-all hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority === 'urgent' ? 'Urgente' :
                     task.priority === 'high' ? 'Alta' :
                     task.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Permissions */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Permissões
          </h3>
          <div className="flex flex-wrap gap-2">
            {member.permissions.length > 0 ? (
              member.permissions.map((permission, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium"
                >
                  {permissionLabels[permission] || permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500 italic">Nenhuma permissão atribuída</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onEdit}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Editar Membro
        </button>
      </div>
    </div>
  );
};

// Team Member Modal
interface TeamMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
  onSave: (data: Partial<TeamMember>) => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    role: member?.role || 'vendedor',
    status: member?.status || 'active',
    department: member?.department || '',
    hireDate: member?.hireDate || new Date().toISOString().split('T')[0],
    permissions: member?.permissions || []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  
  const allPermissions = [
    { id: 'view_clients', label: 'Ver Clientes' },
    { id: 'edit_clients', label: 'Editar Clientes' },
    { id: 'delete_clients', label: 'Excluir Clientes' },
    { id: 'view_deals', label: 'Ver Negociações' },
    { id: 'edit_deals', label: 'Editar Negociações' },
    { id: 'delete_deals', label: 'Excluir Negociações' },
    { id: 'view_tasks', label: 'Ver Tarefas' },
    { id: 'edit_tasks', label: 'Editar Tarefas' },
    { id: 'view_reports', label: 'Ver Relatórios' },
    { id: 'export_data', label: 'Exportar Dados' },
    { id: 'manage_users', label: 'Gerenciar Usuários' },
    { id: 'all', label: 'Acesso Total' }
  ];
  
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSaving(true);
    setTimeout(() => {
      onSave(formData as any);
      setSaving(false);
    }, 500);
  };
  
  const togglePermission = (permissionId: string) => {
    if (permissionId === 'all') {
      if (formData.permissions.includes('all')) {
        setFormData({ ...formData, permissions: [] });
      } else {
        setFormData({ ...formData, permissions: ['all'] });
      }
    } else {
      if (formData.permissions.includes(permissionId)) {
        setFormData({
          ...formData,
          permissions: formData.permissions.filter(p => p !== permissionId)
        });
      } else {
        setFormData({
          ...formData,
          permissions: [...formData.permissions.filter(p => p !== 'all'), permissionId]
        });
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                {member ? <Edit2 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {member ? 'Editar Membro' : 'Adicionar Membro'}
                </h2>
                <p className="text-white/70 text-sm">
                  {member ? 'Atualize as informações do membro' : 'Preencha os dados do novo membro'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500`}
                placeholder="Nome do membro"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500`}
                placeholder="email@exemplo.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500`}
                placeholder="(00) 00000-0000"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                placeholder="Ex: Vendas, Suporte"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              >
                <option value="vendedor">Vendedor</option>
                <option value="atendimento">Atendimento</option>
                <option value="financeiro">Financeiro</option>
                <option value="admin">Administrador</option>
                <option value="owner">Proprietário</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Contratação
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
          </div>
          
          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissões
            </label>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allPermissions.map(permission => (
                  <label
                    key={permission.id}
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.permissions.includes(permission.id)
                        ? 'bg-violet-100 border-violet-300'
                        : 'bg-white border-gray-200 hover:border-violet-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      formData.permissions.includes(permission.id)
                        ? 'bg-violet-500'
                        : 'border-2 border-gray-300'
                    }`}>
                      {formData.permissions.includes(permission.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {member ? 'Salvar Alterações' : 'Adicionar Membro'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
