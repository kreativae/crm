import { useState } from 'react';
import {
  Users as UsersIcon,
  Palette,
  Settings as SettingsIcon,
  Shield,
  Webhook,
  Key,
  Plug,
  Target,
  Columns,
  Globe,
  Mail,
  ChevronRight,
  Check,
  X,
  Edit3,
  UserPlus,
  Trash2,
  Plus,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Goal, PipelineStage } from '../context/AppContext';
import { cn } from '../utils/cn';

type UserRole = 'owner' | 'admin' | 'vendedor' | 'atendimento' | 'financeiro';

type SettingsTab = 'users' | 'whitelabel' | 'general' | 'permissions' | 'webhooks' | 'api' | 'integrations' | 'goals' | 'pipeline';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType; group: string }[] = [
  { id: 'users', label: 'Usuários', icon: UsersIcon, group: 'Equipe' },
  { id: 'permissions', label: 'Permissões', icon: Shield, group: 'Equipe' },
  { id: 'whitelabel', label: 'White Label', icon: Palette, group: 'Personalização' },
  { id: 'pipeline', label: 'Pipeline', icon: Columns, group: 'Personalização' },
  { id: 'goals', label: 'Metas', icon: Target, group: 'Personalização' },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook, group: 'Integrações' },
  { id: 'api', label: 'API Keys', icon: Key, group: 'Integrações' },
  { id: 'integrations', label: 'Integrações', icon: Plug, group: 'Integrações' },
  { id: 'general', label: 'Geral', icon: SettingsIcon, group: 'Sistema' },
];

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  owner: { label: 'Owner', color: 'bg-violet-100 text-violet-700' },
  admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
  vendedor: { label: 'Vendedor', color: 'bg-emerald-100 text-emerald-700' },
  atendimento: { label: 'Atendimento', color: 'bg-amber-100 text-amber-700' },
  financeiro: { label: 'Financeiro', color: 'bg-gray-100 text-gray-700' },
};

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

  const groups = [...new Set(tabs.map(t => t.group))];

  return (
    <div className="w-full min-h-full p-5 lg:p-7 flex flex-col">
      <div className="flex-1 flex gap-6 overflow-hidden" style={{ minHeight: 'calc(100vh - 140px)' }}>
        {/* Sidebar */}
        <div className="w-56 shrink-0 overflow-y-auto">
          {groups.map((group) => (
            <div key={group} className="mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">{group}</p>
              {tabs.filter(t => t.group === group).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-0.5',
                      activeTab === tab.id
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'whitelabel' && <WhiteLabelTab />}
          {activeTab === 'permissions' && <PermissionsTab />}
          {activeTab === 'pipeline' && <PipelineTab />}
          {activeTab === 'goals' && <GoalsTab />}
          {activeTab === 'webhooks' && <WebhooksTab />}
          {activeTab === 'api' && <APIKeysTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'general' && <GeneralTab />}
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, addNotification } = useApp();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof teamMembers[0] | null>(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'vendedor' as UserRole });

  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email) {
      addNotification('error', 'Erro', 'Preencha todos os campos');
      return;
    }
    addTeamMember({
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      phone: '',
      department: '',
      hireDate: new Date().toISOString().split('T')[0],
      permissions: [],
      status: 'active',
    });
    setInviteForm({ name: '', email: '', role: 'vendedor' });
    setShowInviteModal(false);
  };

  const handleEdit = (user: typeof teamMembers[0]) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      updateTeamMember(editingUser.id, editingUser);
      setShowEditModal(false);
      setEditingUser(null);
    }
  };

  const handleDelete = (user: typeof teamMembers[0]) => {
    if (confirm(`Deseja realmente excluir ${user.name}?`)) {
      deleteTeamMember(user.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestão de Usuários</h2>
          <p className="text-sm text-gray-500">Gerencie os membros da sua equipe</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200"
        >
          <UserPlus className="w-4 h-4" /> Convidar
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((user) => (
          <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-colors">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br', user.status === 'active' ? 'from-violet-500 to-indigo-500' : 'from-gray-400 to-gray-500')}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                {user.status !== 'active' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">Inativo</span>}
              </div>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', roleConfig[user.role].color)}>
              {roleConfig[user.role].label}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => handleEdit(user)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(user)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <h3 className="text-lg font-bold text-white">Convidar Usuário</h3>
              <p className="text-violet-200 text-sm">Adicione um novo membro à equipe</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome *</label>
                <input
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="email@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cargo</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                >
                  <option value="admin">Admin</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="atendimento">Atendimento</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleInvite} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700">
                Enviar Convite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <h3 className="text-lg font-bold text-white">Editar Usuário</h3>
              <p className="text-violet-200 text-sm">Altere os dados do membro</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome *</label>
                <input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cargo</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value as UserRole } : null)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="atendimento">Atendimento</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <input
                  type="checkbox"
                  checked={editingUser.status === 'active'}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, status: e.target.checked ? 'active' : 'inactive' } : null)}
                  className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Usuário ativo</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WhiteLabelTab() {
  const { addNotification } = useApp();
  const [brandName, setBrandName] = useState('NexusCRM');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');
  const [secondaryColor, setSecondaryColor] = useState('#6366f1');
  const [domain, setDomain] = useState('');
  const [smtpServer, setSmtpServer] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    addNotification('success', 'White Label salvo', 'As configurações de marca foram atualizadas com sucesso!');
  };

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/svg+xml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        addNotification('success', 'Logo carregada', `Arquivo "${file.name}" foi carregado com sucesso!`);
      }
    };
    input.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">White Label</h2>
        <p className="text-sm text-gray-500">Personalize a aparência do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Marca</label>
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
            <div 
              onClick={handleLogoUpload}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-violet-300 transition-colors cursor-pointer"
            >
              <p className="text-sm text-gray-500">Clique para upload ou arraste</p>
              <p className="text-xs text-gray-400 mt-1">PNG, SVG até 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor Primária</label>
              <div className="flex items-center gap-2">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor Secundária</label>
              <div className="flex items-center gap-2">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                <input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gray-400" /> Domínio Personalizado
            </label>
            <input 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="app.suaempresa.com" 
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-gray-400" /> Configuração SMTP
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input 
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
                placeholder="smtp.servidor.com" 
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20" 
              />
              <input 
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="Porta" 
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20" 
              />
              <input 
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="Usuário" 
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20" 
              />
              <input 
                type="password" 
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                placeholder="Senha" 
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20" 
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pré-visualização</label>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="h-12 flex items-center px-4 gap-3" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                {brandName.charAt(0)}
              </div>
              <span className="text-white font-bold text-sm">{brandName}</span>
            </div>
            <div className="p-4 bg-gray-50 min-h-[200px]">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="h-3 w-24 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
                <div className="h-2 w-40 bg-gray-200 rounded-full mt-3" />
                <div className="h-2 w-32 bg-gray-200 rounded-full mt-2" />
                <button className="mt-4 px-4 py-2 rounded-lg text-white text-xs font-medium" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                  Botão Exemplo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Salvar Alterações
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PermissionsTab() {
  const { addNotification } = useApp();
  const [permissions] = useState([
    { key: 'view_all_clients', label: 'Ver todos os clientes' },
    { key: 'view_own_clients', label: 'Ver apenas próprios clientes' },
    { key: 'export_data', label: 'Exportar dados' },
    { key: 'manage_users', label: 'Gerenciar usuários' },
    { key: 'manage_pipeline', label: 'Configurar pipeline' },
    { key: 'view_dashboard', label: 'Ver dashboard' },
    { key: 'manage_integrations', label: 'Gerenciar integrações' },
  ]);

  const roles: UserRole[] = ['owner', 'admin', 'vendedor', 'atendimento', 'financeiro'];
  const [rolePerms, setRolePerms] = useState<Record<UserRole, string[]>>({
    owner: permissions.map(p => p.key),
    admin: permissions.map(p => p.key).filter(k => k !== 'manage_users'),
    vendedor: ['view_own_clients', 'view_dashboard'],
    atendimento: ['view_own_clients'],
    financeiro: ['view_dashboard', 'export_data'],
  });

  const togglePermission = (role: UserRole, permKey: string) => {
    setRolePerms(prev => {
      const current = prev[role] || [];
      const newPerms = current.includes(permKey) 
        ? current.filter(k => k !== permKey)
        : [...current, permKey];
      return { ...prev, [role]: newPerms };
    });
    addNotification('success', 'Permissão atualizada', 'A configuração de permissão foi alterada.');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Permissões por Nível</h2>
        <p className="text-sm text-gray-500">Configure o que cada nível pode acessar</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 py-3 px-3">Permissão</th>
              {roles.map(r => (
                <th key={r} className="text-center text-xs font-semibold py-3 px-3">
                  <span className={cn('px-2 py-1 rounded-full', roleConfig[r].color)}>{roleConfig[r].label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map(perm => (
              <tr key={perm.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="text-sm text-gray-700 py-3 px-3">{perm.label}</td>
                {roles.map(r => (
                  <td key={r} className="text-center py-3 px-3">
                    <button
                      onClick={() => togglePermission(r, perm.key)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {rolePerms[r]?.includes(perm.key) ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PipelineTab() {
  const { pipelineStages, addPipelineStage, updatePipelineStage, deletePipelineStage, reorderPipelineStages, addNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStage, setNewStage] = useState({ name: '', color: '#3b82f6' });
  const [draggedStage, setDraggedStage] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, stageId: string) => {
    setDraggedStage(stageId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', stageId);
    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    setDraggedStage(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (stageId !== draggedStage) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    if (draggedStage && draggedStage !== targetStageId) {
      const draggedIndex = pipelineStages.findIndex(s => s.id === draggedStage);
      const targetIndex = pipelineStages.findIndex(s => s.id === targetStageId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newStages = [...pipelineStages];
        const [removed] = newStages.splice(draggedIndex, 1);
        newStages.splice(targetIndex, 0, removed);
        
        // Update order for each stage
        const reorderedStages = newStages.map((stage, index) => ({
          ...stage,
          order: index + 1
        }));
        
        reorderPipelineStages(reorderedStages);
        addNotification('success', 'Ordem atualizada', 'A ordem dos estágios foi alterada com sucesso!');
      }
    }
    setDraggedStage(null);
    setDragOverStage(null);
  };

  const handleAddStage = () => {
    if (!newStage.name) {
      addNotification('error', 'Erro', 'Informe o nome do estágio');
      return;
    }
    addPipelineStage({
      name: newStage.name,
      color: newStage.color,
      order: pipelineStages.length + 1
    });
    setNewStage({ name: '', color: '#3b82f6' });
    setShowAddModal(false);
  };

  const handleUpdateStage = (id: string, updates: Partial<PipelineStage>) => {
    updatePipelineStage(id, updates);
  };

  const handleDeleteStage = (id: string) => {
    if (confirm('Deseja realmente excluir este estágio?')) {
      deletePipelineStage(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Pipeline de Vendas</h2>
          <p className="text-sm text-gray-500">Configure os estágios do seu pipeline. Arraste para reordenar.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4" /> Adicionar Estágio
        </button>
      </div>

      {/* Drag instruction */}
      <div className="mb-4 p-3 rounded-xl bg-violet-50 border border-violet-100 flex items-center gap-3">
        <GripVertical className="w-5 h-5 text-violet-400" />
        <p className="text-sm text-violet-700">
          <span className="font-medium">Dica:</span> Arraste e solte os estágios para reorganizar a ordem das colunas no Pipeline CRM
        </p>
      </div>

      <div className="space-y-2">
        {pipelineStages.map((stage, i) => (
          <div 
            key={stage.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, stage.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 group",
              dragOverStage === stage.id 
                ? "border-violet-400 bg-violet-50 scale-[1.02] shadow-lg" 
                : draggedStage === stage.id
                  ? "border-violet-300 bg-violet-25 opacity-50"
                  : "border-gray-100 hover:border-violet-200 hover:shadow-md bg-white"
            )}
          >
            <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-violet-500 transition-colors">
              <GripVertical className="w-5 h-5" />
            </div>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: stage.color }}
            >
              {i + 1}
            </div>
            <input 
              type="color" 
              value={stage.color} 
              onChange={(e) => handleUpdateStage(stage.id, { color: e.target.value })}
              className="w-8 h-8 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-violet-300 transition-colors" 
            />
            <input 
              value={stage.name} 
              onChange={(e) => handleUpdateStage(stage.id, { name: e.target.value })}
              className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-lg px-2 py-1" 
            />
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-gray-400 mr-2">Arraste para mover</span>
              <button 
                onClick={() => handleDeleteStage(stage.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Stage Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <h3 className="text-lg font-bold text-white">Novo Estágio</h3>
              <p className="text-violet-200 text-sm">Adicione um novo estágio ao pipeline</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Estágio *</label>
                <input
                  value={newStage.name}
                  onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="Ex: Qualificação"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={newStage.color} 
                    onChange={(e) => setNewStage(prev => ({ ...prev, color: e.target.value }))}
                    className="w-10 h-10 rounded-lg border-0 cursor-pointer" 
                  />
                  <input 
                    value={newStage.color} 
                    onChange={(e) => setNewStage(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20" 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleAddStage} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalsTab() {
  const { goals, teamMembers, addGoal, updateGoal, deleteGoal, addNotification, getDealsByTeamMember } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({ memberId: '', targetValue: 0 });
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Filter active team members with seller role
  const salesTeam = teamMembers.filter(m => m.status === 'active' && (m.role === 'vendedor' || m.role === 'admin' || m.role === 'owner'));

  const handleAddGoal = () => {
    const member = teamMembers.find(m => m.id === newGoal.memberId);
    if (!member || newGoal.targetValue <= 0) {
      addNotification('error', 'Erro', 'Selecione um membro e informe um valor válido');
      return;
    }
    
    // Check if goal already exists for this member this month
    const existingGoal = goals.find(g => g.memberId === newGoal.memberId && g.month === currentMonth);
    if (existingGoal) {
      addNotification('error', 'Erro', 'Já existe uma meta para este membro neste mês');
      return;
    }

    // Calculate current value from closed deals
    const closedDeals = getDealsByTeamMember(member.name).filter(d => d.stage === 'closed');
    const currentValue = closedDeals.reduce((sum, d) => sum + d.value, 0);

    addGoal({
      memberId: member.id,
      memberName: member.name,
      targetValue: newGoal.targetValue,
      currentValue,
      month: currentMonth
    });
    setNewGoal({ memberId: '', targetValue: 0 });
    setShowAddModal(false);
  };

  const handleUpdateGoal = () => {
    if (editingGoal) {
      updateGoal(editingGoal.id, { targetValue: editingGoal.targetValue });
      setEditingGoal(null);
    }
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Deseja realmente excluir esta meta?')) {
      deleteGoal(id);
    }
  };

  // Calculate real current values from deals
  const goalsWithRealValues = goals.map(goal => {
    const closedDeals = getDealsByTeamMember(goal.memberName).filter(d => d.stage === 'closed');
    const realCurrentValue = closedDeals.reduce((sum, d) => sum + d.value, 0);
    return { ...goal, currentValue: realCurrentValue };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Metas Mensais</h2>
          <p className="text-sm text-gray-500">Defina metas para sua equipe - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4" /> Nova Meta
        </button>
      </div>

      {goalsWithRealValues.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Target className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="font-medium">Nenhuma meta definida</p>
          <p className="text-sm">Adicione metas para acompanhar a performance da equipe</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goalsWithRealValues.map((goal) => {
            const pct = Math.round((goal.currentValue / goal.targetValue) * 100);
            const member = teamMembers.find(m => m.id === goal.memberId);
            return (
              <div key={goal.id} className="p-4 rounded-xl border border-gray-100 hover:border-violet-200 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-violet-500 to-indigo-500')}>
                      {goal.memberName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{goal.memberName}</span>
                      {member && <span className={cn('ml-2 text-[10px] px-2 py-0.5 rounded-full', roleConfig[member.role].color)}>{roleConfig[member.role].label}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-lg font-bold', pct >= 100 ? 'text-emerald-600' : pct >= 70 ? 'text-amber-600' : 'text-gray-900')}>{pct}%</span>
                    <button 
                      onClick={() => setEditingGoal(goal)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 mb-2 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : pct >= 40 ? 'bg-violet-500' : 'bg-red-500')}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>R$ {(goal.currentValue / 1000).toFixed(0)}k realizado</span>
                  <span>Meta: R$ {(goal.targetValue / 1000).toFixed(0)}k</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <h3 className="text-lg font-bold text-white">Nova Meta</h3>
              <p className="text-violet-200 text-sm">Defina uma meta para um membro da equipe</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Membro da Equipe *</label>
                <select
                  value={newGoal.memberId}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, memberId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                >
                  <option value="">Selecione um membro</option>
                  {salesTeam.filter(m => !goals.find(g => g.memberId === m.id && g.month === currentMonth)).map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta (R$) *</label>
                <input
                  type="number"
                  value={newGoal.targetValue || ''}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="100000"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleAddGoal} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700">
                Criar Meta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingGoal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <h3 className="text-lg font-bold text-white">Editar Meta</h3>
              <p className="text-violet-200 text-sm">{editingGoal.memberName}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta (R$) *</label>
                <input
                  type="number"
                  value={editingGoal.targetValue || ''}
                  onChange={(e) => setEditingGoal(prev => prev ? { ...prev, targetValue: Number(e.target.value) } : null)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setEditingGoal(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleUpdateGoal} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WebhooksTab() {
  const { webhooks, addWebhook, updateWebhook, deleteWebhook, addNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', events: [] as string[], active: true });
  
  const availableEvents = [
    'lead.created', 'lead.updated', 'lead.deleted',
    'deal.created', 'deal.updated', 'deal.won', 'deal.lost',
    'task.created', 'task.completed',
    'message.received', 'message.sent'
  ];

  const handleAddWebhook = () => {
    if (!newWebhook.url || newWebhook.events.length === 0) {
      addNotification('error', 'Erro', 'Preencha a URL e selecione ao menos um evento');
      return;
    }
    addWebhook(newWebhook);
    setNewWebhook({ url: '', events: [], active: true });
    setShowAddModal(false);
  };

  const toggleEvent = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event) 
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    updateWebhook(id, { active: !currentActive });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este webhook?')) {
      deleteWebhook(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Webhooks</h2>
          <p className="text-sm text-gray-500">Configure callbacks para eventos do sistema</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium"
        >
          <Webhook className="w-4 h-4" /> Novo Webhook
        </button>
      </div>

      {webhooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Webhook className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="font-medium">Nenhum webhook configurado</p>
          <p className="text-sm">Crie webhooks para integrar com sistemas externos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-4 rounded-xl border border-gray-100 hover:border-violet-200 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm text-gray-700 font-mono truncate flex-1">{wh.url}</code>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => handleToggleActive(wh.id, wh.active)}
                    className={cn('w-2 h-2 rounded-full cursor-pointer transition-colors', wh.active ? 'bg-emerald-500' : 'bg-gray-300')} 
                    title={wh.active ? 'Ativo - clique para desativar' : 'Inativo - clique para ativar'}
                  />
                  <button 
                    onClick={() => handleDelete(wh.id)}
                    className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {wh.events.map(ev => (
                  <span key={ev} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">{ev}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Webhook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <h3 className="text-lg font-bold text-white">Novo Webhook</h3>
              <p className="text-violet-200 text-sm">Configure um endpoint para receber eventos</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL do Endpoint *</label>
                <input
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="https://api.seusite.com/webhook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Eventos *</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableEvents.map(event => (
                    <label key={event} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-violet-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-xs font-mono text-gray-600">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleAddWebhook} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700">
                Criar Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function APIKeysTab() {
  const { apiKeys, addApiKey, deleteApiKey, addNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleAddKey = () => {
    if (!newKeyName) {
      addNotification('error', 'Erro', 'Informe o nome da chave');
      return;
    }
    addApiKey({ name: newKeyName });
    setNewKeyName('');
    setShowAddModal(false);
  };

  const handleRevoke = (id: string) => {
    if (confirm('Deseja realmente revogar esta chave? Esta ação não pode ser desfeita.')) {
      deleteApiKey(id);
    }
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addNotification('success', 'Copiado', 'Chave copiada para a área de transferência');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">API Keys</h2>
          <p className="text-sm text-gray-500">Gerencie chaves de acesso à API</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium"
        >
          <Key className="w-4 h-4" /> Nova Chave
        </button>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Mantenha suas chaves seguras</p>
          <p className="text-xs text-amber-700">Nunca compartilhe suas chaves de API ou as exponha em código público.</p>
        </div>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Key className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="font-medium">Nenhuma chave de API</p>
          <p className="text-sm">Crie uma chave para integrar com a API</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{apiKey.name}</span>
                <button 
                  onClick={() => handleRevoke(apiKey.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Revogar
                </button>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-gray-500 font-mono bg-gray-50 rounded-lg px-3 py-2">
                  {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/./g, '*').slice(0, 40) + '...'}
                </code>
                <button 
                  onClick={() => toggleVisibility(apiKey.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => copyKey(apiKey.key)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-4 mt-2 text-[11px] text-gray-400">
                <span>Criada: {apiKey.createdAt}</span>
                <span>Último uso: {apiKey.lastUsed || 'Nunca'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <h3 className="text-lg font-bold text-white">Nova Chave de API</h3>
              <p className="text-violet-200 text-sm">Crie uma nova chave de acesso</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Chave *</label>
                <input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="Ex: Produção, Desenvolvimento, etc."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleAddKey} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700">
                Criar Chave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface IntegrationField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'url';
  required: boolean;
  helpText?: string;
}

const integrationFields: Record<string, IntegrationField[]> = {
  int1: [ // WhatsApp Business
    { key: 'phoneNumberId', label: 'Phone Number ID', placeholder: 'Ex: 1234567890', type: 'text', required: true, helpText: 'ID do número de telefone no Meta Business' },
    { key: 'businessAccountId', label: 'Business Account ID', placeholder: 'Ex: 9876543210', type: 'text', required: true, helpText: 'ID da conta comercial do WhatsApp' },
    { key: 'accessToken', label: 'Access Token (Permanente)', placeholder: 'EAAGm0PX4ZCps...', type: 'password', required: true, helpText: 'Token de acesso permanente gerado no Meta for Developers' },
    { key: 'webhookVerifyToken', label: 'Webhook Verify Token', placeholder: 'Seu token de verificação', type: 'text', required: true, helpText: 'Token personalizado para verificar callbacks do webhook' },
    { key: 'webhookUrl', label: 'Webhook Callback URL', placeholder: 'https://api.seudominio.com/webhook/whatsapp', type: 'url', required: false, helpText: 'URL para receber mensagens (gerada automaticamente)' },
  ],
  int2: [ // Instagram
    { key: 'appId', label: 'App ID (Meta)', placeholder: 'Ex: 123456789012345', type: 'text', required: true, helpText: 'ID do aplicativo no Meta for Developers' },
    { key: 'appSecret', label: 'App Secret', placeholder: 'abc123def456...', type: 'password', required: true, helpText: 'Chave secreta do aplicativo Meta' },
    { key: 'accessToken', label: 'Access Token', placeholder: 'IGQVJx...', type: 'password', required: true, helpText: 'Token de acesso do Instagram Graph API' },
    { key: 'igBusinessAccountId', label: 'Instagram Business Account ID', placeholder: 'Ex: 17841400000000', type: 'text', required: true, helpText: 'ID da conta profissional do Instagram' },
    { key: 'webhookUrl', label: 'Webhook Callback URL', placeholder: 'https://api.seudominio.com/webhook/instagram', type: 'url', required: false, helpText: 'URL para receber notificações de mensagens' },
  ],
  int3: [ // Facebook Messenger
    { key: 'pageId', label: 'Page ID', placeholder: 'Ex: 1234567890', type: 'text', required: true, helpText: 'ID da página do Facebook' },
    { key: 'pageAccessToken', label: 'Page Access Token', placeholder: 'EAAGm0PX4ZCps...', type: 'password', required: true, helpText: 'Token de acesso da página (permanente)' },
    { key: 'appSecret', label: 'App Secret', placeholder: 'abc123def456...', type: 'password', required: true, helpText: 'Chave secreta do aplicativo para validação' },
    { key: 'verifyToken', label: 'Verify Token', placeholder: 'Seu token de verificação', type: 'text', required: true, helpText: 'Token personalizado para webhook' },
    { key: 'webhookUrl', label: 'Webhook Callback URL', placeholder: 'https://api.seudominio.com/webhook/messenger', type: 'url', required: false, helpText: 'URL para receber mensagens do Messenger' },
  ],
  int4: [ // Telegram
    { key: 'botToken', label: 'Bot Token', placeholder: '1234567890:ABCDefGhIJKlmnoPQRsTUVwxyz', type: 'password', required: true, helpText: 'Token do bot gerado pelo @BotFather' },
    { key: 'botUsername', label: 'Bot Username', placeholder: '@seubotname', type: 'text', required: false, helpText: 'Nome de usuário do bot no Telegram' },
    { key: 'webhookUrl', label: 'Webhook URL', placeholder: 'https://api.seudominio.com/webhook/telegram', type: 'url', required: true, helpText: 'URL para receber atualizações do Telegram' },
    { key: 'secretToken', label: 'Secret Token', placeholder: 'Token secreto opcional', type: 'password', required: false, helpText: 'Token para validar requisições do webhook (opcional)' },
  ],
  int5: [ // Google Calendar
    { key: 'clientId', label: 'Client ID (OAuth 2.0)', placeholder: '123456789-abc.apps.googleusercontent.com', type: 'text', required: true, helpText: 'ID do cliente OAuth 2.0 do Google Cloud Console' },
    { key: 'clientSecret', label: 'Client Secret', placeholder: 'GOCSPX-abc123...', type: 'password', required: true, helpText: 'Chave secreta do cliente OAuth 2.0' },
    { key: 'apiKey', label: 'API Key', placeholder: 'AIzaSyA...', type: 'password', required: true, helpText: 'Chave de API do Google Cloud Console' },
    { key: 'redirectUri', label: 'Redirect URI', placeholder: 'https://app.seudominio.com/auth/google/callback', type: 'url', required: true, helpText: 'URI de redirecionamento autorizada no Console' },
    { key: 'calendarId', label: 'Calendar ID (opcional)', placeholder: 'primary ou email@gmail.com', type: 'text', required: false, helpText: 'ID do calendário (use "primary" para o principal)' },
  ],
  int6: [ // Slack
    { key: 'botToken', label: 'Bot User OAuth Token', placeholder: 'xoxb-1234567890-abc...', type: 'password', required: true, helpText: 'Token do bot em OAuth & Permissions' },
    { key: 'signingSecret', label: 'Signing Secret', placeholder: 'abc123def456...', type: 'password', required: true, helpText: 'Signing Secret em Basic Information do app' },
    { key: 'appToken', label: 'App-Level Token', placeholder: 'xapp-1-abc...', type: 'password', required: false, helpText: 'Token de nível do app para Socket Mode' },
    { key: 'webhookUrl', label: 'Incoming Webhook URL', placeholder: 'https://hooks.slack.com/services/T.../B.../xxx', type: 'url', required: false, helpText: 'URL do Incoming Webhook para enviar mensagens' },
    { key: 'channelId', label: 'Channel ID', placeholder: 'C0123456789', type: 'text', required: false, helpText: 'ID do canal padrão para notificações' },
  ],
  int7: [ // Google OAuth (Login)
    { key: 'clientId', label: 'Client ID (OAuth 2.0)', placeholder: '123456789-abc.apps.googleusercontent.com', type: 'text', required: true, helpText: 'ID do cliente OAuth 2.0 criado no Google Cloud Console → APIs & Services → Credentials' },
    { key: 'clientSecret', label: 'Client Secret', placeholder: 'GOCSPX-abc123def456...', type: 'password', required: true, helpText: 'Chave secreta do cliente OAuth 2.0 gerada junto ao Client ID' },
    { key: 'redirectUri', label: 'Redirect URI (Callback)', placeholder: 'https://app.seudominio.com/auth/google/callback', type: 'url', required: true, helpText: 'URI de redirecionamento autorizada no Console do Google (deve coincidir exatamente)' },
    { key: 'scopes', label: 'Escopos (Scopes)', placeholder: 'openid email profile', type: 'text', required: true, helpText: 'Escopos de acesso separados por espaço. Mínimo recomendado: openid email profile' },
    { key: 'hostedDomain', label: 'Hosted Domain (opcional)', placeholder: 'suaempresa.com', type: 'text', required: false, helpText: 'Restringir login apenas para contas de um domínio Google Workspace específico' },
    { key: 'consentScreen', label: 'Consent Screen App Name', placeholder: 'NexusCRM', type: 'text', required: false, helpText: 'Nome do app exibido na tela de consentimento do Google (configurado no OAuth Consent Screen)' },
  ],
  int8: [ // Microsoft OAuth (Login)
    { key: 'clientId', label: 'Application (Client) ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text', required: true, helpText: 'ID do aplicativo registrado no Azure AD → App Registrations → Overview' },
    { key: 'clientSecret', label: 'Client Secret (Value)', placeholder: 'abc~DEFghIJKlmn0PQRsTUVwxyz123456', type: 'password', required: true, helpText: 'Valor do segredo criado em Certificates & Secrets → New Client Secret' },
    { key: 'tenantId', label: 'Directory (Tenant) ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text', required: true, helpText: 'ID do diretório (tenant). Use "common" para multi-tenant ou o ID específico do seu Azure AD' },
    { key: 'redirectUri', label: 'Redirect URI (Callback)', placeholder: 'https://app.seudominio.com/auth/microsoft/callback', type: 'url', required: true, helpText: 'URI de redirecionamento configurada em Authentication → Platform configurations → Web' },
    { key: 'scopes', label: 'Escopos (Scopes)', placeholder: 'openid email profile User.Read', type: 'text', required: true, helpText: 'Permissões da Microsoft Graph API separadas por espaço. Mínimo: openid email profile User.Read' },
    { key: 'authority', label: 'Authority URL', placeholder: 'https://login.microsoftonline.com/common', type: 'url', required: false, helpText: 'URL de autoridade do Azure AD. Use /common para multi-tenant ou /{tenant-id} para single-tenant' },
  ],
};

function IntegrationsTab() {
  const { integrations, toggleIntegration, addNotification } = useApp();
  const [configModalId, setConfigModalId] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, Record<string, string>>>({});
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, boolean>>({});

  const toggleFieldVisibility = (fieldKey: string) => {
    setVisibleFields(prev => {
      const next = new Set(prev);
      if (next.has(fieldKey)) next.delete(fieldKey);
      else next.add(fieldKey);
      return next;
    });
  };

  const openConfig = (integrationId: string) => {
    setConfigModalId(integrationId);
    if (!fieldValues[integrationId]) {
      setFieldValues(prev => ({ ...prev, [integrationId]: {} }));
    }
  };

  const handleFieldChange = (integrationId: string, fieldKey: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [integrationId]: { ...(prev[integrationId] || {}), [fieldKey]: value }
    }));
  };

  const handleSaveConfig = async (integrationId: string) => {
    const fields = integrationFields[integrationId] || [];
    const values = fieldValues[integrationId] || {};
    const requiredMissing = fields.filter(f => f.required && !values[f.key]);

    if (requiredMissing.length > 0) {
      addNotification('error', 'Campos obrigatórios', `Preencha: ${requiredMissing.map(f => f.label).join(', ')}`);
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);

    setSavedConfigs(prev => ({ ...prev, [integrationId]: true }));

    // Auto-connect integration if not connected
    const integration = integrations.find(i => i.id === integrationId);
    if (integration && !integration.connected) {
      toggleIntegration(integrationId);
    }

    addNotification('success', 'Configuração salva', `As credenciais de ${integration?.name || 'integração'} foram salvas com sucesso!`);
    setConfigModalId(null);
  };

  const handleCopyField = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    addNotification('success', 'Copiado', `${label} copiado para a área de transferência`);
  };

  const getConfigStatus = (integrationId: string) => {
    if (savedConfigs[integrationId]) return 'configured';
    const values = fieldValues[integrationId] || {};
    const fields = integrationFields[integrationId] || [];
    const hasAny = fields.some(f => values[f.key]);
    if (hasAny) return 'partial';
    return 'empty';
  };

  // Official brand logos as SVG components
  const integrationLogos: Record<string, React.ReactNode> = {
    int1: ( // WhatsApp
      <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
    ),
    int2: ( // Instagram
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
    ),
    int3: ( // Facebook Messenger
      <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#00B2FF] to-[#006AFF] flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
        </svg>
      </div>
    ),
    int4: ( // Telegram
      <div className="w-10 h-10 rounded-xl bg-[#0088cc] flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </div>
    ),
    int5: ( // Google Calendar
      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
    ),
    int6: ( // Slack
      <div className="w-10 h-10 rounded-xl bg-[#4A154B] flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
          <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
          <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
          <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
        </svg>
      </div>
    ),
    int7: ( // Google OAuth
      <div className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
    ),
    int8: ( // Microsoft OAuth
      <div className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center">
        <svg viewBox="0 0 23 23" className="w-5.5 h-5.5">
          <path fill="#F35325" d="M1 1h10v10H1z"/>
          <path fill="#81BC06" d="M12 1h10v10H12z"/>
          <path fill="#05A6F0" d="M1 12h10v10H1z"/>
          <path fill="#FFBA08" d="M12 12h10v10H12z"/>
        </svg>
      </div>
    ),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Integrações</h2>
        <p className="text-sm text-gray-500">Conecte serviços externos ao seu CRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int) => {
          const configStatus = getConfigStatus(int.id);
          const hasFields = integrationFields[int.id]?.length > 0;
          return (
            <div key={int.id} className={cn(
              "p-5 rounded-2xl border-2 transition-all duration-200",
              int.connected 
                ? "border-emerald-200 bg-emerald-50/30 shadow-sm" 
                : "border-gray-100 hover:border-violet-200 hover:shadow-md"
            )}>
              <div className="flex items-center gap-4">
                {integrationLogos[int.id] || <span className="text-2xl">{int.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{int.name}</p>
                    {configStatus === 'configured' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Configurado</span>
                    )}
                    {configStatus === 'partial' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Incompleto</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{int.description}</p>
                </div>
              </div>

              {/* Required credentials summary */}
              {hasFields && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Key className="w-3 h-3 text-gray-400" />
                    <span className="text-[11px] font-medium text-gray-500">Credenciais necessárias:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {integrationFields[int.id].filter(f => f.required).map(field => {
                      const hasValue = !!(fieldValues[int.id]?.[field.key]);
                      return (
                        <span key={field.key} className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium",
                          hasValue
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-gray-50 text-gray-400 border border-gray-200"
                        )}>
                          {hasValue && <span className="mr-0.5">✓</span>}
                          {field.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                {hasFields && (
                  <button
                    onClick={() => openConfig(int.id)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <SettingsIcon className="w-3.5 h-3.5" />
                    Configurar
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (!int.connected && hasFields && configStatus === 'empty') {
                      openConfig(int.id);
                      return;
                    }
                    toggleIntegration(int.id);
                  }}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm',
                    int.connected
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-violet-200'
                  )}
                >
                  {int.connected ? '✓ Conectado' : 'Conectar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="mt-6 p-4 rounded-xl bg-violet-50 border border-violet-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <Plug className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-900">Precisa de outra integração?</p>
            <p className="text-xs text-violet-700 mt-0.5">
              Entre em contato com nosso suporte para solicitar novas integrações personalizadas para seu negócio.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {configModalId && (() => {
        const integration = integrations.find(i => i.id === configModalId);
        const fields = integrationFields[configModalId] || [];
        const values = fieldValues[configModalId] || {};

        if (!integration) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfigModalId(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    {integrationLogos[configModalId] ? (
                      <div className="scale-75">{integrationLogos[configModalId]}</div>
                    ) : (
                      <Plug className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Configurar {integration.name}</h3>
                    <p className="text-violet-200 text-sm">Preencha as credenciais necessárias para a integração</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Docs link */}
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">Onde encontrar essas credenciais?</span>
                      {configModalId === 'int1' && ' Acesse o Meta for Developers → WhatsApp → Configuração da API.'}
                      {configModalId === 'int2' && ' Acesse o Meta for Developers → Instagram → Configurações Básicas.'}
                      {configModalId === 'int3' && ' Acesse o Meta for Developers → Messenger → Configurações.'}
                      {configModalId === 'int4' && ' Converse com o @BotFather no Telegram para criar e configurar seu bot.'}
                      {configModalId === 'int5' && ' Acesse o Google Cloud Console → APIs & Services → Credentials.'}
                      {configModalId === 'int6' && ' Acesse api.slack.com/apps → seu app → OAuth & Permissions.'}
                      {configModalId === 'int7' && ' Acesse console.cloud.google.com → APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs. Configure o Consent Screen antes.'}
                      {configModalId === 'int8' && ' Acesse portal.azure.com → Azure Active Directory → App Registrations → New Registration. Configure a Redirect URI em Authentication.'}
                    </p>
                  </div>
                </div>

                {/* Fields */}
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                      {field.label}
                      {field.required && <span className="text-red-500 text-xs">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !visibleFields.has(`${configModalId}-${field.key}`) ? 'password' : 'text'}
                        value={values[field.key] || ''}
                        onChange={(e) => handleFieldChange(configModalId!, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={cn(
                          "w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors pr-20",
                          values[field.key] 
                            ? "border-emerald-300 bg-emerald-50/30" 
                            : field.required 
                              ? "border-gray-200" 
                              : "border-gray-200"
                        )}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {field.type === 'password' && (
                          <button
                            type="button"
                            onClick={() => toggleFieldVisibility(`${configModalId}-${field.key}`)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                          >
                            {visibleFields.has(`${configModalId}-${field.key}`) ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        {values[field.key] && (
                          <button
                            type="button"
                            onClick={() => handleCopyField(values[field.key], field.label)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {field.helpText && (
                      <p className="text-[11px] text-gray-400 mt-1 ml-1">{field.helpText}</p>
                    )}
                  </div>
                ))}

                {/* Status indicator */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Progresso da configuração</span>
                    <span className="text-xs font-bold text-violet-600">
                      {fields.filter(f => values[f.key]).length} / {fields.length} campos
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        fields.filter(f => values[f.key]).length === fields.length
                          ? "bg-emerald-500"
                          : fields.filter(f => f.required && values[f.key]).length === fields.filter(f => f.required).length
                            ? "bg-violet-500"
                            : "bg-amber-500"
                      )}
                      style={{ width: `${(fields.filter(f => values[f.key]).length / fields.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-gray-400">
                      Obrigatórios: {fields.filter(f => f.required && values[f.key]).length}/{fields.filter(f => f.required).length}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Opcionais: {fields.filter(f => !f.required && values[f.key]).length}/{fields.filter(f => !f.required).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                <button
                  onClick={() => {
                    setFieldValues(prev => ({ ...prev, [configModalId!]: {} }));
                    addNotification('info', 'Campos limpos', 'Todos os campos foram resetados.');
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpar Tudo
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfigModalId(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSaveConfig(configModalId!)}
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 flex items-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Salvar e Conectar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function GeneralTab() {
  const { addNotification } = useApp();
  const [companyName, setCompanyName] = useState('Minha Empresa Ltda');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [currency, setCurrency] = useState('BRL');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [automations, setAutomations] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    addNotification('success', 'Configurações salvas', 'As configurações gerais foram atualizadas.');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Configurações Gerais</h2>
        <p className="text-sm text-gray-500">Preferências do sistema</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Empresa</label>
          <input 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Fuso Horário</label>
          <select 
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
          >
            <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
            <option value="America/Fortaleza">America/Fortaleza (GMT-3)</option>
            <option value="America/Manaus">America/Manaus (GMT-4)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Moeda</label>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
          >
            <option value="BRL">BRL - Real Brasileiro</option>
            <option value="USD">USD - Dólar Americano</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        <div 
          onClick={() => setEmailNotifications(!emailNotifications)}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-violet-200 cursor-pointer transition-colors"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">Notificações por Email</p>
            <p className="text-xs text-gray-500">Receber resumo diário de atividades</p>
          </div>
          <div className={cn('w-11 h-6 rounded-full relative transition-colors', emailNotifications ? 'bg-violet-600' : 'bg-gray-300')}>
            <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all', emailNotifications ? 'right-0.5' : 'left-0.5')} />
          </div>
        </div>

        <div 
          onClick={() => setAutomations(!automations)}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-violet-200 cursor-pointer transition-colors"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">Automações</p>
            <p className="text-xs text-gray-500">Executar automações de pipeline automaticamente</p>
          </div>
          <div className={cn('w-11 h-6 rounded-full relative transition-colors', automations ? 'bg-violet-600' : 'bg-gray-300')}>
            <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all', automations ? 'right-0.5' : 'left-0.5')} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
