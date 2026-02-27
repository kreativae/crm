import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface Client {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'PF' | 'PJ';
  tags: string[];
  customFields: Record<string, any>;
  status: 'lead' | 'negotiation' | 'active' | 'inactive' | 'lost';
  assignedTo: string;
  notes: string;
  score: number;
  estimatedValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  tenantId: string;
  clientId: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  notes: string;
  tags: string[];
  history: { action: string; date: string; user: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  relatedTo: {
    type: 'client' | 'deal' | 'conversation';
    id: string;
    name: string;
  } | null;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'admin' | 'vendedor' | 'atendimento' | 'financeiro';
  status: 'active' | 'inactive';
  avatar?: string;
  department?: string;
  hireDate: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  memberId: string;
  memberName: string;
  targetValue: number;
  currentValue: number;
  month: string; // YYYY-MM format
  createdAt: string;
  updatedAt: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  config?: Record<string, string>;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface TaskColumn {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
}

// Initial Data
const initialClients: Client[] = [
  {
    id: 'c1',
    tenantId: 't1',
    name: 'Maria Silva',
    email: 'maria@empresa.com',
    phone: '(11) 99999-1234',
    document: '123.456.789-00',
    type: 'PF',
    tags: ['VIP', 'Recorrente'],
    customFields: {},
    status: 'active',
    assignedTo: 'João Silva',
    notes: 'Cliente desde 2020',
    score: 85,
    estimatedValue: 15000,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 'c2',
    tenantId: 't1',
    name: 'Tech Solutions Ltda',
    email: 'contato@techsolutions.com',
    phone: '(11) 3333-4444',
    document: '12.345.678/0001-90',
    type: 'PJ',
    tags: ['Enterprise', 'Software'],
    customFields: {},
    status: 'negotiation',
    assignedTo: 'Ana Costa',
    notes: 'Interessado no plano Enterprise',
    score: 72,
    estimatedValue: 50000,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 'c3',
    tenantId: 't1',
    name: 'Carlos Mendes',
    email: 'carlos@gmail.com',
    phone: '(21) 98888-5555',
    document: '987.654.321-00',
    type: 'PF',
    tags: ['Novo'],
    customFields: {},
    status: 'lead',
    assignedTo: 'Pedro Santos',
    notes: 'Veio do Instagram',
    score: 45,
    estimatedValue: 5000,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 'c4',
    tenantId: 't1',
    name: 'Startup Digital SA',
    email: 'hello@startupdigital.io',
    phone: '(11) 2222-3333',
    document: '98.765.432/0001-10',
    type: 'PJ',
    tags: ['Potencial', 'Indicação'],
    customFields: {},
    status: 'lead',
    assignedTo: 'João Silva',
    notes: 'Indicação do cliente Maria',
    score: 60,
    estimatedValue: 30000,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19'
  },
  {
    id: 'c5',
    tenantId: 't1',
    name: 'Roberto Almeida',
    email: 'roberto@outlook.com',
    phone: '(31) 97777-6666',
    document: '456.789.123-00',
    type: 'PF',
    tags: ['Inativo'],
    customFields: {},
    status: 'inactive',
    assignedTo: 'Ana Costa',
    notes: 'Último contato há 6 meses',
    score: 20,
    estimatedValue: 0,
    createdAt: '2023-06-01',
    updatedAt: '2023-07-15'
  }
];

const initialDeals: Deal[] = [
  {
    id: 'd1',
    tenantId: 't1',
    clientId: 'c2',
    title: 'Implementação Sistema ERP',
    value: 50000,
    stage: 'proposal',
    probability: 60,
    expectedCloseDate: '2024-02-15',
    assignedTo: 'Ana Costa',
    notes: 'Cliente interessado em módulos financeiros',
    tags: ['Prioritário', 'Enterprise'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-10', user: 'Ana Costa' },
      { action: 'Movido para Qualificado', date: '2024-01-12', user: 'Ana Costa' },
      { action: 'Movido para Proposta', date: '2024-01-15', user: 'Ana Costa' }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: 'd2',
    tenantId: 't1',
    clientId: 'c4',
    title: 'Consultoria de Marketing Digital',
    value: 25000,
    stage: 'qualified',
    probability: 40,
    expectedCloseDate: '2024-03-01',
    assignedTo: 'João Silva',
    notes: 'Precisa de proposta detalhada',
    tags: ['Marketing'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-18', user: 'João Silva' },
      { action: 'Movido para Qualificado', date: '2024-01-19', user: 'João Silva' }
    ],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19'
  },
  {
    id: 'd3',
    tenantId: 't1',
    clientId: 'c3',
    title: 'Plano Básico Mensal',
    value: 5000,
    stage: 'new',
    probability: 20,
    expectedCloseDate: '2024-02-28',
    assignedTo: 'Pedro Santos',
    notes: 'Lead do Instagram',
    tags: ['Novo'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-20', user: 'Pedro Santos' }
    ],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 'd4',
    tenantId: 't1',
    clientId: 'c1',
    title: 'Renovação Contrato Anual',
    value: 18000,
    stage: 'negotiation',
    probability: 80,
    expectedCloseDate: '2024-02-01',
    assignedTo: 'João Silva',
    notes: 'Renovação com upgrade de plano',
    tags: ['Renovação', 'VIP'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-05', user: 'João Silva' },
      { action: 'Movido para Negociação', date: '2024-01-18', user: 'João Silva' }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18'
  },
  // Deals fechados para mostrar no ranking
  {
    id: 'd5',
    tenantId: 't1',
    clientId: 'c1',
    title: 'Projeto Website Institucional',
    value: 35000,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2024-01-20',
    assignedTo: 'João Silva',
    notes: 'Projeto entregue com sucesso',
    tags: ['Website', 'Fechado'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-01', user: 'João Silva' },
      { action: 'Movido para Fechado', date: '2024-01-20', user: 'João Silva' }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: 'd6',
    tenantId: 't1',
    clientId: 'c2',
    title: 'Licença Software Anual',
    value: 72000,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2024-01-15',
    assignedTo: 'Ana Costa',
    notes: 'Contrato renovado por mais 12 meses',
    tags: ['Licença', 'Enterprise'],
    history: [
      { action: 'Oportunidade criada', date: '2023-12-10', user: 'Ana Costa' },
      { action: 'Movido para Fechado', date: '2024-01-15', user: 'Ana Costa' }
    ],
    createdAt: '2023-12-10',
    updatedAt: '2024-01-15'
  },
  {
    id: 'd7',
    tenantId: 't1',
    clientId: 'c4',
    title: 'Consultoria Estratégica',
    value: 45000,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2024-01-25',
    assignedTo: 'Ana Costa',
    notes: 'Projeto de 3 meses',
    tags: ['Consultoria'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-05', user: 'Ana Costa' },
      { action: 'Movido para Fechado', date: '2024-01-25', user: 'Ana Costa' }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-25'
  },
  {
    id: 'd8',
    tenantId: 't1',
    clientId: 'c3',
    title: 'Setup Inicial Plataforma',
    value: 8500,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2024-01-18',
    assignedTo: 'Pedro Santos',
    notes: 'Cliente convertido do Instagram',
    tags: ['Setup', 'Novo Cliente'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-10', user: 'Pedro Santos' },
      { action: 'Movido para Fechado', date: '2024-01-18', user: 'Pedro Santos' }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 'd9',
    tenantId: 't1',
    clientId: 'c1',
    title: 'Manutenção Mensal',
    value: 4500,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2024-01-28',
    assignedTo: 'Carla Lima',
    notes: 'Contrato de manutenção mensal',
    tags: ['Manutenção', 'Recorrente'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-20', user: 'Carla Lima' },
      { action: 'Movido para Fechado', date: '2024-01-28', user: 'Carla Lima' }
    ],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-28'
  },
  {
    id: 'd10',
    tenantId: 't1',
    clientId: 'c2',
    title: 'Treinamento Equipe',
    value: 15000,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2024-01-22',
    assignedTo: 'João Silva',
    notes: 'Treinamento de 2 dias para 20 pessoas',
    tags: ['Treinamento'],
    history: [
      { action: 'Oportunidade criada', date: '2024-01-10', user: 'João Silva' },
      { action: 'Movido para Fechado', date: '2024-01-22', user: 'João Silva' }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22'
  }
];

const initialTasks: Task[] = [
  {
    id: 't1',
    tenantId: 't1',
    title: 'Enviar proposta comercial',
    description: 'Elaborar e enviar proposta para o cliente Tech Solutions',
    relatedTo: { type: 'deal', id: 'd1', name: 'Implementação Sistema ERP' },
    assignedTo: 'Ana Costa',
    dueDate: '2024-01-25',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 't2',
    tenantId: 't1',
    title: 'Follow-up com lead',
    description: 'Ligar para Carlos Mendes para qualificar interesse',
    relatedTo: { type: 'client', id: 'c3', name: 'Carlos Mendes' },
    assignedTo: 'Pedro Santos',
    dueDate: '2024-01-22',
    priority: 'medium',
    status: 'todo',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 't3',
    tenantId: 't1',
    title: 'Preparar apresentação',
    description: 'Criar slides para reunião com Startup Digital',
    relatedTo: { type: 'client', id: 'c4', name: 'Startup Digital SA' },
    assignedTo: 'João Silva',
    dueDate: '2024-01-28',
    priority: 'high',
    status: 'todo',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19'
  },
  {
    id: 't4',
    tenantId: 't1',
    title: 'Reunião de alinhamento',
    description: 'Agendar reunião com Maria para discutir renovação',
    relatedTo: { type: 'deal', id: 'd4', name: 'Renovação Contrato Anual' },
    assignedTo: 'João Silva',
    dueDate: '2024-01-23',
    priority: 'urgent',
    status: 'todo',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: 't5',
    tenantId: 't1',
    title: 'Atualizar CRM',
    description: 'Registrar todas as interações da semana no sistema',
    relatedTo: null,
    assignedTo: 'Ana Costa',
    dueDate: '2024-01-26',
    priority: 'low',
    status: 'done',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
];

// Initial Goals
const initialGoals: Goal[] = [
  { id: 'g1', memberId: 'u1', memberName: 'João Silva', targetValue: 200000, currentValue: 150000, month: '2024-01', createdAt: '2024-01-01', updatedAt: '2024-01-20' },
  { id: 'g2', memberId: 'u2', memberName: 'Ana Costa', targetValue: 150000, currentValue: 95000, month: '2024-01', createdAt: '2024-01-01', updatedAt: '2024-01-18' },
  { id: 'g3', memberId: 'u3', memberName: 'Pedro Santos', targetValue: 100000, currentValue: 25000, month: '2024-01', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
  { id: 'g4', memberId: 'u4', memberName: 'Carla Lima', targetValue: 100000, currentValue: 27000, month: '2024-01', createdAt: '2024-01-01', updatedAt: '2024-01-20' },
];

// Initial Webhooks
const initialWebhooks: Webhook[] = [
  { id: 'wh1', url: 'https://api.empresa.com/webhook/leads', events: ['lead.created', 'lead.updated'], active: true, createdAt: '2024-01-10' },
  { id: 'wh2', url: 'https://hooks.slack.com/services/xxx', events: ['deal.won'], active: true, createdAt: '2024-01-05' },
  { id: 'wh3', url: 'https://api.empresa.com/webhook/messages', events: ['message.received'], active: false, createdAt: '2024-01-01' },
];

// Initial API Keys
const initialApiKeys: ApiKey[] = [
  { id: 'ak1', name: 'Produção', key: 'nxs_live_' + 'x'.repeat(28) + 'a1b2', createdAt: '2024-01-15', lastUsed: '2024-01-20' },
  { id: 'ak2', name: 'Desenvolvimento', key: 'nxs_test_' + 'x'.repeat(28) + 'c3d4', createdAt: '2024-03-20', lastUsed: '2024-01-19' },
];

// Initial Integrations
const initialIntegrations: Integration[] = [
  { id: 'int1', name: 'WhatsApp Business', description: 'API oficial do WhatsApp', icon: '💬', connected: true },
  { id: 'int2', name: 'Instagram', description: 'Direct Messages API', icon: '📷', connected: true },
  { id: 'int3', name: 'Facebook Messenger', description: 'Messenger Platform', icon: '💙', connected: false },
  { id: 'int4', name: 'Telegram Bot', description: 'Bot API', icon: '✈️', connected: true },
  { id: 'int5', name: 'Google Calendar', description: 'Sincronização de agenda', icon: '📅', connected: false },
  { id: 'int6', name: 'Slack', description: 'Notificações no Slack', icon: '💬', connected: false },
  { id: 'int7', name: 'Google OAuth (Login)', description: 'Login social com conta Google', icon: '🔐', connected: false },
  { id: 'int8', name: 'Microsoft OAuth (Login)', description: 'Login social com conta Microsoft', icon: '🔐', connected: false },
];

// Initial Pipeline Stages
const initialPipelineStages: PipelineStage[] = [
  { id: 'ps1', name: 'Novo Lead', color: '#3b82f6', order: 1 },
  { id: 'ps2', name: 'Qualificado', color: '#06b6d4', order: 2 },
  { id: 'ps3', name: 'Proposta', color: '#8b5cf6', order: 3 },
  { id: 'ps4', name: 'Negociação', color: '#f59e0b', order: 4 },
  { id: 'ps5', name: 'Fechado', color: '#10b981', order: 5 },
  { id: 'ps6', name: 'Perdido', color: '#ef4444', order: 6 },
];

const initialTaskColumns: TaskColumn[] = [
  { id: 'todo', name: 'A Fazer', color: '#3b82f6', icon: '📋', order: 1 },
  { id: 'in_progress', name: 'Em Progresso', color: '#f59e0b', icon: '🔄', order: 2 },
  { id: 'done', name: 'Concluída', color: '#10b981', icon: '✅', order: 3 },
];

const initialTeamMembers: TeamMember[] = [
  { 
    id: 'u1', 
    name: 'João Silva', 
    email: 'joao@nexuscrm.com', 
    phone: '(11) 99999-0001',
    role: 'vendedor',
    status: 'active',
    department: 'Vendas',
    hireDate: '2023-01-15',
    permissions: ['view_clients', 'edit_clients', 'view_deals', 'edit_deals', 'view_tasks', 'edit_tasks'],
    createdAt: '2023-01-15',
    updatedAt: '2024-01-20'
  },
  { 
    id: 'u2', 
    name: 'Ana Costa', 
    email: 'ana@nexuscrm.com',
    phone: '(11) 99999-0002',
    role: 'vendedor',
    status: 'active',
    department: 'Vendas',
    hireDate: '2023-03-10',
    permissions: ['view_clients', 'edit_clients', 'view_deals', 'edit_deals', 'view_tasks', 'edit_tasks'],
    createdAt: '2023-03-10',
    updatedAt: '2024-01-18'
  },
  { 
    id: 'u3', 
    name: 'Pedro Santos', 
    email: 'pedro@nexuscrm.com',
    phone: '(11) 99999-0003',
    role: 'atendimento',
    status: 'active',
    department: 'Suporte',
    hireDate: '2023-06-01',
    permissions: ['view_clients', 'view_deals', 'view_tasks', 'edit_tasks', 'view_conversations', 'edit_conversations'],
    createdAt: '2023-06-01',
    updatedAt: '2024-01-15'
  },
  { 
    id: 'u4', 
    name: 'Carla Lima', 
    email: 'carla@nexuscrm.com',
    phone: '(11) 99999-0004',
    role: 'admin',
    status: 'active',
    department: 'Administração',
    hireDate: '2022-08-20',
    permissions: ['all'],
    createdAt: '2022-08-20',
    updatedAt: '2024-01-20'
  },
  { 
    id: 'u5', 
    name: 'Ricardo Oliveira', 
    email: 'ricardo@nexuscrm.com',
    phone: '(11) 99999-0005',
    role: 'financeiro',
    status: 'active',
    department: 'Financeiro',
    hireDate: '2023-09-15',
    permissions: ['view_clients', 'view_deals', 'view_reports', 'export_data'],
    createdAt: '2023-09-15',
    updatedAt: '2024-01-10'
  },
  { 
    id: 'u6', 
    name: 'Mariana Ferreira', 
    email: 'mariana@nexuscrm.com',
    phone: '(11) 99999-0006',
    role: 'vendedor',
    status: 'inactive',
    department: 'Vendas',
    hireDate: '2023-02-01',
    permissions: ['view_clients', 'edit_clients', 'view_deals', 'edit_deals'],
    createdAt: '2023-02-01',
    updatedAt: '2023-12-15'
  }
];

// Undo Types
export interface UndoAction {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
}

// Context Type
interface AppContextType {
  // Data
  clients: Client[];
  deals: Deal[];
  tasks: Task[];
  teamMembers: TeamMember[];
  notifications: Notification[];
  goals: Goal[];
  webhooks: Webhook[];
  apiKeys: ApiKey[];
  integrations: Integration[];
  pipelineStages: PipelineStage[];
  
  // Client Actions
  addClient: (client: Omit<Client, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  
  // Deal Actions
  addDeal: (deal: Omit<Deal, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'history'>) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  moveDealStage: (id: string, newStage: string) => void;
  getDealById: (id: string) => Deal | undefined;
  getDealsByClient: (clientId: string) => Deal[];
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByRelation: (type: string, id: string) => Task[];
  
  // Team Member Actions
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => TeamMember;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  getTeamMemberById: (id: string) => TeamMember | undefined;
  getTeamMemberByName: (name: string) => TeamMember | undefined;
  getTasksByTeamMember: (memberName: string) => Task[];
  getClientsByTeamMember: (memberName: string) => Client[];
  getDealsByTeamMember: (memberName: string) => Deal[];
  
  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoalByMember: (memberId: string, month?: string) => Goal | undefined;
  
  // Webhook Actions
  addWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt'>) => Webhook;
  updateWebhook: (id: string, updates: Partial<Webhook>) => void;
  deleteWebhook: (id: string) => void;
  
  // API Key Actions
  addApiKey: (apiKey: Omit<ApiKey, 'id' | 'createdAt' | 'lastUsed' | 'key'>) => ApiKey;
  deleteApiKey: (id: string) => void;
  
  // Integration Actions
  toggleIntegration: (id: string) => void;
  
  // Pipeline Stage Actions
  addPipelineStage: (stage: Omit<PipelineStage, 'id'>) => PipelineStage;
  updatePipelineStage: (id: string, updates: Partial<PipelineStage>) => void;
  deletePipelineStage: (id: string) => void;
  reorderPipelineStages: (stages: PipelineStage[]) => void;
  
  // Task Column Actions
  taskColumns: TaskColumn[];
  addTaskColumn: (column: Omit<TaskColumn, 'id'>) => TaskColumn;
  updateTaskColumn: (id: string, updates: Partial<TaskColumn>) => void;
  deleteTaskColumn: (id: string) => void;
  reorderTaskColumns: (columns: TaskColumn[]) => void;
  
  // Notification Actions
  addNotification: (type: Notification['type'], title: string, message: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  navigateToClient: (clientId: string) => void;
  navigateToDeal: (dealId: string) => void;
  navigateToTask: (taskId: string) => void;
  
  // Selection State
  selectedClientId: string | null;
  selectedDealId: string | null;
  selectedTaskId: string | null;
  selectedTeamMemberId: string | null;
  setSelectedClientId: (id: string | null) => void;
  setSelectedDealId: (id: string | null) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSelectedTeamMemberId: (id: string | null) => void;
  
  // Modal State
  isCreateClientModalOpen: boolean;
  isCreateDealModalOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isCreateTeamMemberModalOpen: boolean;
  setIsCreateClientModalOpen: (open: boolean) => void;
  setIsCreateDealModalOpen: (open: boolean) => void;
  setIsCreateTaskModalOpen: (open: boolean) => void;
  setIsCreateTeamMemberModalOpen: (open: boolean) => void;
  
  // Pre-fill data for modals
  prefillData: any;
  setPrefillData: (data: any) => void;
  
  // Active User (for multi-user switching)
  activeUserId: string | null;
  setActiveUserId: (id: string | null) => void;
  activeUser: TeamMember | null;
  
  // Undo/Redo
  undoStack: UndoAction[];
  undo: () => void;
  clearUndoStack: () => void;
  
  // Onboarding
  showOnboarding: boolean;
  startOnboarding: () => void;
  finishOnboarding: () => void;
  
  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(initialPipelineStages);
  const [taskColumns, setTaskColumns] = useState<TaskColumn[]>(initialTaskColumns);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Selection State
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string | null>(null);
  
  // Modal State
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateTeamMemberModalOpen, setIsCreateTeamMemberModalOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<any>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>('u4'); // Default to Carla Lima (admin)
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('nexus_onboarding_done'));
  const [isLoading, setIsLoading] = useState(false);
  
  // Undo function
  const pushUndo = useCallback((type: string, data: any) => {
    const action: UndoAction = { id: Math.random().toString(36).substr(2, 9), type, data, timestamp: new Date() };
    setUndoStack(prev => [action, ...prev].slice(0, 10));
  }, []);
  
  // Generate ID
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const getTimestamp = () => new Date().toISOString().split('T')[0];
  
  // Notification Actions
  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const notification: Notification = {
      id: generateId(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Undo function
  const undo = useCallback(() => {
    const lastAction = undoStack[0];
    if (!lastAction) return;
    switch (lastAction.type) {
      case 'DELETE_CLIENT': setClients(prev => [...prev, lastAction.data]); break;
      case 'DELETE_DEAL': setDeals(prev => [...prev, lastAction.data]); break;
      case 'DELETE_TASK': setTasks(prev => [...prev, lastAction.data]); break;
      case 'DELETE_TEAM_MEMBER': setTeamMembers(prev => [...prev, lastAction.data]); break;
      case 'UPDATE_CLIENT': setClients(prev => prev.map(c => c.id === lastAction.data.id ? lastAction.data : c)); break;
      case 'UPDATE_DEAL': setDeals(prev => prev.map(d => d.id === lastAction.data.id ? lastAction.data : d)); break;
      case 'UPDATE_TASK': setTasks(prev => prev.map(t => t.id === lastAction.data.id ? lastAction.data : t)); break;
    }
    setUndoStack(prev => prev.slice(1));
    addNotification('success', 'Ação desfeita', 'A última ação foi revertida com sucesso.');
  }, [undoStack, addNotification]);
  
  const clearUndoStack = useCallback(() => setUndoStack([]), []);
  const startOnboarding = useCallback(() => setShowOnboarding(true), []);
  const finishOnboarding = useCallback(() => { setShowOnboarding(false); localStorage.setItem('nexus_onboarding_done', 'true'); }, []);
  
  // Client Actions
  const addClient = useCallback((clientData: Omit<Client, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      tenantId: 't1',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    setClients(prev => [...prev, newClient]);
    addNotification('success', 'Cliente criado', `${newClient.name} foi adicionado com sucesso.`);
    return newClient;
  }, [addNotification]);
  
  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: getTimestamp() } : c
    ));
    addNotification('success', 'Cliente atualizado', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deleteClient = useCallback((id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) pushUndo('DELETE_CLIENT', client);
    setClients(prev => prev.filter(c => c.id !== id));
    // Also delete related deals and tasks
    setDeals(prev => prev.filter(d => d.clientId !== id));
    setTasks(prev => prev.filter(t => !(t.relatedTo?.type === 'client' && t.relatedTo.id === id)));
    addNotification('info', 'Cliente excluído', `${client?.name} foi removido.`);
  }, [clients, addNotification]);
  
  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);
  
  // Deal Actions
  const addDeal = useCallback((dealData: Omit<Deal, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: generateId(),
      tenantId: 't1',
      history: [{ action: 'Oportunidade criada', date: getTimestamp(), user: dealData.assignedTo }],
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    setDeals(prev => [...prev, newDeal]);
    
    // Update client status to negotiation if it's a lead
    const client = clients.find(c => c.id === dealData.clientId);
    if (client && client.status === 'lead') {
      updateClient(client.id, { status: 'negotiation' });
    }
    
    addNotification('success', 'Negociação criada', `${newDeal.title} foi adicionada ao pipeline.`);
    return newDeal;
  }, [clients, addNotification, updateClient]);
  
  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(d => 
      d.id === id ? { ...d, ...updates, updatedAt: getTimestamp() } : d
    ));
    addNotification('success', 'Negociação atualizada', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deleteDeal = useCallback((id: string) => {
    const deal = deals.find(d => d.id === id);
    setDeals(prev => prev.filter(d => d.id !== id));
    // Also delete related tasks
    setTasks(prev => prev.filter(t => !(t.relatedTo?.type === 'deal' && t.relatedTo.id === id)));
    addNotification('info', 'Negociação excluída', `${deal?.title} foi removida.`);
  }, [deals, addNotification]);
  
  const moveDealStage = useCallback((id: string, newStage: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d;
      
      const stageNames: Record<string, string> = {
        new: 'Novo Lead',
        qualified: 'Qualificado',
        proposal: 'Proposta',
        negotiation: 'Negociação',
        closed: 'Fechado',
        lost: 'Perdido'
      };
      
      const newHistory = [
        ...d.history,
        { action: `Movido para ${stageNames[newStage]}`, date: getTimestamp(), user: d.assignedTo }
      ];
      
      // If deal is closed, update client status
      if (newStage === 'closed') {
        const client = clients.find(c => c.id === d.clientId);
        if (client) {
          updateClient(client.id, { status: 'active' });
        }
        
        // Auto create task for onboarding
        addTask({
          title: 'Onboarding do cliente',
          description: `Iniciar processo de onboarding para ${d.title}`,
          relatedTo: { type: 'deal', id: d.id, name: d.title },
          assignedTo: d.assignedTo,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          status: 'todo'
        });
      }
      
      // If deal is lost, update client status
      if (newStage === 'lost') {
        const client = clients.find(c => c.id === d.clientId);
        if (client && client.status === 'negotiation') {
          updateClient(client.id, { status: 'lead' });
        }
      }
      
      return { ...d, stage: newStage, history: newHistory, updatedAt: getTimestamp() };
    }));
    
    addNotification('info', 'Estágio atualizado', 'A negociação foi movida.');
  }, [clients, addNotification, updateClient]);
  
  const getDealById = useCallback((id: string) => {
    return deals.find(d => d.id === id);
  }, [deals]);
  
  const getDealsByClient = useCallback((clientId: string) => {
    return deals.filter(d => d.clientId === clientId);
  }, [deals]);
  
  // Task Actions
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      tenantId: 't1',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    setTasks(prev => [...prev, newTask]);
    addNotification('success', 'Tarefa criada', `${newTask.title} foi adicionada.`);
    return newTask;
  }, [addNotification]);
  
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: getTimestamp() } : t
    ));
    addNotification('success', 'Tarefa atualizada', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    addNotification('info', 'Tarefa excluída', `${task?.title} foi removida.`);
  }, [tasks, addNotification]);
  
  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'done', updatedAt: getTimestamp() } : t
    ));
    addNotification('success', 'Tarefa concluída', 'Parabéns! A tarefa foi marcada como concluída.');
  }, [addNotification]);
  
  const getTaskById = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);
  
  const getTasksByRelation = useCallback((type: string, id: string) => {
    return tasks.filter(t => t.relatedTo?.type === type && t.relatedTo.id === id);
  }, [tasks]);
  
  // Team Member Actions
  const addTeamMember = useCallback((memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    setTeamMembers(prev => [...prev, newMember]);
    addNotification('success', 'Membro adicionado', `${newMember.name} foi adicionado à equipe.`);
    return newMember;
  }, [addNotification]);
  
  const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates, updatedAt: getTimestamp() } : m
    ));
    addNotification('success', 'Membro atualizado', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deleteTeamMember = useCallback((id: string) => {
    const member = teamMembers.find(m => m.id === id);
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    addNotification('info', 'Membro removido', `${member?.name} foi removido da equipe.`);
  }, [teamMembers, addNotification]);
  
  const getTeamMemberById = useCallback((id: string) => {
    return teamMembers.find(m => m.id === id);
  }, [teamMembers]);
  
  const getTeamMemberByName = useCallback((name: string) => {
    return teamMembers.find(m => m.name === name);
  }, [teamMembers]);
  
  const getTasksByTeamMember = useCallback((memberName: string) => {
    return tasks.filter(t => t.assignedTo === memberName);
  }, [tasks]);
  
  const getClientsByTeamMember = useCallback((memberName: string) => {
    return clients.filter(c => c.assignedTo === memberName);
  }, [clients]);
  
  const getDealsByTeamMember = useCallback((memberName: string) => {
    return deals.filter(d => d.assignedTo === memberName);
  }, [deals]);
  
  // Goal Actions
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    setGoals(prev => [...prev, newGoal]);
    addNotification('success', 'Meta criada', `Meta para ${newGoal.memberName} foi criada.`);
    return newGoal;
  }, [addNotification]);
  
  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, ...updates, updatedAt: getTimestamp() } : g
    ));
    addNotification('success', 'Meta atualizada', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deleteGoal = useCallback((id: string) => {
    const goal = goals.find(g => g.id === id);
    setGoals(prev => prev.filter(g => g.id !== id));
    addNotification('info', 'Meta excluída', `Meta de ${goal?.memberName} foi removida.`);
  }, [goals, addNotification]);
  
  const getGoalByMember = useCallback((memberId: string, month?: string) => {
    const currentMonth = month || new Date().toISOString().slice(0, 7);
    return goals.find(g => g.memberId === memberId && g.month === currentMonth);
  }, [goals]);
  
  // Webhook Actions
  const addWebhook = useCallback((webhookData: Omit<Webhook, 'id' | 'createdAt'>) => {
    const newWebhook: Webhook = {
      ...webhookData,
      id: generateId(),
      createdAt: getTimestamp()
    };
    setWebhooks(prev => [...prev, newWebhook]);
    addNotification('success', 'Webhook criado', 'O webhook foi configurado com sucesso.');
    return newWebhook;
  }, [addNotification]);
  
  const updateWebhook = useCallback((id: string, updates: Partial<Webhook>) => {
    setWebhooks(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
    addNotification('success', 'Webhook atualizado', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deleteWebhook = useCallback((id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    addNotification('info', 'Webhook excluído', 'O webhook foi removido.');
  }, [addNotification]);
  
  // API Key Actions
  const addApiKey = useCallback((apiKeyData: Omit<ApiKey, 'id' | 'createdAt' | 'lastUsed' | 'key'>) => {
    const newKey: ApiKey = {
      ...apiKeyData,
      id: generateId(),
      key: 'nxs_' + apiKeyData.name.toLowerCase().replace(/\s/g, '') + '_' + Math.random().toString(36).substr(2, 28),
      createdAt: getTimestamp(),
      lastUsed: null
    };
    setApiKeys(prev => [...prev, newKey]);
    addNotification('success', 'Chave criada', `A chave "${newKey.name}" foi criada com sucesso.`);
    return newKey;
  }, [addNotification]);
  
  const deleteApiKey = useCallback((id: string) => {
    const apiKey = apiKeys.find(k => k.id === id);
    setApiKeys(prev => prev.filter(k => k.id !== id));
    addNotification('info', 'Chave revogada', `A chave "${apiKey?.name}" foi revogada.`);
  }, [apiKeys, addNotification]);
  
  // Integration Actions
  const toggleIntegration = useCallback((id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id !== id) return int;
      const newConnected = !int.connected;
      if (newConnected) {
        addNotification('success', 'Integração conectada', `${int.name} foi conectado com sucesso.`);
      } else {
        addNotification('info', 'Integração desconectada', `${int.name} foi desconectado.`);
      }
      return { ...int, connected: newConnected };
    }));
  }, [addNotification]);
  
  // Pipeline Stage Actions
  const addPipelineStage = useCallback((stageData: Omit<PipelineStage, 'id'>) => {
    const newStage: PipelineStage = {
      ...stageData,
      id: generateId()
    };
    setPipelineStages(prev => [...prev, newStage].sort((a, b) => a.order - b.order));
    addNotification('success', 'Estágio criado', `O estágio "${newStage.name}" foi adicionado.`);
    return newStage;
  }, [addNotification]);
  
  const updatePipelineStage = useCallback((id: string, updates: Partial<PipelineStage>) => {
    setPipelineStages(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ).sort((a, b) => a.order - b.order));
    addNotification('success', 'Estágio atualizado', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deletePipelineStage = useCallback((id: string) => {
    const stage = pipelineStages.find(s => s.id === id);
    setPipelineStages(prev => prev.filter(s => s.id !== id));
    addNotification('info', 'Estágio excluído', `O estágio "${stage?.name}" foi removido.`);
  }, [pipelineStages, addNotification]);
  
  const reorderPipelineStages = useCallback((stages: PipelineStage[]) => {
    setPipelineStages(stages);
  }, []);
  
  // Task Column Actions
  const addTaskColumn = useCallback((columnData: Omit<TaskColumn, 'id'>) => {
    const newColumn: TaskColumn = {
      ...columnData,
      id: generateId()
    };
    setTaskColumns(prev => [...prev, newColumn].sort((a, b) => a.order - b.order));
    addNotification('success', 'Coluna criada', `A coluna "${newColumn.name}" foi adicionada.`);
    return newColumn;
  }, [addNotification]);
  
  const updateTaskColumn = useCallback((id: string, updates: Partial<TaskColumn>) => {
    setTaskColumns(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      // If the ID changed, update all tasks with the old ID
      if (updates.id && updates.id !== id) {
        setTasks(prevTasks => prevTasks.map(t => 
          t.status === id ? { ...t, status: updates.id as Task['status'] } : t
        ));
      }
      return updated.sort((a, b) => a.order - b.order);
    });
    addNotification('success', 'Coluna atualizada', 'As alterações foram salvas.');
  }, [addNotification]);
  
  const deleteTaskColumn = useCallback((id: string) => {
    const column = taskColumns.find(c => c.id === id);
    // Move tasks from deleted column to first available column
    const firstColumn = taskColumns.find(c => c.id !== id);
    if (firstColumn) {
      setTasks(prev => prev.map(t => 
        t.status === id ? { ...t, status: firstColumn.id as Task['status'] } : t
      ));
    }
    setTaskColumns(prev => prev.filter(c => c.id !== id));
    addNotification('info', 'Coluna excluída', `A coluna "${column?.name}" foi removida.`);
  }, [taskColumns, addNotification]);
  
  const reorderTaskColumns = useCallback((columns: TaskColumn[]) => {
    setTaskColumns(columns);
  }, []);
  
  // Navigation
  const navigateToClient = useCallback((clientId: string) => {
    setCurrentPage('clients');
    setSelectedClientId(clientId);
  }, []);
  
  const navigateToDeal = useCallback((dealId: string) => {
    setCurrentPage('crm');
    setSelectedDealId(dealId);
  }, []);
  
  const navigateToTask = useCallback((taskId: string) => {
    setCurrentPage('tasks');
    setSelectedTaskId(taskId);
  }, []);
  
  const value: AppContextType = {
    // Data
    clients,
    deals,
    tasks,
    teamMembers,
    notifications,
    goals,
    webhooks,
    apiKeys,
    integrations,
    pipelineStages,
    
    // Client Actions
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    
    // Deal Actions
    addDeal,
    updateDeal,
    deleteDeal,
    moveDealStage,
    getDealById,
    getDealsByClient,
    
    // Task Actions
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getTaskById,
    getTasksByRelation,
    
    // Team Member Actions
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMemberById,
    getTeamMemberByName,
    getTasksByTeamMember,
    getClientsByTeamMember,
    getDealsByTeamMember,
    
    // Goals
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalByMember,
    
    // Webhooks
    addWebhook,
    updateWebhook,
    deleteWebhook,
    
    // API Keys
    addApiKey,
    deleteApiKey,
    
    // Integrations
    toggleIntegration,
    
    // Pipeline Stages
    addPipelineStage,
    updatePipelineStage,
    deletePipelineStage,
    reorderPipelineStages,
    
    // Task Columns
    taskColumns,
    addTaskColumn,
    updateTaskColumn,
    deleteTaskColumn,
    reorderTaskColumns,
    
    // Notifications
    addNotification,
    removeNotification,
    clearNotifications,
    
    // Navigation
    currentPage,
    setCurrentPage,
    navigateToClient,
    navigateToDeal,
    navigateToTask,
    
    // Selection
    selectedClientId,
    selectedDealId,
    selectedTaskId,
    selectedTeamMemberId,
    setSelectedClientId,
    setSelectedDealId,
    setSelectedTaskId,
    setSelectedTeamMemberId,
    
    // Modals
    isCreateClientModalOpen,
    isCreateDealModalOpen,
    isCreateTaskModalOpen,
    isCreateTeamMemberModalOpen,
    setIsCreateClientModalOpen,
    setIsCreateDealModalOpen,
    setIsCreateTaskModalOpen,
    setIsCreateTeamMemberModalOpen,
    prefillData,
    setPrefillData,
    
    // Active User
    activeUserId,
    setActiveUserId,
    activeUser: activeUserId ? teamMembers.find(m => m.id === activeUserId) || null : null,
    
    // Undo/Redo
    undoStack,
    undo,
    clearUndoStack,
    
    // Onboarding
    showOnboarding,
    startOnboarding,
    finishOnboarding,
    
    // Loading
    isLoading,
    setIsLoading,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
