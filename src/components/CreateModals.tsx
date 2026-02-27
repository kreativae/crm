import React, { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, FileText, Calendar, Target, ClipboardList, Link } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Create Client Modal
export const CreateClientModal: React.FC = () => {
  const { isCreateClientModalOpen, setIsCreateClientModalOpen, addClient, teamMembers } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    type: 'PF' as 'PF' | 'PJ',
    status: 'lead' as 'lead' | 'negotiation' | 'active' | 'inactive' | 'lost',
    assignedTo: '',
    tags: '',
    notes: '',
    score: 50,
    estimatedValue: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isCreateClientModalOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        document: '',
        type: 'PF',
        status: 'lead',
        assignedTo: teamMembers[0]?.name || '',
        tags: '',
        notes: '',
        score: 50,
        estimatedValue: 0
      });
      setErrors({});
    }
  }, [isCreateClientModalOpen, teamMembers]);
  
  if (!isCreateClientModalOpen) return null;
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addClient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      document: formData.document,
      type: formData.type,
      status: formData.status,
      assignedTo: formData.assignedTo,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      customFields: {},
      notes: formData.notes,
      score: formData.score,
      estimatedValue: formData.estimatedValue
    });
    
    setIsLoading(false);
    setIsCreateClientModalOpen(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Novo Cliente</h2>
              <p className="text-violet-200 text-sm">Adicione um novo cliente ou lead</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateClientModalOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Type Selection */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'PF' }))}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                formData.type === 'PF'
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className={`w-5 h-5 ${formData.type === 'PF' ? 'text-violet-600' : 'text-gray-400'}`} />
              <div className="text-left">
                <p className={`font-semibold ${formData.type === 'PF' ? 'text-violet-600' : 'text-gray-700'}`}>
                  Pessoa Física
                </p>
                <p className="text-xs text-gray-500">CPF</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'PJ' }))}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                formData.type === 'PJ'
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className={`w-5 h-5 ${formData.type === 'PJ' ? 'text-violet-600' : 'text-gray-400'}`} />
              <div className="text-left">
                <p className={`font-semibold ${formData.type === 'PJ' ? 'text-violet-600' : 'text-gray-700'}`}>
                  Pessoa Jurídica
                </p>
                <p className="text-xs text-gray-500">CNPJ</p>
              </div>
            </button>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'PF' ? 'Nome Completo' : 'Razão Social'} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={formData.type === 'PF' ? 'João da Silva' : 'Empresa Ltda'}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'PF' ? 'CPF' : 'CNPJ'}
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.document}
                  onChange={e => setFormData(prev => ({ ...prev, document: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder={formData.type === 'PF' ? '000.000.000-00' : '00.000.000/0001-00'}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@exemplo.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(00) 00000-0000"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
          
          {/* Status and Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="lead">Lead</option>
                <option value="negotiation">Em Negociação</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
              <select
                value={formData.assignedTo}
                onChange={e => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Value and Score */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={e => setFormData(prev => ({ ...prev, estimatedValue: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Score: {formData.score}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.score}
                onChange={e => setFormData(prev => ({ ...prev, score: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="VIP, Recorrente, Enterprise (separadas por vírgula)"
            />
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              rows={3}
              placeholder="Anotações sobre o cliente..."
            />
          </div>
        </form>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsCreateClientModalOpen(false)}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              'Criar Cliente'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Deal Modal
export const CreateDealModal: React.FC = () => {
  const { 
    isCreateDealModalOpen, 
    setIsCreateDealModalOpen, 
    addDeal, 
    clients, 
    teamMembers,
    prefillData,
    setPrefillData
  } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    value: 0,
    probability: 20,
    stage: 'new',
    expectedCloseDate: '',
    assignedTo: '',
    notes: '',
    tags: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isCreateDealModalOpen) {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 1);
      
      setFormData({
        title: '',
        clientId: prefillData?.clientId || clients[0]?.id || '',
        value: 0,
        probability: 20,
        stage: 'new',
        expectedCloseDate: defaultDate.toISOString().split('T')[0],
        assignedTo: prefillData?.assignedTo || teamMembers[0]?.name || '',
        notes: '',
        tags: ''
      });
      setErrors({});
    }
    
    return () => setPrefillData(null);
  }, [isCreateDealModalOpen, clients, teamMembers, prefillData, setPrefillData]);
  
  if (!isCreateDealModalOpen) return null;
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Título é obrigatório';
    if (!formData.clientId) newErrors.clientId = 'Cliente é obrigatório';
    if (!formData.value) newErrors.value = 'Valor é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addDeal({
      title: formData.title,
      clientId: formData.clientId,
      value: formData.value,
      probability: formData.probability,
      stage: formData.stage,
      expectedCloseDate: formData.expectedCloseDate,
      assignedTo: formData.assignedTo,
      notes: formData.notes,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    
    setIsLoading(false);
    setIsCreateDealModalOpen(false);
  };
  
  const stages = [
    { id: 'new', name: 'Novo Lead' },
    { id: 'qualified', name: 'Qualificado' },
    { id: 'proposal', name: 'Proposta' },
    { id: 'negotiation', name: 'Negociação' }
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nova Negociação</h2>
              <p className="text-emerald-100 text-sm">Adicione uma nova oportunidade ao pipeline</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateDealModalOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título da Oportunidade *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Implementação Sistema ERP"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          
          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
            <select
              value={formData.clientId}
              onChange={e => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.clientId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>}
          </div>
          
          {/* Value and Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                <input
                  type="number"
                  value={formData.value}
                  onChange={e => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.value ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0,00"
                />
              </div>
              {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estágio</label>
              <select
                value={formData.stage}
                onChange={e => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Probability and Close Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probabilidade: {formData.probability}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={formData.probability}
                onChange={e => setFormData(prev => ({ ...prev, probability: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Fechamento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={e => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
          
          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
            <select
              value={formData.assignedTo}
              onChange={e => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {teamMembers.map(member => (
                <option key={member.id} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Prioritário, Enterprise (separadas por vírgula)"
            />
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Detalhes sobre a negociação..."
            />
          </div>
        </form>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsCreateDealModalOpen(false)}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              'Criar Negociação'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Task Modal
export const CreateTaskModal: React.FC = () => {
  const { 
    isCreateTaskModalOpen, 
    setIsCreateTaskModalOpen, 
    addTask, 
    clients, 
    deals,
    teamMembers,
    prefillData,
    setPrefillData
  } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in_progress' | 'done',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: '',
    assignedTo: '',
    relationType: 'none' as 'none' | 'client' | 'deal' | 'conversation',
    relationId: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isCreateTaskModalOpen) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      
      setFormData({
        title: prefillData?.title || '',
        description: prefillData?.description || '',
        status: 'todo',
        priority: prefillData?.priority || 'medium',
        dueDate: prefillData?.dueDate || defaultDate.toISOString().split('T')[0],
        assignedTo: prefillData?.assignedTo || teamMembers[0]?.name || '',
        relationType: prefillData?.relationType || 'none',
        relationId: prefillData?.relationId || ''
      });
      setErrors({});
    }
    
    return () => setPrefillData(null);
  }, [isCreateTaskModalOpen, teamMembers, prefillData, setPrefillData]);
  
  if (!isCreateTaskModalOpen) return null;
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Título é obrigatório';
    if (!formData.dueDate) newErrors.dueDate = 'Prazo é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let relatedTo = null;
    if (formData.relationType !== 'none' && formData.relationId) {
      if (formData.relationType === 'client') {
        const client = clients.find(c => c.id === formData.relationId);
        relatedTo = { type: 'client' as const, id: formData.relationId, name: client?.name || '' };
      } else if (formData.relationType === 'deal') {
        const deal = deals.find(d => d.id === formData.relationId);
        relatedTo = { type: 'deal' as const, id: formData.relationId, name: deal?.title || '' };
      }
    }
    
    addTask({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
      assignedTo: formData.assignedTo,
      relatedTo
    });
    
    setIsLoading(false);
    setIsCreateTaskModalOpen(false);
  };
  
  const getRelationOptions = () => {
    if (formData.relationType === 'client') {
      return clients.map(c => ({ id: c.id, name: c.name }));
    } else if (formData.relationType === 'deal') {
      return deals.map(d => ({ id: d.id, name: d.title }));
    }
    return [];
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
              <p className="text-blue-100 text-sm">Crie uma nova tarefa para a equipe</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateTaskModalOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Enviar proposta comercial"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Detalhes da tarefa..."
            />
          </div>
          
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="done">Concluída</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select
                value={formData.priority}
                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🟠 Alta</option>
                <option value="urgent">🔴 Urgente</option>
              </select>
            </div>
          </div>
          
          {/* Due Date and Assigned To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
              <select
                value={formData.assignedTo}
                onChange={e => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Relation */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Link className="w-4 h-4" />
              <span className="font-medium">Vincular a</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.relationType}
                  onChange={e => setFormData(prev => ({ ...prev, relationType: e.target.value as any, relationId: '' }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">Nenhum</option>
                  <option value="client">Cliente</option>
                  <option value="deal">Negociação</option>
                </select>
              </div>
              
              {formData.relationType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.relationType === 'client' ? 'Cliente' : 'Negociação'}
                  </label>
                  <select
                    value={formData.relationId}
                    onChange={e => setFormData(prev => ({ ...prev, relationId: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione...</option>
                    {getRelationOptions().map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </form>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(false)}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              'Criar Tarefa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
