import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Zap, LayoutDashboard, Users, Kanban, CheckSquare, MessageCircle, Settings } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const steps = [
  {
    icon: Zap,
    emoji: '👋',
    title: 'Bem-vindo ao NexusCRM!',
    description: 'Sua plataforma completa de gestão de relacionamento com clientes. Vamos fazer um tour rápido pelas funcionalidades principais.',
    tip: 'Você pode pular este tour a qualquer momento e acessá-lo novamente em Configurações > Geral.',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    page: null,
  },
  {
    icon: LayoutDashboard,
    emoji: '📊',
    title: 'Dashboard',
    description: 'Aqui você tem uma visão executiva do seu negócio. KPIs em tempo real, gráficos de receita, ranking do time e funil de conversão.',
    tip: 'Todos os dados são atualizados automaticamente quando você faz alterações em outras páginas.',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    page: 'dashboard',
  },
  {
    icon: Users,
    emoji: '👥',
    title: 'Clientes',
    description: 'Gerencie sua base de contatos (PF e PJ). Busca, filtros por status, lead score, tags e valor estimado. Clique em qualquer cliente para ver detalhes.',
    tip: 'Use o Quick View para ver e editar informações rapidamente sem sair da página.',
    color: '#3b82f6',
    bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    page: 'clients',
  },
  {
    icon: Kanban,
    emoji: '📈',
    title: 'CRM & Leads',
    description: 'Pipeline visual com drag-and-drop. Arraste negociações entre estágios, altere status do cliente e crie tarefas vinculadas.',
    tip: 'Automações: ao fechar um deal, o cliente vira "ativo" e uma tarefa de onboarding é criada automaticamente!',
    color: '#10b981',
    bg: 'linear-gradient(135deg, #10b981, #059669)',
    page: 'crm',
  },
  {
    icon: MessageCircle,
    emoji: '💬',
    title: 'Omnichannel',
    description: 'Central unificada de comunicação. WhatsApp, Instagram, Telegram, Email e Webchat — tudo em um só lugar.',
    tip: 'Envie mensagens diretamente pelo sistema e veja o histórico completo de cada conversa.',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    page: 'omnichannel',
  },
  {
    icon: CheckSquare,
    emoji: '✅',
    title: 'Tarefas',
    description: 'Gestão operacional com visualização Kanban ou Lista. Colunas personalizáveis, drag-and-drop, prioridades e vínculos.',
    tip: 'Você pode criar novas colunas e personalizar nomes, cores e ícones!',
    color: '#ec4899',
    bg: 'linear-gradient(135deg, #ec4899, #db2777)',
    page: 'tasks',
  },
  {
    icon: Settings,
    emoji: '⚙️',
    title: 'Configurações',
    description: 'Personalize tudo: usuários, permissões, white label, pipeline, metas, webhooks, API keys, integrações e muito mais.',
    tip: 'Na aba Pipeline, arraste os estágios para reorganizar as colunas do CRM.',
    color: '#6b7280',
    bg: 'linear-gradient(135deg, #6b7280, #4b5563)',
    page: 'settings',
  },
  {
    icon: Sparkles,
    emoji: '🚀',
    title: 'Tudo Pronto!',
    description: 'Agora você conhece as principais funcionalidades do NexusCRM. Use o atalho ⌘K para buscar qualquer coisa rapidamente.',
    tip: 'Dica: Use o botão "Criar" no topo para adicionar clientes, negociações e tarefas de qualquer página!',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    page: null,
  },
];

export default function OnboardingTour({ isOpen, onClose, onNavigate }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    const nextStep = steps[currentStep + 1];
    if (nextStep.page) onNavigate(nextStep.page);
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (isFirst) return;
    const prevStep = steps[currentStep - 1];
    if (prevStep.page) onNavigate(prevStep.page);
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99998 }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
        style={{ boxShadow: `0 0 80px ${step.color}20, 0 25px 50px -12px rgba(0,0,0,0.25)` }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%`, background: step.bg }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="relative mx-auto mb-6">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg relative overflow-hidden"
              style={{ background: step.bg }}
            >
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
              <Icon className="w-9 h-9 text-white relative z-10" />
            </div>
            <span className="absolute -bottom-2 -right-2 text-3xl">{step.emoji}</span>
          </div>

          {/* Step indicator */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: step.color }}>
            Passo {currentStep + 1} de {steps.length}
          </p>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>

          {/* Tip */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 text-left">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
              <p className="text-sm text-violet-700">{step.tip}</p>
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pb-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const s = steps[i];
                if (s.page) onNavigate(s.page);
                setCurrentStep(i);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 h-2.5' : 'w-2.5 h-2.5 hover:scale-125'
              }`}
              style={{
                background: i === currentStep ? step.bg : i < currentStep ? step.color + '40' : '#e5e7eb',
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            Pular tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              style={{ background: step.bg, boxShadow: `0 4px 14px ${step.color}40` }}
            >
              {isLast ? 'Começar!' : 'Próximo'}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
