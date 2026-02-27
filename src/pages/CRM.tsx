import { useState, useMemo } from 'react';
import {
  DollarSign, Calendar, User, TrendingUp, MoreHorizontal,
  Plus, GripVertical, X, Edit3, Trash2, Clock, Target,
  Building2, Mail, Phone, MessageSquare, CheckCircle2,
  XCircle, ArrowRight, FileText, Tag, Save, ClipboardList,
} from 'lucide-react';
import { useApp, Deal, Client, PipelineStage } from '../context/AppContext';
import { cn } from '../utils/cn';

// Helper to generate stage colors based on the main color
function generateStageColors(color: string) {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return {
    accent: color,
    bg: `rgba(${r}, ${g}, ${b}, 0.08)`,
    border: `rgba(${r}, ${g}, ${b}, 0.25)`,
    dot: color
  };
}

// Map stage IDs to internal IDs used by deals
function getStageId(stage: PipelineStage, index: number): string {
  const nameMap: Record<string, string> = {
    'novo lead': 'new',
    'qualificado': 'qualified',
    'proposta': 'proposal',
    'negociação': 'negotiation',
    'negociacao': 'negotiation',
    'fechado': 'closed',
    'perdido': 'lost',
  };
  
  const normalizedName = stage.name.toLowerCase().trim();
  if (nameMap[normalizedName]) {
    return nameMap[normalizedName];
  }
  
  // For custom stages, use the stage id or generate one
  return stage.id || `stage_${index}`;
}

function formatCurrency(v: number) {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return `R$ ${v.toLocaleString('pt-BR')}`;
}

export function CRM() {
  const { 
    deals, 
    clients,
    updateDeal, 
    deleteDeal, 
    moveDealStage,
    getClientById,
    setIsCreateDealModalOpen,
    setIsCreateTaskModalOpen,
    setPrefillData,
    navigateToClient,
    getTasksByRelation,
    teamMembers,
    pipelineStages
  } = useApp();

  // Generate stages from pipelineStages context with proper colors
  const stages = useMemo(() => {
    return pipelineStages.map((stage, index) => {
      const colors = generateStageColors(stage.color);
      const stageId = getStageId(stage, index);
      return {
        id: stageId,
        label: stage.name,
        ...colors
      };
    });
  }, [pipelineStages]);
  
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const totalPipeline = deals.filter(d => !['closed', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const weightedPipeline = deals.filter(d => !['closed', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value * d.probability / 100, 0);
  const closedRevenue = deals.filter(d => d.stage === 'closed').reduce((s, d) => s + d.value, 0);

  const handleDrop = (targetStage: string) => {
    if (!draggedDeal) return;
    moveDealStage(draggedDeal, targetStage);
    setDraggedDeal(null);
  };

  const handleSaveDeal = (updated: Deal) => {
    updateDeal(updated.id, updated);
    setSelectedDeal(updated);
    setEditingDeal(null);
  };

  const handleDeleteDeal = (id: string) => {
    if (confirm('Excluir esta oportunidade? Todas as tarefas relacionadas também serão excluídas.')) {
      deleteDeal(id);
      setSelectedDeal(null);
    }
  };

  const handleCreateTask = (deal: Deal) => {
    setPrefillData({
      relationType: 'deal',
      relationId: deal.id,
      assignedTo: deal.assignedTo
    });
    setIsCreateTaskModalOpen(true);
  };

  return (
    <>
      <div className="w-full h-full p-5 lg:p-6 flex flex-col gap-4 animate-fade-in-up overflow-hidden">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pipeline Total', value: formatCurrency(totalPipeline), sub: `${deals.filter(d => !['closed','lost'].includes(d.stage)).length} oportunidades`, color: '#8b5cf6', bg: '#f5f3ff' },
            { label: 'Receita Ponderada', value: formatCurrency(weightedPipeline), sub: 'Probabilidade ajustada', color: '#6366f1', bg: '#eef2ff' },
            { label: 'Fechado no Mês', value: formatCurrency(closedRevenue), sub: `${deals.filter(d => d.stage === 'closed').length} deals fechados`, color: '#10b981', bg: '#ecfdf5' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border p-4 flex items-center gap-3"
              style={{ borderColor: 'rgba(139,92,246,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: stat.bg }}
              >
                <DollarSign className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-500">{stat.label}</p>
                <p className="text-[10px] text-slate-400">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {stages.map(s => {
              const count = deals.filter(d => d.stage === s.id).length;
              return (
                <div key={s.id} className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border"
                  style={{ color: s.accent, background: s.bg, borderColor: s.border }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.accent }} />
                  {count}
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => setIsCreateDealModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-[13px] font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
          >
            <Plus className="w-4 h-4" /> Nova Oportunidade
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ minHeight: 0 }}>
          <div className="flex gap-3 min-w-max h-full">
            {stages.map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage.id);
              const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0);

              return (
                <div key={stage.id} className="w-[280px] flex flex-col gap-2 h-full"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(stage.id)}
                >
                  {/* Column Header */}
                  <div className="rounded-xl border p-3 shrink-0"
                    style={{ background: stage.bg, borderColor: stage.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: stage.accent }} />
                        <span className="text-[12.5px] font-bold" style={{ color: stage.accent }}>{stage.label}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/70" style={{ color: stage.accent }}>
                          {stageDeals.length}
                        </span>
                      </div>
                      <button 
                        onClick={() => setIsCreateDealModalOpen(true)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/50 transition-colors"
                        style={{ color: stage.accent }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] font-semibold mt-1" style={{ color: stage.accent }}>
                      {formatCurrency(stageTotal)}
                    </p>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 space-y-2 overflow-y-auto pr-1 pb-2" style={{ minHeight: 0 }}>
                    {stageDeals.map(deal => {
                      const client = getClientById(deal.clientId);
                      return (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          clientName={client?.name || 'Cliente não encontrado'}
                          stageAccent={stage.accent}
                          onDragStart={() => setDraggedDeal(deal.id)}
                          isDragging={draggedDeal === deal.id}
                          isSelected={selectedDeal?.id === deal.id}
                          onClick={() => setSelectedDeal(deal)}
                        />
                      );
                    })}
                    {stageDeals.length === 0 && (
                      <div className="border-2 border-dashed rounded-xl p-4 text-center"
                        style={{ borderColor: stage.border }}
                      >
                        <p className="text-[11px]" style={{ color: stage.accent, opacity: 0.6 }}>Solte aqui</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setSelectedDeal(null)} />
      )}

      {/* Quick View Panel */}
      {selectedDeal && (
        <DealDetailPanel
          deal={selectedDeal}
          client={getClientById(selectedDeal.clientId)}
          onClose={() => setSelectedDeal(null)}
          onEdit={() => setEditingDeal(selectedDeal)}
          onDelete={() => handleDeleteDeal(selectedDeal.id)}
          onCreateTask={() => handleCreateTask(selectedDeal)}
          navigateToClient={navigateToClient}
          getTasksByRelation={getTasksByRelation}
          stages={stages}
        />
      )}

      {/* Edit Modal */}
      {editingDeal && (
        <EditDealModal 
          deal={editingDeal} 
          clients={clients}
          teamMembers={teamMembers}
          onClose={() => setEditingDeal(null)} 
          onSave={handleSaveDeal}
          stages={stages}
        />
      )}
    </>
  );
}

function DealCard({ deal, clientName, stageAccent, onDragStart, isDragging, isSelected, onClick }: {
  deal: Deal; clientName: string; stageAccent: string; onDragStart: () => void; isDragging: boolean; isSelected: boolean; onClick: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border p-3.5 cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden',
        isDragging ? 'opacity-40 rotate-1 scale-95' : 'hover:shadow-md',
        isSelected ? 'ring-2 shadow-md' : ''
      )}
      style={{
        borderColor: isSelected ? stageAccent : 'rgba(139,92,246,0.08)',
        boxShadow: isSelected ? `0 0 0 2px ${stageAccent}, 0 4px 12px rgba(0,0,0,0.08)` : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"
        style={{ background: stageAccent }}
      />

      <div className="flex items-start justify-between mb-2.5">
        <div className="flex-1 min-w-0 pr-2">
          <p className="font-semibold text-slate-800 text-[13px] leading-tight truncate">{deal.title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{clientName}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <GripVertical className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={e => e.stopPropagation()} className="p-0.5 rounded hover:bg-slate-100">
            <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: `${stageAccent}15` }}
        >
          <DollarSign className="w-3 h-3" style={{ color: stageAccent }} />
        </div>
        <span className="text-[14px] font-bold text-slate-900">{formatCurrency(deal.value)}</span>
      </div>

      {/* Probability bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Probabilidade</span>
          <span className="font-semibold" style={{ color: stageAccent }}>{deal.probability}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${deal.probability}%`, background: stageAccent }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
          >
            {deal.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span className="truncate max-w-[60px]">{deal.assignedTo.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
}

function DealDetailPanel({ deal, client, onClose, onEdit, onDelete, onCreateTask, navigateToClient, getTasksByRelation, stages }: {
  deal: Deal; 
  client: Client | undefined; 
  onClose: () => void; 
  onEdit: () => void; 
  onDelete: () => void;
  onCreateTask: () => void;
  navigateToClient: (id: string) => void;
  getTasksByRelation: (type: string, id: string) => any[];
  stages: { id: string; label: string; accent: string; bg: string; border: string; dot: string }[];
}) {
  const { moveDealStage, updateClient, addNotification } = useApp();
  const stageInfo = stages.find(s => s.id === deal.stage) || stages[0];
  const dealTasks = getTasksByRelation('deal', deal.id);

  const clientStatuses = [
    { value: 'lead',        label: 'Lead',          emoji: '🎯', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
    { value: 'negotiation', label: 'Em Negociação', emoji: '🤝', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    { value: 'active',      label: 'Cliente Ativo', emoji: '✅', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    { value: 'inactive',    label: 'Inativo',       emoji: '⏸️', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
    { value: 'lost',        label: 'Perdido',       emoji: '❌', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  ];

  const handleStageChange = (stageId: string) => {
    if (stageId === deal.stage) return;
    moveDealStage(deal.id, stageId);
    const newStage = stages.find(s => s.id === stageId);
    addNotification('success', 'Estágio atualizado', `Deal movido para "${newStage?.label}"`);
  };

  const handleClientStatusChange = (status: string) => {
    if (!client || status === client.status) return;
    updateClient(client.id, { status: status as Client['status'] });
    const s = clientStatuses.find(x => x.value === status);
    addNotification('success', 'Status atualizado', `Cliente atualizado para "${s?.label}"`);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 flex flex-col animate-slide-in shadow-2xl border-l"
      style={{ borderLeftColor: 'rgba(139,92,246,0.1)' }}
    >
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-6 pb-5 shrink-0"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-violet-200 text-[11px] uppercase tracking-widest font-medium mb-1">Oportunidade</p>
              <h2 className="text-xl font-bold text-white leading-tight">{deal.title}</h2>
              <p className="text-violet-300 text-[13px] mt-1">{client?.name || 'Cliente não encontrado'}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-3">
              <button onClick={onEdit} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all"><Edit3 className="w-4 h-4" /></button>
              <button onClick={onDelete} className="p-2 rounded-lg bg-white/15 hover:bg-red-500/40 text-white transition-all"><Trash2 className="w-4 h-4" /></button>
              <button onClick={onClose} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/20 text-white">
            {deal.stage === 'closed' && <CheckCircle2 className="w-3 h-3" />}
            {deal.stage === 'lost' && <XCircle className="w-3 h-3" />}
            {stageInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* ── Stage Selector ── */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ borderColor: 'rgba(139,92,246,0.15)', background: 'linear-gradient(135deg, rgba(245,243,255,0.8), rgba(238,242,255,0.8))' }}
        >
          <div className="px-4 pt-3.5 pb-2 flex items-center gap-2 border-b" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-[11.5px] font-bold text-violet-700 uppercase tracking-wider">Estágio do Deal</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {stages.map(stage => {
              const isActive = deal.stage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageChange(stage.id)}
                  className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 group"
                  style={{
                    background: isActive ? stage.bg : 'white',
                    borderColor: isActive ? stage.accent : '#e5e7eb',
                    boxShadow: isActive ? `0 0 0 1.5px ${stage.accent}, 0 2px 8px ${stage.accent}22` : '0 1px 2px rgba(0,0,0,0.04)',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0 transition-transform"
                    style={{ background: stage.accent, transform: isActive ? 'scale(1.3)' : 'scale(1)' }}
                  />
                  <span className="text-[11.5px] font-semibold leading-tight flex-1" style={{ color: isActive ? stage.accent : '#6b7280' }}>
                    {stage.label}
                  </span>
                  {isActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: stage.accent }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Client Status Selector ── */}
        {client && (
          <div className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(16,185,129,0.15)', background: 'linear-gradient(135deg, rgba(236,253,245,0.8), rgba(240,253,244,0.8))' }}
          >
            <div className="px-4 pt-3.5 pb-2 flex items-center gap-2 border-b" style={{ borderColor: 'rgba(16,185,129,0.1)' }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11.5px] font-bold text-emerald-700 uppercase tracking-wider">Status do Cliente</span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {clientStatuses.map(s => {
                const isActive = client.status === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => handleClientStatusChange(s.value)}
                    className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-200"
                    style={{
                      background: isActive ? s.bg : 'white',
                      borderColor: isActive ? s.color : '#e5e7eb',
                      boxShadow: isActive ? `0 0 0 1.5px ${s.color}, 0 2px 8px ${s.color}22` : '0 1px 2px rgba(0,0,0,0.04)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <span className="text-[13px] shrink-0">{s.emoji}</span>
                    <span className="text-[11px] font-semibold leading-tight flex-1" style={{ color: isActive ? s.color : '#6b7280' }}>
                      {s.label}
                    </span>
                    {isActive && (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: s.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Value cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold text-emerald-600">Valor</span>
            </div>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(deal.value)}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-[11px] font-semibold text-violet-600">Probabilidade</span>
            </div>
            <p className="text-xl font-bold text-violet-700">{deal.probability}%</p>
            <div className="mt-2 w-full h-1.5 rounded-full bg-violet-200 overflow-hidden">
              <div className="h-full rounded-full bg-violet-500" style={{ width: `${deal.probability}%` }} />
            </div>
          </div>
        </div>

        {/* Weighted value */}
        <div className="rounded-xl p-4 border flex items-center justify-between" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
          <div>
            <p className="text-[11px] font-semibold text-amber-600">Valor Ponderado</p>
            <p className="text-[18px] font-bold text-amber-700">{formatCurrency(deal.value * deal.probability / 100)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-amber-400" />
        </div>

        {/* Quick Actions */}
        <button
          onClick={onCreateTask}
          className="w-full flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          <ClipboardList className="w-4 h-4 text-blue-600" />
          <span className="text-[12px] font-semibold text-blue-700">Criar Tarefa Relacionada</span>
        </button>

        {/* Related Tasks */}
        {dealTasks.length > 0 && (
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#f1f0ff' }}>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" /> Tarefas ({dealTasks.length})
            </p>
            <div className="space-y-2">
              {dealTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700">{task.title}</p>
                    <p className="text-[11px] text-slate-400">{task.dueDate}</p>
                  </div>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-medium',
                    task.status === 'done' ? 'bg-green-100 text-green-700' :
                    task.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  )}>
                    {task.status === 'done' ? 'Concluída' : task.status === 'in_progress' ? 'Em progresso' : 'A fazer'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 border border-slate-100">
          <h3 className="text-[12px] font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Detalhes
          </h3>
          {[
            { icon: Calendar, label: 'Previsão de Fechamento', value: new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR') },
            { icon: User, label: 'Responsável', value: deal.assignedTo },
            { icon: Clock, label: 'Criado em', value: new Date(deal.createdAt).toLocaleDateString('pt-BR') },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[12px]">{label}</span>
              </div>
              <span className="text-[12.5px] font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>

        {/* Client */}
        {client && (
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#f1f0ff' }}>
            <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Cliente Vinculado
            </h3>
            <button 
              onClick={() => navigateToClient(client.id)}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-violet-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px]"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
              >
                {client.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-slate-800 text-[13px] truncate">{client.name}</p>
                <p className="text-[11px] text-slate-400">{client.email}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <Mail className="w-3 h-3" /><span className="truncate">{client.email.split('@')[0]}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <Phone className="w-3 h-3" /><span>{client.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#f1f0ff' }}>
            <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Tags</h3>
            <div className="flex flex-wrap gap-2">
              {deal.tags.map(tag => (
                <span key={tag} className="text-[11.5px] px-2.5 py-1 rounded-full font-semibold border"
                  style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#e9d5ff' }}
                >{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#f1f0ff' }}>
          <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Histórico</h3>
          <div className="space-y-0">
            {deal.history.map((item, i) => (
              <div key={i} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full mt-0.5" style={{ background: '#8b5cf6' }} />
                  {i < deal.history.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#f1f5f9', minHeight: '20px' }} />}
                </div>
                <div>
                  <p className="text-[12.5px] text-slate-700">{item.action}</p>
                  <p className="text-[11px] text-slate-400">{new Date(item.date).toLocaleDateString('pt-BR')} • {item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t bg-slate-50/80 flex gap-2 shrink-0">
        <button 
          onClick={onCreateTask}
          className="flex-1 py-2.5 text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}
        >
          <MessageSquare className="w-4 h-4" /> Nova Atividade
        </button>
        <button onClick={onEdit} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
          <Edit3 className="w-4 h-4" /> Editar
        </button>
      </div>
    </div>
  );
}

function EditDealModal({ deal, clients, teamMembers, onClose, onSave, stages }: {
  deal: Deal; 
  clients: Client[];
  teamMembers: { id: string; name: string }[];
  onClose: () => void; 
  onSave: (d: Deal) => void;
  stages: { id: string; label: string; accent: string; }[];
}) {
  const [formData, setFormData] = useState({
    title: deal.title, 
    clientId: deal.clientId,
    value: deal.value, 
    probability: deal.probability, 
    stage: deal.stage,
    expectedCloseDate: deal.expectedCloseDate, 
    assignedTo: deal.assignedTo, 
    notes: deal.notes || '',
    tags: deal.tags.join(', ')
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = 'Título obrigatório';
    if (formData.value <= 0) e.value = 'Valor deve ser maior que zero';
    if (!formData.expectedCloseDate) e.expectedCloseDate = 'Data obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      onSave({ 
        ...deal, 
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setSaving(false);
    }, 600);
  };

  const inputCls = (field: string) => cn(
    'w-full px-3.5 py-2.5 border rounded-xl text-[13px] focus:outline-none transition-all bg-white input-premium',
    errors[field] ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-violet-400'
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="relative overflow-hidden px-6 py-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Edit3 className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">Editar Oportunidade</h2>
              <p className="text-violet-200 text-[12px]">Atualize os dados da negociação</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Título *</label>
            <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className={inputCls('title')} placeholder="Ex: Implementação de CRM" />
            {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Cliente</label>
            <select value={formData.clientId} onChange={e => setFormData(p => ({ ...p, clientId: e.target.value }))} className={inputCls('clientId')}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Valor (R$) *</label>
              <input type="number" value={formData.value} onChange={e => setFormData(p => ({ ...p, value: parseFloat(e.target.value) || 0 }))} className={inputCls('value')} />
              {errors.value && <p className="text-[11px] text-red-500 mt-1">{errors.value}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Probabilidade (%)</label>
              <input type="number" min="0" max="100" value={formData.probability} onChange={e => setFormData(p => ({ ...p, probability: parseInt(e.target.value) || 0 }))} className={inputCls('probability')} />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Estágio</label>
            <select value={formData.stage} onChange={e => setFormData(p => ({ ...p, stage: e.target.value }))} className={inputCls('stage')}>
              {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Previsão de Fechamento *</label>
              <input type="date" value={formData.expectedCloseDate} onChange={e => setFormData(p => ({ ...p, expectedCloseDate: e.target.value }))} className={inputCls('expectedCloseDate')} />
              {errors.expectedCloseDate && <p className="text-[11px] text-red-500 mt-1">{errors.expectedCloseDate}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Responsável</label>
              <select value={formData.assignedTo} onChange={e => setFormData(p => ({ ...p, assignedTo: e.target.value }))} className={inputCls('assignedTo')}>
                {teamMembers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Tags (separadas por vírgula)</label>
            <input type="text" value={formData.tags} onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))} className={inputCls('tags')} placeholder="Prioritário, Enterprise..." />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Notas</label>
            <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} rows={3} className={cn(inputCls('notes'), 'resize-none')} placeholder="Observações sobre a negociação..." />
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}
            >
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</> : <><Save className="w-4 h-4" /> Salvar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
