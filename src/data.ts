import type { Client, Deal, Conversation, Task, User } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Carlos Silva', email: 'carlos@nexus.com', role: 'owner', active: true },
  { id: 'u2', name: 'Ana Souza', email: 'ana@nexus.com', role: 'admin', active: true },
  { id: 'u3', name: 'Bruno Costa', email: 'bruno@nexus.com', role: 'vendedor', active: true },
  { id: 'u4', name: 'Maria Oliveira', email: 'maria@nexus.com', role: 'atendimento', active: true },
  { id: 'u5', name: 'Pedro Lima', email: 'pedro@nexus.com', role: 'vendedor', active: true },
  { id: 'u6', name: 'Julia Ferreira', email: 'julia@nexus.com', role: 'financeiro', active: false },
];

export const clients: Client[] = [
  { id: 'c1', name: 'TechSoft Ltda', email: 'contato@techsoft.com', phone: '(11) 99999-0001', document: '12.345.678/0001-01', type: 'PJ', tags: ['Enterprise', 'Tech'], status: 'ativo', assignedTo: 'Carlos Silva', leadScore: 92, estimatedValue: 150000, notes: ['Cliente desde 2022'], createdAt: '2024-01-15' },
  { id: 'c2', name: 'João Pereira', email: 'joao@email.com', phone: '(11) 98888-0002', document: '123.456.789-00', type: 'PF', tags: ['Premium'], status: 'em_negociacao', assignedTo: 'Ana Souza', leadScore: 78, estimatedValue: 25000, notes: [], createdAt: '2024-03-20' },
  { id: 'c3', name: 'StartUp Hub SA', email: 'info@startuphub.com', phone: '(21) 97777-0003', document: '98.765.432/0001-02', type: 'PJ', tags: ['Startup', 'Inovação'], status: 'lead', assignedTo: 'Bruno Costa', leadScore: 65, estimatedValue: 80000, notes: ['Indicação do João'], createdAt: '2024-06-10' },
  { id: 'c4', name: 'Maria Santos', email: 'maria.s@email.com', phone: '(31) 96666-0004', document: '987.654.321-00', type: 'PF', tags: ['Varejo'], status: 'lead', assignedTo: 'Pedro Lima', leadScore: 45, estimatedValue: 12000, notes: [], createdAt: '2024-07-01' },
  { id: 'c5', name: 'Global Trade Inc', email: 'sales@globaltrade.com', phone: '(11) 95555-0005', document: '11.222.333/0001-44', type: 'PJ', tags: ['Internacional', 'Enterprise'], status: 'ativo', assignedTo: 'Carlos Silva', leadScore: 88, estimatedValue: 300000, notes: ['Contrato renovado'], createdAt: '2023-11-05' },
  { id: 'c6', name: 'Fernanda Alves', email: 'fernanda@email.com', phone: '(21) 94444-0006', document: '456.789.123-00', type: 'PF', tags: ['Serviços'], status: 'inativo', assignedTo: 'Ana Souza', leadScore: 30, estimatedValue: 8000, notes: ['Sem resposta há 30 dias'], createdAt: '2024-02-14' },
  { id: 'c7', name: 'DataFlow Systems', email: 'hello@dataflow.io', phone: '(11) 93333-0007', document: '55.666.777/0001-88', type: 'PJ', tags: ['Tech', 'SaaS'], status: 'em_negociacao', assignedTo: 'Bruno Costa', leadScore: 71, estimatedValue: 95000, notes: [], createdAt: '2024-05-22' },
  { id: 'c8', name: 'Ricardo Mendes', email: 'ricardo@email.com', phone: '(31) 92222-0008', document: '789.123.456-00', type: 'PF', tags: ['Consultoria'], status: 'perdido', assignedTo: 'Pedro Lima', leadScore: 20, estimatedValue: 15000, notes: ['Escolheu concorrente'], createdAt: '2024-04-18' },
];

export const deals: Deal[] = [
  { id: 'd1', clientId: 'c3', clientName: 'StartUp Hub SA', title: 'Implantação CRM', value: 80000, stage: 'novo_lead', probability: 20, expectedCloseDate: '2024-09-30', assignedTo: 'Bruno Costa', createdAt: '2024-06-10' },
  { id: 'd2', clientId: 'c4', clientName: 'Maria Santos', title: 'Plano Básico', value: 12000, stage: 'novo_lead', probability: 15, expectedCloseDate: '2024-10-15', assignedTo: 'Pedro Lima', createdAt: '2024-07-01' },
  { id: 'd3', clientId: 'c2', clientName: 'João Pereira', title: 'Consultoria Premium', value: 25000, stage: 'qualificado', probability: 40, expectedCloseDate: '2024-08-30', assignedTo: 'Ana Souza', createdAt: '2024-03-20' },
  { id: 'd4', clientId: 'c7', clientName: 'DataFlow Systems', title: 'Integração API', value: 95000, stage: 'proposta', probability: 60, expectedCloseDate: '2024-08-15', assignedTo: 'Bruno Costa', createdAt: '2024-05-22' },
  { id: 'd5', clientId: 'c1', clientName: 'TechSoft Ltda', title: 'Expansão Enterprise', value: 150000, stage: 'negociacao', probability: 80, expectedCloseDate: '2024-07-31', assignedTo: 'Carlos Silva', createdAt: '2024-01-15' },
  { id: 'd6', clientId: 'c5', clientName: 'Global Trade Inc', title: 'Renovação Anual', value: 300000, stage: 'fechado', probability: 100, expectedCloseDate: '2024-07-01', assignedTo: 'Carlos Silva', createdAt: '2024-06-15' },
  { id: 'd7', clientId: 'c8', clientName: 'Ricardo Mendes', title: 'Plano Consultoria', value: 15000, stage: 'perdido', probability: 0, expectedCloseDate: '2024-05-30', assignedTo: 'Pedro Lima', createdAt: '2024-04-18' },
  { id: 'd8', clientId: 'c3', clientName: 'StartUp Hub SA', title: 'Módulo Analytics', value: 45000, stage: 'qualificado', probability: 35, expectedCloseDate: '2024-10-01', assignedTo: 'Bruno Costa', createdAt: '2024-07-05' },
];

export const conversations: Conversation[] = [
  {
    id: 'cv1', clientId: 'c1', clientName: 'TechSoft Ltda', channel: 'whatsapp',
    assignedTo: 'Carlos Silva', status: 'open', lastMessage: 'Precisamos agendar a reunião de onboarding.', lastMessageTime: '10:32', unread: 2,
    messages: [
      { id: 'm1', sender: 'client', content: 'Olá, bom dia!', timestamp: '10:28', status: 'read' },
      { id: 'm2', sender: 'agent', content: 'Bom dia! Como posso ajudar?', timestamp: '10:29', status: 'read' },
      { id: 'm3', sender: 'client', content: 'Precisamos agendar a reunião de onboarding.', timestamp: '10:32', status: 'delivered' },
    ]
  },
  {
    id: 'cv2', clientId: 'c2', clientName: 'João Pereira', channel: 'instagram',
    assignedTo: 'Ana Souza', status: 'open', lastMessage: 'Qual o valor do plano premium?', lastMessageTime: '09:15', unread: 1,
    messages: [
      { id: 'm4', sender: 'client', content: 'Oi, vi o anúncio de vocês no Instagram', timestamp: '09:10', status: 'read' },
      { id: 'm5', sender: 'agent', content: 'Olá João! Obrigado pelo interesse 😊', timestamp: '09:12', status: 'read' },
      { id: 'm6', sender: 'client', content: 'Qual o valor do plano premium?', timestamp: '09:15', status: 'delivered' },
    ]
  },
  {
    id: 'cv3', clientId: 'c3', clientName: 'StartUp Hub SA', channel: 'telegram',
    assignedTo: 'Bruno Costa', status: 'open', lastMessage: 'Enviei o documento por email', lastMessageTime: '11:45', unread: 0,
    messages: [
      { id: 'm7', sender: 'client', content: 'Bruno, tudo certo?', timestamp: '11:40', status: 'read' },
      { id: 'm8', sender: 'agent', content: 'Tudo sim! Precisa do contrato atualizado?', timestamp: '11:42', status: 'read' },
      { id: 'm9', sender: 'client', content: 'Enviei o documento por email', timestamp: '11:45', status: 'read' },
    ]
  },
  {
    id: 'cv4', clientId: 'c5', clientName: 'Global Trade Inc', channel: 'email',
    assignedTo: 'Carlos Silva', status: 'open', lastMessage: 'Proposta aceita. Vamos seguir.', lastMessageTime: '08:20', unread: 1,
    messages: [
      { id: 'm10', sender: 'agent', content: 'Segue a proposta revisada conforme alinhado.', timestamp: '08:00', status: 'read' },
      { id: 'm11', sender: 'client', content: 'Proposta aceita. Vamos seguir.', timestamp: '08:20', status: 'delivered' },
    ]
  },
  {
    id: 'cv5', clientId: 'c4', clientName: 'Maria Santos', channel: 'webchat',
    assignedTo: 'Maria Oliveira', status: 'open', lastMessage: 'Obrigada pela ajuda!', lastMessageTime: 'Ontem', unread: 0,
    messages: [
      { id: 'm12', sender: 'bot', content: 'Olá! Sou o assistente virtual. Como posso ajudar?', timestamp: '14:00', status: 'read' },
      { id: 'm13', sender: 'client', content: 'Quero saber mais sobre o sistema', timestamp: '14:02', status: 'read' },
      { id: 'm14', sender: 'agent', content: 'Olá Maria! Vou te ajudar. Qual sua principal necessidade?', timestamp: '14:05', status: 'read' },
      { id: 'm15', sender: 'client', content: 'Obrigada pela ajuda!', timestamp: '14:30', status: 'read' },
    ]
  },
  {
    id: 'cv6', clientId: 'c7', clientName: 'DataFlow Systems', channel: 'whatsapp',
    assignedTo: 'Bruno Costa', status: 'closed', lastMessage: 'Perfeito, até segunda!', lastMessageTime: 'Ontem', unread: 0,
    messages: [
      { id: 'm16', sender: 'agent', content: 'A demo está agendada para segunda às 14h.', timestamp: '16:00', status: 'read' },
      { id: 'm17', sender: 'client', content: 'Perfeito, até segunda!', timestamp: '16:05', status: 'read' },
    ]
  },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Enviar proposta TechSoft', description: 'Preparar e enviar proposta de expansão', relatedTo: { type: 'deal', id: 'd5', name: 'Expansão Enterprise' }, assignedTo: 'Carlos Silva', dueDate: '2024-07-20', priority: 'high', status: 'in_progress', createdAt: '2024-07-15' },
  { id: 't2', title: 'Follow-up João Pereira', description: 'Ligar para João sobre plano premium', relatedTo: { type: 'client', id: 'c2', name: 'João Pereira' }, assignedTo: 'Ana Souza', dueDate: '2024-07-18', priority: 'medium', status: 'todo', createdAt: '2024-07-16' },
  { id: 't3', title: 'Preparar demo DataFlow', description: 'Configurar ambiente de demonstração', relatedTo: { type: 'deal', id: 'd4', name: 'Integração API' }, assignedTo: 'Bruno Costa', dueDate: '2024-07-22', priority: 'high', status: 'todo', createdAt: '2024-07-17' },
  { id: 't4', title: 'Atualizar contrato Global Trade', description: 'Revisar cláusulas de renovação', relatedTo: { type: 'client', id: 'c5', name: 'Global Trade Inc' }, assignedTo: 'Carlos Silva', dueDate: '2024-07-25', priority: 'urgent', status: 'todo', createdAt: '2024-07-18' },
  { id: 't5', title: 'Responder ticket #4521', description: 'Cliente com dúvida sobre integração', relatedTo: { type: 'conversation', id: 'cv1', name: 'TechSoft Ltda' }, assignedTo: 'Maria Oliveira', dueDate: '2024-07-19', priority: 'medium', status: 'done', createdAt: '2024-07-14' },
  { id: 't6', title: 'Qualificar lead Maria Santos', description: 'Verificar perfil e necessidades', relatedTo: { type: 'client', id: 'c4', name: 'Maria Santos' }, assignedTo: 'Pedro Lima', dueDate: '2024-07-21', priority: 'low', status: 'todo', createdAt: '2024-07-16' },
  { id: 't7', title: 'Reunião de pipeline semanal', description: 'Revisar todos os deals em andamento', assignedTo: 'Carlos Silva', dueDate: '2024-07-19', priority: 'medium', status: 'in_progress', createdAt: '2024-07-15' },
  { id: 't8', title: 'Configurar automação de emails', description: 'Criar sequência de nurturing', assignedTo: 'Ana Souza', dueDate: '2024-07-26', priority: 'low', status: 'todo', createdAt: '2024-07-18' },
];

export const dashboardData = {
  revenue: {
    predicted: 407000,
    closed: 300000,
    avgTicket: 75000,
  },
  performance: {
    leadsByChannel: [
      { name: 'WhatsApp', value: 35 },
      { name: 'Instagram', value: 25 },
      { name: 'Webchat', value: 20 },
      { name: 'Telegram', value: 12 },
      { name: 'Email', value: 8 },
    ],
    conversionByStage: [
      { stage: 'Novo Lead', count: 45, rate: 100 },
      { stage: 'Qualificado', count: 32, rate: 71 },
      { stage: 'Proposta', count: 20, rate: 44 },
      { stage: 'Negociação', count: 12, rate: 27 },
      { stage: 'Fechado', count: 8, rate: 18 },
    ],
    revenueMonthly: [
      { month: 'Jan', value: 45000 },
      { month: 'Fev', value: 52000 },
      { month: 'Mar', value: 48000 },
      { month: 'Abr', value: 61000 },
      { month: 'Mai', value: 55000 },
      { month: 'Jun', value: 72000 },
      { month: 'Jul', value: 85000 },
    ],
  },
  attendance: {
    avgResponseTime: '3min 24s',
    openConversations: 5,
    slaCompliance: 94,
  },
  team: [
    { name: 'Carlos Silva', deals: 4, revenue: 450000, conversion: 85 },
    { name: 'Bruno Costa', deals: 3, revenue: 220000, conversion: 72 },
    { name: 'Ana Souza', deals: 2, revenue: 25000, conversion: 68 },
    { name: 'Pedro Lima', deals: 2, revenue: 27000, conversion: 55 },
  ],
};
