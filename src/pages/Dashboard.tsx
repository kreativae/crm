import { useApp } from '../context/AppContext';
import { useMemo } from 'react';
import {
  DollarSign, TrendingUp, MessageCircle, Users, Target, Clock,
  ArrowUpRight, ArrowDownRight, Sparkles, Activity, BarChart3,
  Award, Zap, ChevronRight, ClipboardList,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { cn } from '../utils/cn';

const COLORS = ['#7c3aed', '#6366f1', '#3b82f6', '#06b6d4', '#10b981'];

function formatCurrency(v: number) {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);
}

const TooltipArea = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(15,10,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const TooltipBar = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(15,10,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{payload[0].value} deals</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const { setCurrentPage, setIsCreateTaskModalOpen, clients, deals, tasks, teamMembers, goals, pipelineStages, activeUser } = useApp();
  const displayUser = activeUser || teamMembers[0];

  const stats = useMemo(() => {
    const closedDeals = deals.filter(d => d.stage === 'closed');
    const revenueClosed = closedDeals.reduce((sum, d) => sum + d.value, 0);
    const activeDeals = deals.filter(d => d.stage !== 'closed' && d.stage !== 'lost');
    const revenuePredicted = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const avgTicket = closedDeals.length > 0 ? revenueClosed / closedDeals.length : 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const newLeadsToday = clients.filter(c => { const d = new Date(c.createdAt); d.setHours(0,0,0,0); return d.getTime() === today.getTime(); }).length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const proposalsInReview = deals.filter(d => d.stage === 'proposal').length;
    const totalLeads = clients.filter(c => c.status === 'lead').length;
    const convertedClients = clients.filter(c => c.status === 'active').length;
    const conversionRate = totalLeads > 0 ? ((convertedClients / (totalLeads + convertedClients)) * 100).toFixed(0) : 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const dealsThisMonth = activeDeals.filter(d => { const cd = new Date(d.expectedCloseDate); return cd.getMonth() === currentMonth && cd.getFullYear() === currentYear; });
    const revenueThisMonth = dealsThisMonth.reduce((sum, d) => sum + d.value, 0);
    const currentMonthGoals = goals.filter(g => { const gm = new Date(g.month); return gm.getMonth() === currentMonth && gm.getFullYear() === currentYear; });
    const monthTarget = currentMonthGoals.reduce((sum, g) => sum + g.targetValue, 0);
    const monthProgress = monthTarget > 0 ? Math.min(Math.round((revenueClosed / monthTarget) * 100), 100) : 0;
    const channelCounts: Record<string, number> = {};
    clients.forEach(c => {
      const ch = c.tags?.find((t: string) => ['WhatsApp', 'Instagram', 'Facebook', 'Site', 'Email'].includes(t)) || 'Outros';
      channelCounts[ch] = (channelCounts[ch] || 0) + 1;
    });
    const totalC = clients.length || 1;
    const leadsByChannel = Object.entries(channelCounts).map(([name, count]) => ({ name, value: Math.round((count / totalC) * 100) })).slice(0, 5);
    const stageMap: Record<string, string> = { new: 'Novo Lead', 'Novo Lead': 'Novo Lead', qualified: 'Qualificado', Qualificado: 'Qualificado', proposal: 'Proposta', Proposta: 'Proposta', negotiation: 'Negociação', 'Negociação': 'Negociação', closed: 'Fechado', Fechado: 'Fechado', Won: 'Fechado', lost: 'Perdido', Perdido: 'Perdido' };
    const translate = (n: string) => stageMap[n] || n.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const stageCounts: Record<string, number> = {};
    deals.forEach(d => {
      const raw = pipelineStages.find(s => s.id === d.stage)?.name || d.stage;
      const sn = translate(raw);
      stageCounts[sn] = (stageCounts[sn] || 0) + 1;
    });
    const conversionByStage = Object.entries(stageCounts).map(([stage, count]) => ({ stage, count }));
    // Team Ranking - Busca por nome OU por ID do membro
    const teamRanking = teamMembers.filter(m => m.status === 'active').map(member => {
      // Deals podem ter assignedTo como nome ou ID
      const memberDeals = deals.filter(d => d.assignedTo === member.name || d.assignedTo === member.id);
      const closedDeals = memberDeals.filter(d => d.stage === 'closed');
      const totalRevenue = closedDeals.reduce((sum, d) => sum + d.value, 0);
      const conversionRate = memberDeals.length > 0 ? Math.round((closedDeals.length / memberDeals.length) * 100) : 0;
      
      // Também contar clientes atribuídos
      const memberClients = clients.filter(c => c.assignedTo === member.name || c.assignedTo === member.id);
      const activeClients = memberClients.filter(c => c.status === 'active').length;
      
      // Tarefas concluídas
      const memberTasks = tasks.filter(t => t.assignedTo === member.name || t.assignedTo === member.id);
      const completedTasks = memberTasks.filter(t => t.status === 'done').length;
      
      return { 
        name: member.name, 
        deals: closedDeals.length, 
        totalDeals: memberDeals.length,
        revenue: totalRevenue, 
        conversion: conversionRate,
        clients: activeClients,
        completedTasks
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const revenueMonthly = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(); date.setMonth(date.getMonth() - i);
      const m = date.getMonth(), y = date.getFullYear();
      const mv = closedDeals.filter(d => { const cd = new Date(d.expectedCloseDate); return cd.getMonth() === m && cd.getFullYear() === y; }).reduce((sum, d) => sum + d.value, 0);
      revenueMonthly.push({ month: months[m], value: mv });
    }
    return { revenueClosed, revenuePredicted, avgTicket, newLeadsToday, pendingTasks, proposalsInReview, conversionRate, dealsThisMonth: dealsThisMonth.length, revenueThisMonth, monthTarget, monthProgress, leadsByChannel, conversionByStage, teamRanking, revenueMonthly, activeDealsCount: activeDeals.length };
  }, [clients, deals, tasks, teamMembers, goals, pipelineStages]);

  const firstName = displayUser?.name?.split(' ')[0] || 'Olá';
  const circumference = 2 * Math.PI * 15.9155;
  const dashOffset = circumference - (circumference * stats.monthProgress) / 100;

  return (
    <div className="w-full min-h-full p-5 lg:p-7 space-y-5 page-enter">

      {/* ── WELCOME BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl text-white" style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 35%, #6366f1 70%, #4f46e5 100%)' }}>
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full animate-orb" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)', filter: 'blur(1px)' }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.2) 0%, transparent 65%)', animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)', animationDelay: '2s' }} />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none pattern-circuit" />

        <div className="relative z-10 p-8 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-violet-200 animate-spin-slow" />
              <span className="text-violet-100 text-xs font-medium">Bem-vindo de volta, {firstName} 👋</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
              Seu pipeline está <span className="text-violet-200">aquecido!</span>
            </h2>
            <p className="text-violet-200 text-sm max-w-lg leading-relaxed">
              Você tem <span className="text-white font-semibold">{stats.dealsThisMonth} deals</span> para fechar este mês — totalizando{' '}
              <span className="text-white font-semibold">{formatCurrency(stats.revenueThisMonth)}</span> em oportunidades.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setCurrentPage('crm')}
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/15 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <Zap className="w-4 h-4" />
                Ver Pipeline
              </button>
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all hover:-translate-y-0.5"
              >
                <ClipboardList className="w-4 h-4" />
                Nova Tarefa
              </button>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="hidden lg:flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shrink-0">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9155" fill="none"
                  stroke="url(#ringGrad)" strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e9d5ff" />
                    <stop offset="100%" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white leading-none">{stats.monthProgress}%</span>
                <span className="text-[10px] text-violet-200 font-medium mt-0.5">da meta</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-bold">Meta do Mês</p>
              <p className="text-violet-200 text-xs mt-0.5">{formatCurrency(stats.revenueClosed)} / {formatCurrency(stats.monthTarget || 500000)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Receita Fechada', value: formatCurrency(stats.revenueClosed), change: '+18%', positive: true, gradient: 'from-emerald-500 to-teal-600', shadow: '0 8px 32px rgba(16,185,129,0.25)', bg: '#ecfdf5', border: '#d1fae5', sub: 'vs. mês anterior' },
          { icon: Target, label: 'Pipeline Ativo', value: formatCurrency(stats.revenuePredicted), change: '+12%', positive: true, gradient: 'from-violet-500 to-purple-600', shadow: '0 8px 32px rgba(124,58,237,0.25)', bg: '#f5f3ff', border: '#ede9fe', sub: `${stats.activeDealsCount} oportunidades` },
          { icon: TrendingUp, label: 'Ticket Médio', value: formatCurrency(stats.avgTicket), change: '+5%', positive: true, gradient: 'from-blue-500 to-indigo-600', shadow: '0 8px 32px rgba(59,130,246,0.25)', bg: '#eff6ff', border: '#dbeafe', sub: 'por negociação' },
          { icon: MessageCircle, label: 'Tarefas Pendentes', value: String(stats.pendingTasks), change: '-3', positive: false, gradient: 'from-amber-500 to-orange-600', shadow: '0 8px 32px rgba(245,158,11,0.25)', bg: '#fffbeb', border: '#fde68a', sub: 'aguardando resposta' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          const Arrow = kpi.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={kpi.label} className="group relative overflow-hidden rounded-2xl bg-white border p-5 cursor-default animate-card hover-lift" style={{ borderColor: kpi.border, animationDelay: `${i * 80}ms`, boxShadow: '0 1px 4px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)' }}>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" style={{ background: `radial-gradient(circle at 30% 50%, ${kpi.bg} 0%, transparent 70%)` }} />
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04] rounded-bl-full" style={{ background: `linear-gradient(135deg, ${kpi.gradient.split(' ')[1]}, transparent)` }} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, boxShadow: kpi.shadow }}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${kpi.gradient}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${kpi.positive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                    <Arrow className="w-3 h-3" />{kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tight">{kpi.value}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{kpi.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CHARTS ROW 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100/80 p-6 animate-card stagger-2 hover-lift" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Receita Mensal</h3>
              <p className="text-xs text-gray-400 mt-0.5">Evolução dos últimos 7 meses</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3" />+18%
              </span>
              <button onClick={() => setCurrentPage('crm')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-colors font-medium">
                Ver mais <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.revenueMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="80%" stopColor="#7c3aed" stopOpacity={0.02} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip content={<TooltipArea />} cursor={{ stroke: '#7c3aed', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="value" stroke="url(#lineGrad)" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} activeDot={{ r: 6, fill: '#7c3aed', stroke: 'white', strokeWidth: 3, filter: 'drop-shadow(0 4px 8px rgba(124,58,237,0.4))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Channel */}
        <div className="bg-white rounded-2xl border border-slate-100/80 p-6 animate-card stagger-3 hover-lift" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)' }}>
          <div className="mb-4">
            <h3 className="text-[15px] font-bold text-gray-900">Leads por Canal</h3>
            <p className="text-xs text-gray-400 mt-0.5">Distribuição das origens</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={stats.leadsByChannel} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {stats.leadsByChannel.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,10,40,0.95)', border: 'none', borderRadius: 12, color: 'white', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {stats.leadsByChannel.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3 group">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i], boxShadow: `0 2px 6px ${COLORS[i]}60` }} />
                <span className="text-xs text-gray-500 flex-1 font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: COLORS[i], transition: 'width 1s var(--spring)' }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl border border-slate-100/80 p-6 animate-card stagger-4 hover-lift" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)' }}>
          <div className="mb-4">
            <h3 className="text-[15px] font-bold text-gray-900">Funil de Conversão</h3>
            <p className="text-xs text-gray-400 mt-0.5">Leads por estágio do pipeline</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.conversionByStage} layout="vertical" margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="stage" stroke="#cbd5e1" fontSize={9} tickLine={false} axisLine={false} width={75} />
              <Tooltip content={<TooltipBar />} cursor={{ fill: 'rgba(124,58,237,0.04)' }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {stats.conversionByStage.map((_, i) => (
                  <Cell key={i} fill={`rgba(124,58,237,${Math.max(0.2, 1 - i * 0.15)})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl border border-slate-100/80 p-6 animate-card stagger-5 hover-lift" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)' }}>
          <div className="mb-6">
            <h3 className="text-[15px] font-bold text-gray-900">Atendimento</h3>
            <p className="text-xs text-gray-400 mt-0.5">Métricas de suporte</p>
          </div>
          <div className="space-y-5">
            {[
              { icon: Clock, label: 'Tempo Médio de Resposta', value: '2.5min', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
              { icon: MessageCircle, label: 'Conversas Abertas', value: String(stats.pendingTasks), color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${item.color}20` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600">{item.label}</p>
                  </div>
                  <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
              );
            })}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-gray-700">SLA Compliance</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">95%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '95%', background: 'linear-gradient(90deg, #10b981, #059669)', transition: 'width 1.2s var(--spring)' }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Metas de atendimento atingidas</p>
            </div>
          </div>
        </div>

        {/* Team Ranking */}
        <div className="bg-white rounded-2xl border border-slate-100/80 p-6 animate-card hover-lift" style={{ animationDelay: '320ms', boxShadow: '0 1px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Ranking do Time</h3>
              <p className="text-xs text-gray-400 mt-0.5">Top performers</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #fbbf24' }}>
              <Award className="w-4.5 h-4.5 text-amber-600" />
            </div>
          </div>
          <div className="space-y-2.5">
            {stats.teamRanking.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Nenhum dado disponível</p>
                <p className="text-xs mt-1">Atribua deals aos membros da equipe</p>
              </div>
            )}
            {stats.teamRanking.map((member, i) => (
              <div key={member.name} className={cn('flex items-center gap-3 p-3 rounded-xl transition-all group cursor-pointer', i === 0 ? 'border' : 'hover:bg-gray-50 border border-transparent')}
                style={i === 0 ? { background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderColor: '#fde68a' } : {}}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : i === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : i === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' : '#e5e7eb', color: i >= 3 ? '#6b7280' : 'white' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-violet-700 transition-colors">{member.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {member.deals}/{member.totalDeals} fechados
                    </span>
                    <span>·</span>
                    <span className="font-medium text-gray-600">{formatCurrency(member.revenue)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', 
                    member.conversion >= 80 ? 'text-emerald-700 bg-emerald-50' : 
                    member.conversion >= 50 ? 'text-amber-700 bg-amber-50' : 
                    member.conversion > 0 ? 'text-gray-600 bg-gray-100' : 'text-gray-400 bg-gray-50')}>
                    {member.conversion}% conv.
                  </span>
                  {member.deals > 0 && (
                    <span className="text-[10px] text-gray-400">{member.clients} clientes</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Novos Leads', value: String(stats.newLeadsToday), sub: 'Hoje', icon: Users, gradient: 'from-violet-500 to-purple-600', light: '#f5f3ff', page: 'clients' as const },
          { label: 'Tarefas Pendentes', value: String(stats.pendingTasks), sub: 'Aguardando', icon: BarChart3, gradient: 'from-blue-500 to-indigo-600', light: '#eff6ff', page: 'tasks' as const },
          { label: 'Propostas', value: String(stats.proposalsInReview), sub: 'Em análise', icon: Target, gradient: 'from-amber-500 to-orange-600', light: '#fffbeb', page: 'crm' as const },
          { label: 'Conversão', value: `${stats.conversionRate}%`, sub: 'Este mês', icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600', light: '#ecfdf5', page: 'crm' as const },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} onClick={() => setCurrentPage(stat.page)} className="group relative bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer overflow-hidden animate-card" style={{ animationDelay: `${i * 60}ms`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" style={{ background: stat.light }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
                <p className="text-[11px] text-gray-400">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
