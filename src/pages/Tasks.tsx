import { useState } from 'react';
import {
  Plus, Calendar, User, Link2, CheckCircle2, Circle,
  Clock, LayoutGrid, List, AlertTriangle, X, Pencil, Trash2,
  MessageSquare, Target, Users, FileText, History,
  ChevronRight, Save, ClipboardList, Settings2, GripVertical,
} from 'lucide-react';
import { useApp, Task, TaskColumn } from '../context/AppContext';
import { cn } from '../utils/cn';

type TaskPriority = Task['priority'];

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  low: { label: 'Baixa', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', emoji: '🟢' },
  medium: { label: 'Média', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', emoji: '🔵' },
  high: { label: 'Alta', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', emoji: '🟡' },
  urgent: { label: 'Urgente', color: '#ef4444', bg: '#fef2f2', border: '#fecaca', emoji: '🔴' },
};

const availableColors = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Violeta', value: '#8b5cf6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Âmbar', value: '#f59e0b' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Ciano', value: '#06b6d4' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Esmeralda', value: '#059669' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Fúcsia', value: '#d946ef' },
  { name: 'Cinza', value: '#64748b' },
];

const availableIcons = ['📋', '🔄', '✅', '⏳', '🎯', '🔥', '⭐', '🚀', '📌', '💼', '📊', '🏷️'];

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function getColumnStyles(color: string) {
  const rgb = hexToRgb(color);
  return {
    bg: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`,
    border: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
    accent: color,
  };
}

export function Tasks() {
  const { 
    tasks, 
    clients,
    deals,
    updateTask, 
    deleteTask, 
    completeTask,
    setIsCreateTaskModalOpen,
    navigateToClient,
    navigateToDeal,
    teamMembers,
    taskColumns,
    addTaskColumn,
    updateTaskColumn,
    deleteTaskColumn,
    reorderTaskColumns,
  } = useApp();
  
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Column modal state
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<TaskColumn | null>(null);
  const [columnForm, setColumnForm] = useState({ name: '', color: '#3b82f6', icon: '📋' });
  const [columnError, setColumnError] = useState('');

  const handleDrop = (targetStatus: string) => {
    if (!draggedTask) return;
    updateTask(draggedTask, { status: targetStatus as Task['status'] });
    setDraggedTask(null);
  };

  const handleColumnDrop = (targetColumnId: string) => {
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }
    
    const sourceIndex = taskColumns.findIndex(c => c.id === draggedColumn);
    const targetIndex = taskColumns.findIndex(c => c.id === targetColumnId);
    
    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newColumns = [...taskColumns];
      const [removed] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(targetIndex, 0, removed);
      
      // Update order values
      const reordered = newColumns.map((col, idx) => ({ ...col, order: idx + 1 }));
      reorderTaskColumns(reordered);
    }
    
    setDraggedColumn(null);
  };

  const handleSaveTask = (updated: Task) => {
    updateTask(updated.id, updated);
    if (selectedTask?.id === updated.id) setSelectedTask(updated);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Excluir esta tarefa?')) {
      deleteTask(id);
      setSelectedTask(null);
    }
  };

  const handleCompleteTask = (id: string) => {
    completeTask(id);
    setSelectedTask(null);
  };

  // Column management
  const openAddColumnModal = () => {
    setEditingColumn(null);
    setColumnForm({ name: '', color: '#3b82f6', icon: '📋' });
    setColumnError('');
    setIsColumnModalOpen(true);
  };

  const openEditColumnModal = (column: TaskColumn) => {
    setEditingColumn(column);
    setColumnForm({ name: column.name, color: column.color, icon: column.icon });
    setColumnError('');
    setIsColumnModalOpen(true);
  };

  const handleSaveColumn = () => {
    if (!columnForm.name.trim()) {
      setColumnError('Nome da coluna é obrigatório');
      return;
    }

    const duplicateName = taskColumns.find(
      c => c.name.toLowerCase() === columnForm.name.toLowerCase() && c.id !== editingColumn?.id
    );
    if (duplicateName) {
      setColumnError('Já existe uma coluna com este nome');
      return;
    }

    if (editingColumn) {
      updateTaskColumn(editingColumn.id, {
        name: columnForm.name,
        color: columnForm.color,
        icon: columnForm.icon,
      });
    } else {
      addTaskColumn({
        name: columnForm.name,
        color: columnForm.color,
        icon: columnForm.icon,
        order: taskColumns.length + 1,
      });
    }

    setIsColumnModalOpen(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (taskColumns.length <= 1) {
      alert('Você precisa ter pelo menos uma coluna.');
      return;
    }
    if (confirm('Excluir esta coluna? As tarefas serão movidas para a primeira coluna.')) {
      deleteTaskColumn(columnId);
    }
  };

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent').length;

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(t => t.status === columnId);
  };

  const getColumnIcon = (columnId: string) => {
    const col = taskColumns.find(c => c.id === columnId);
    if (col) return col.icon;
    if (columnId === 'todo') return '📋';
    if (columnId === 'in_progress') return '🔄';
    if (columnId === 'done') return '✅';
    return '📋';
  };

  return (
    <div className="w-full min-h-full p-5 lg:p-7 flex flex-col gap-5 animate-fade-in-up">
      {/* Stats Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'A Fazer', value: todoCount, color: '#3b82f6', bg: '#eff6ff', icon: Circle },
          { label: 'Em Progresso', value: inProgressCount, color: '#f59e0b', bg: '#fffbeb', icon: Clock },
          { label: 'Concluídas', value: doneCount, color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
          { label: 'Urgentes', value: urgentCount, color: '#ef4444', bg: '#fef2f2', icon: AlertTriangle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-3.5 flex items-center gap-3 hover:shadow-md transition-all"
              style={{ borderColor: 'rgba(139,92,246,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-[18px] font-bold text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              {urgentCount} tarefa{urgentCount > 1 ? 's' : ''} urgente{urgentCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
            <button onClick={() => setView('kanban')} className={cn(
              'p-2 rounded-lg transition-all',
              view === 'kanban' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400 hover:text-slate-600'
            )}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={cn(
              'p-2 rounded-lg transition-all',
              view === 'list' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400 hover:text-slate-600'
            )}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-[13px] font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
          >
            <Plus className="w-4 h-4" /> Nova Tarefa
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max h-full" style={{ minHeight: '400px' }}>
            {taskColumns.sort((a, b) => a.order - b.order).map((col) => {
              const colStyles = getColumnStyles(col.color);
              const colTasks = getTasksByColumn(col.id);
              return (
                <div 
                  key={col.id} 
                  className={cn(
                    "w-[300px] flex flex-col gap-2 transition-all",
                    draggedColumn === col.id ? 'opacity-50 scale-95' : '',
                    draggedColumn && draggedColumn !== col.id ? 'ring-2 ring-violet-300 ring-offset-2 rounded-xl' : ''
                  )}
                  onDragOver={e => { e.preventDefault(); }}
                  onDrop={() => {
                    if (draggedColumn) handleColumnDrop(col.id);
                    else handleDrop(col.id);
                  }}
                >
                  {/* Column header */}
                  <div 
                    className="rounded-xl border p-3 shrink-0 group cursor-grab active:cursor-grabbing"
                    style={{ background: colStyles.bg, borderColor: colStyles.border }}
                    draggable
                    onDragStart={() => setDraggedColumn(col.id)}
                    onDragEnd={() => setDraggedColumn(null)}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: colStyles.accent }} />
                      <span className="text-lg">{col.icon}</span>
                      <span className="text-[13px] font-bold flex-1" style={{ color: colStyles.accent }}>{col.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/70" style={{ color: colStyles.accent }}>
                        {colTasks.length}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditColumnModal(col); }}
                          className="p-1 rounded hover:bg-white/50 transition-colors"
                        >
                          <Pencil className="w-3 h-3" style={{ color: colStyles.accent }} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteColumn(col.id); }}
                          className="p-1 rounded hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Task cards */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {colTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        columnColor={col.color}
                        onDragStart={() => setDraggedTask(task.id)}
                        isDragging={draggedTask === task.id}
                        isSelected={selectedTask?.id === task.id}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="border-2 border-dashed rounded-xl p-4 text-center" style={{ borderColor: colStyles.border }}>
                        <p className="text-[11px]" style={{ color: colStyles.accent, opacity: 0.5 }}>Solte aqui</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Add Column Card */}
            <div 
              onClick={openAddColumnModal}
              className="w-[280px] shrink-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/30 cursor-pointer hover:bg-violet-50 hover:border-violet-300 transition-all group"
              style={{ minHeight: '200px' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 text-violet-500" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-violet-600">Adicionar Coluna</p>
                <p className="text-[11px] text-violet-400 mt-0.5">Personalize seu workflow</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="flex-1 bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: 'rgba(139,92,246,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #faf9ff, #f8f7ff)' }}>
                  {['Tarefa', 'Status', 'Prioridade', 'Responsável', 'Prazo', 'Vínculo'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 border-b"
                      style={{ borderBottomColor: 'rgba(139,92,246,0.08)' }}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => {
                  const col = taskColumns.find(c => c.id === task.status);
                  const colStyles = col ? getColumnStyles(col.color) : { bg: '#f8fafc', border: '#e2e8f0', accent: '#64748b' };
                  const colName = col?.name || task.status;
                  const p = priorityConfig[task.priority];
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
                  return (
                    <tr key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={cn('cursor-pointer transition-all border-b group',
                        selectedTask?.id === task.id ? 'bg-violet-50/70' : idx % 2 === 0 ? 'hover:bg-slate-50/60' : 'bg-slate-50/30 hover:bg-slate-50/60'
                      )}
                      style={{ borderBottomColor: 'rgba(139,92,246,0.05)' }}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800 text-[13px] group-hover:text-violet-700 transition-colors">{task.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{task.description}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full border"
                          style={{ color: colStyles.accent, background: colStyles.bg, borderColor: colStyles.border }}
                        >
                          {getColumnIcon(task.status)} {colName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full border"
                          style={{ color: p.color, background: p.bg, borderColor: p.border }}
                        >
                          {p.emoji} {p.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                          >
                            {task.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-[12px] text-slate-600">{task.assignedTo.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-[12px] font-medium', isOverdue ? 'text-red-600' : 'text-slate-600')}>
                          {isOverdue && '⚠️ '}
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {task.relatedTo && (
                          <span className="text-[11.5px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                            style={{ color: '#7c3aed', background: '#f5f3ff' }}
                          >
                            <Link2 className="w-3 h-3" /> {task.relatedTo.name}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setSelectedTask(null)} />
      )}

      {/* Quick View Panel */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          taskColumns={taskColumns}
          onClose={() => setSelectedTask(null)}
          onEdit={(t) => setEditingTask(t)}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
          navigateToClient={navigateToClient}
          navigateToDeal={navigateToDeal}
        />
      )}

      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal 
          task={editingTask} 
          clients={clients}
          deals={deals}
          teamMembers={teamMembers}
          taskColumns={taskColumns}
          onClose={() => setEditingTask(null)} 
          onSave={handleSaveTask} 
        />
      )}

      {/* Column Modal */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="relative overflow-hidden px-6 py-5 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-white">{editingColumn ? 'Editar Coluna' : 'Nova Coluna'}</h2>
                  <p className="text-violet-200 text-[12px]">Personalize seu workflow</p>
                </div>
              </div>
              <button onClick={() => setIsColumnModalOpen(false)} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-2">Nome da Coluna *</label>
                <input 
                  type="text" 
                  value={columnForm.name}
                  onChange={(e) => setColumnForm(p => ({ ...p, name: e.target.value }))}
                  className={cn(
                    "w-full px-4 py-3 border rounded-xl text-[14px] focus:outline-none transition-all",
                    columnError ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
                  )}
                  placeholder="Ex: Revisão, Aprovação, Arquivado..."
                />
                {columnError && <p className="text-[11px] text-red-500 mt-1.5">{columnError}</p>}
              </div>

              {/* Color */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-2">Cor</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setColumnForm(p => ({ ...p, color: color.value }))}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110",
                        columnForm.color === color.value ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : ''
                      )}
                      style={{ background: color.value }}
                      title={color.name}
                    >
                      {columnForm.color === color.value && (
                        <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-2">Ícone</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setColumnForm(p => ({ ...p, icon }))}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110 border",
                        columnForm.icon === icon 
                          ? 'ring-2 ring-offset-2 ring-violet-500 scale-110 bg-violet-50 border-violet-300' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl p-4" style={{ background: '#f8f7ff' }}>
                <label className="block text-[12px] font-semibold text-slate-600 mb-3">Preview</label>
                <div 
                  className="rounded-xl border p-3"
                  style={{ 
                    background: getColumnStyles(columnForm.color).bg, 
                    borderColor: getColumnStyles(columnForm.color).border 
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{columnForm.icon}</span>
                    <span className="text-[13px] font-bold" style={{ color: columnForm.color }}>
                      {columnForm.name || 'Nome da coluna'}
                    </span>
                    <span 
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/70 ml-auto"
                      style={{ color: columnForm.color }}
                    >
                      0
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex gap-3">
              <button 
                onClick={() => setIsColumnModalOpen(false)} 
                className="flex-1 py-2.5 text-[13px] font-semibold text-slate-600 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveColumn}
                className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}
              >
                <Save className="w-4 h-4" />
                {editingColumn ? 'Salvar Alterações' : 'Criar Coluna'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, columnColor, onDragStart, isDragging, isSelected, onClick }: {
  task: Task; columnColor: string; onDragStart: () => void; isDragging: boolean; isSelected: boolean; onClick: () => void;
}) {
  const p = priorityConfig[task.priority];
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border p-3.5 cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden',
        isDragging ? 'opacity-40 rotate-1 scale-95' : 'hover:shadow-md',
      )}
      style={{
        borderColor: isSelected ? '#8b5cf6' : 'rgba(139,92,246,0.08)',
        boxShadow: isSelected ? '0 0 0 2px #8b5cf6, 0 4px 12px rgba(139,92,246,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Color accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: columnColor }} />
      
      <div className="flex items-start gap-2 mb-2.5 mt-1">
        <p className="font-semibold text-slate-800 text-[13px] flex-1 leading-tight">{task.title}</p>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0"
          style={{ color: p.color, background: p.bg, borderColor: p.border }}
        >
          {p.emoji}
        </span>
      </div>

      {task.description && (
        <p className="text-[11.5px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      {task.relatedTo && (
        <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg" style={{ background: '#f5f3ff' }}>
          <Link2 className="w-3 h-3 text-violet-500" />
          <span className="text-[11px] text-violet-600 font-medium truncate">{task.relatedTo.name}</span>
        </div>
      )}

      {isOverdue && (
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-red-600">
          <AlertTriangle className="w-3 h-3" /> Atrasada
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
            {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
          >
            {task.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span className="truncate max-w-[70px]">{task.assignedTo.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
}

function TaskDetailPanel({ task, taskColumns, onClose, onEdit, onDelete, onComplete, navigateToClient, navigateToDeal }: {
  task: Task; 
  taskColumns: TaskColumn[];
  onClose: () => void; 
  onEdit: (t: Task) => void; 
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  navigateToClient: (id: string) => void;
  navigateToDeal: (id: string) => void;
}) {
  const col = taskColumns.find(c => c.id === task.status);
  const colName = col?.name || task.status;
  const colIcon = col?.icon || '📋';
  const p = priorityConfig[task.priority];
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  const handleNavigateToRelated = () => {
    if (!task.relatedTo) return;
    if (task.relatedTo.type === 'client') {
      navigateToClient(task.relatedTo.id);
    } else if (task.relatedTo.type === 'deal') {
      navigateToDeal(task.relatedTo.id);
    }
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
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 mb-1.5">
                <ClipboardList className="w-4 h-4 text-violet-200" />
                <span className="text-violet-200 text-[11px] uppercase tracking-widest font-medium">Tarefa</span>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">{task.title}</h2>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => onEdit(task)} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => onDelete(task.id)} className="p-2 rounded-lg bg-white/15 hover:bg-red-500/40 text-white transition-all"><Trash2 className="w-4 h-4" /></button>
              <button onClick={onClose} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white">
              {colIcon} {colName}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white">
              {p.emoji} {p.label}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/30 text-white">
                <AlertTriangle className="w-3 h-3" /> Atrasada
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Description */}
        {task.description && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Descrição
            </h3>
            <p className="text-[13px] text-slate-700 leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border"
            style={isOverdue ? { background: '#fef2f2', borderColor: '#fecaca' } : { background: '#f5f3ff', borderColor: '#ddd6fe' }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5" style={{ color: isOverdue ? '#ef4444' : '#8b5cf6' }} />
              <span className="text-[11px] font-semibold" style={{ color: isOverdue ? '#ef4444' : '#8b5cf6' }}>Prazo</span>
            </div>
            <p className="text-[15px] font-bold" style={{ color: isOverdue ? '#dc2626' : '#7c3aed' }}>
              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-semibold text-blue-600">Responsável</span>
            </div>
            <p className="text-[13px] font-bold text-blue-700 truncate">{task.assignedTo}</p>
          </div>
        </div>

        {/* Related */}
        {task.relatedTo && (
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#f1f0ff' }}>
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> Vinculado a
            </h3>
            <button 
              onClick={handleNavigateToRelated}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors"
              style={{ background: '#f5f3ff' }}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center')}
                style={{
                  background: task.relatedTo.type === 'client' ? '#ecfdf5' : task.relatedTo.type === 'deal' ? '#f5f3ff' : '#eff6ff'
                }}
              >
                {task.relatedTo.type === 'client' && <Users className="w-5 h-5 text-emerald-600" />}
                {task.relatedTo.type === 'deal' && <Target className="w-5 h-5 text-violet-600" />}
                {task.relatedTo.type === 'conversation' && <MessageSquare className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-slate-800 text-[13px] truncate">{task.relatedTo.name}</p>
                <p className="text-[11px] text-slate-400">
                  {task.relatedTo.type === 'client' ? 'Cliente' : task.relatedTo.type === 'deal' ? 'Negociação' : 'Conversa'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        )}

        {/* History */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#f1f0ff' }}>
          <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Histórico
          </h3>
          <div className="space-y-0">
            {[
              { icon: Plus, color: '#8b5cf6', bg: '#f5f3ff', text: 'Tarefa criada', sub: `Em ${new Date(task.createdAt).toLocaleDateString('pt-BR')}` },
              ...(task.status === 'in_progress' || task.status === 'done' ? [{
                icon: Clock, color: '#f59e0b', bg: '#fffbeb', text: 'Iniciada', sub: 'Status: Em Progresso'
              }] : []),
              ...(task.status === 'done' ? [{
                icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5', text: 'Concluída', sub: 'Marcada como finalizada'
              }] : []),
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: item.bg }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#f1f5f9', minHeight: '16px' }} />}
                  </div>
                  <div className="pt-1">
                    <p className="text-[13px] font-medium text-slate-800">{item.text}</p>
                    <p className="text-[11px] text-slate-400">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-slate-50/80 flex gap-2 shrink-0">
        <button onClick={() => onEdit(task)} className="flex-1 py-2.5 text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}
        >
          <Pencil className="w-4 h-4" /> Editar Tarefa
        </button>
        {task.status !== 'done' && (
          <button 
            onClick={() => onComplete(task.id)}
            className="flex-1 py-2.5 border text-[13px] font-semibold flex items-center justify-center gap-2 rounded-xl transition-all hover:opacity-90"
            style={{ borderColor: '#a7f3d0', color: '#059669', background: '#ecfdf5' }}
          >
            <CheckCircle2 className="w-4 h-4" /> Concluir
          </button>
        )}
      </div>
    </div>
  );
}

function EditTaskModal({ task, clients, deals, teamMembers, taskColumns, onClose, onSave }: {
  task: Task; 
  clients: { id: string; name: string }[];
  deals: { id: string; title: string }[];
  teamMembers: { id: string; name: string }[];
  taskColumns: TaskColumn[];
  onClose: () => void; 
  onSave: (t: Task) => void;
}) {
  const [formData, setFormData] = useState({
    title: task.title, 
    description: task.description,
    status: task.status, 
    priority: task.priority,
    dueDate: task.dueDate, 
    assignedTo: task.assignedTo,
    relatedToType: task.relatedTo?.type || '',
    relatedToId: task.relatedTo?.id || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = 'Título obrigatório';
    if (!formData.dueDate) e.dueDate = 'Prazo obrigatório';
    if (!formData.assignedTo) e.assignedTo = 'Responsável obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getRelationName = () => {
    if (formData.relatedToType === 'client') {
      return clients.find(c => c.id === formData.relatedToId)?.name || '';
    } else if (formData.relatedToType === 'deal') {
      return deals.find(d => d.id === formData.relatedToId)?.title || '';
    }
    return '';
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      onSave({
        ...task, 
        title: formData.title, 
        description: formData.description,
        status: formData.status, 
        priority: formData.priority,
        dueDate: formData.dueDate, 
        assignedTo: formData.assignedTo,
        relatedTo: formData.relatedToType && formData.relatedToId
          ? { 
              type: formData.relatedToType as 'client' | 'deal' | 'conversation', 
              id: formData.relatedToId, 
              name: getRelationName() 
            }
          : null,
      });
      setSaving(false);
    }, 600);
  };

  const inputCls = (field: string) => cn(
    'w-full px-3.5 py-2.5 border rounded-xl text-[13px] focus:outline-none transition-all bg-white',
    errors[field] ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        <div className="relative overflow-hidden px-6 py-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">Editar Tarefa</h2>
              <p className="text-violet-200 text-[12px]">Atualize os dados da tarefa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Título *</label>
            <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className={inputCls('title')} />
            {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Descrição</label>
            <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className={cn(inputCls('description'), 'resize-none')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Status</label>
              <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as Task['status'] }))} className={inputCls('status')}>
                {taskColumns.map(col => <option key={col.id} value={col.id}>{col.icon} {col.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Prioridade</label>
              <select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as TaskPriority }))} className={inputCls('priority')}>
                {Object.entries(priorityConfig).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Prazo *</label>
              <input type="date" value={formData.dueDate} onChange={e => setFormData(p => ({ ...p, dueDate: e.target.value }))} className={inputCls('dueDate')} />
              {errors.dueDate && <p className="text-[11px] text-red-500 mt-1">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Responsável *</label>
              <select value={formData.assignedTo} onChange={e => setFormData(p => ({ ...p, assignedTo: e.target.value }))} className={inputCls('assignedTo')}>
                <option value="">Selecione...</option>
                {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
              {errors.assignedTo && <p className="text-[11px] text-red-500 mt-1">{errors.assignedTo}</p>}
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#f8f7ff' }}>
            <label className="block text-[12px] font-semibold text-slate-600 mb-3">Vincular a</label>
            <div className="grid grid-cols-2 gap-3">
              <select 
                value={formData.relatedToType} 
                onChange={e => setFormData(p => ({ ...p, relatedToType: e.target.value, relatedToId: '' }))} 
                className={inputCls('relatedToType')}
              >
                <option value="">Tipo...</option>
                <option value="client">Cliente</option>
                <option value="deal">Negociação</option>
              </select>
              <select 
                value={formData.relatedToId} 
                onChange={e => setFormData(p => ({ ...p, relatedToId: e.target.value }))} 
                className={inputCls('relatedToId')} 
                disabled={!formData.relatedToType}
              >
                <option value="">Selecione...</option>
                {formData.relatedToType === 'client' && clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                {formData.relatedToType === 'deal' && deals.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold text-slate-600 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all">Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-2.5 text-[13px] font-semibold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}
          >
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando...</> : <><Save className="w-4 h-4" />Salvar Alterações</>}
          </button>
        </div>
      </div>
    </div>
  );
}
