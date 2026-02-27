export type ClientStatus = 'lead' | 'em_negociacao' | 'ativo' | 'inativo' | 'perdido';
export type ClientType = 'PF' | 'PJ';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: ClientType;
  tags: string[];
  status: ClientStatus;
  assignedTo: string;
  leadScore: number;
  estimatedValue: number;
  notes: string[];
  createdAt: string;
  avatar?: string;
}

export type DealStage = 'novo_lead' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';

export interface Deal {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
}

export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat' | 'email';

export interface Message {
  id: string;
  sender: 'client' | 'agent' | 'bot';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  channel: Channel;
  messages: Message[];
  assignedTo: string;
  status: 'open' | 'closed';
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  relatedTo?: {
    type: 'client' | 'deal' | 'conversation';
    id: string;
    name: string;
  };
  assignedTo: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}

export type UserRole = 'owner' | 'admin' | 'vendedor' | 'atendimento' | 'financeiro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
}

export type Page = 'dashboard' | 'clients' | 'crm' | 'omnichannel' | 'tasks' | 'team' | 'reports' | 'settings';
