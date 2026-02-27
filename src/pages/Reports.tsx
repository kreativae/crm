import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText, Download, TrendingUp, Users, CheckSquare, BarChart3,
  Filter, Calendar, FileSpreadsheet, File, Loader2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type ReportType = 'sales' | 'clients' | 'tasks' | 'performance';
type PeriodType = '7d' | '30d' | '90d' | 'year' | 'custom';

const reportTypes = [
  { id: 'sales' as ReportType, label: 'Vendas', icon: TrendingUp, color: '#10b981', bg: '#ecfdf5' },
  { id: 'clients' as ReportType, label: 'Clientes', icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'tasks' as ReportType, label: 'Tarefas', icon: CheckSquare, color: '#3b82f6', bg: '#eff6ff' },
  { id: 'performance' as ReportType, label: 'Performance', icon: BarChart3, color: '#f59e0b', bg: '#fffbeb' },
];

const periods = [
  { id: '7d' as PeriodType, label: 'Últimos 7 dias' },
  { id: '30d' as PeriodType, label: 'Últimos 30 dias' },
  { id: '90d' as PeriodType, label: 'Últimos 90 dias' },
  { id: 'year' as PeriodType, label: 'Este ano' },
  { id: 'custom' as PeriodType, label: 'Personalizado' },
];

export default function Reports() {
  const { clients, deals, tasks, teamMembers } = useApp();
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [memberFilter, setMemberFilter] = useState('all');
  const [exporting, setExporting] = useState<string | null>(null);

  const activeReport = reportTypes.find(r => r.id === reportType)!;

  // Calculate report data
  const reportData = useMemo(() => {
    const closedDeals = deals.filter(d => d.stage === 'closed');
    const lostDeals = deals.filter(d => d.stage === 'lost');
    const activeDeals = deals.filter(d => !['closed', 'lost'].includes(d.stage));
    const totalRevenue = closedDeals.reduce((s, d) => s + d.value, 0);
    const avgTicket = closedDeals.length > 0 ? totalRevenue / closedDeals.length : 0;
    const activeTasks = tasks.filter(t => t.status !== 'done');
    const doneTasks = tasks.filter(t => t.status === 'done');
    const overdueTasks = tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date());
    const activeClients = clients.filter(c => c.status === 'active');
    const leads = clients.filter(c => c.status === 'lead');

    return {
      sales: {
        kpis: [
          { label: 'Receita Total', value: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), change: '+12%', up: true },
          { label: 'Deals Fechados', value: closedDeals.length.toString(), change: '+3', up: true },
          { label: 'Ticket Médio', value: avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), change: '+8%', up: true },
          { label: 'Pipeline Ativo', value: activeDeals.reduce((s, d) => s + d.value, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), change: `${activeDeals.length} deals`, up: true },
        ],
        headers: ['Negociação', 'Cliente', 'Valor', 'Estágio', 'Responsável', 'Previsão'],
        rows: deals.filter(d => memberFilter === 'all' || d.assignedTo === memberFilter).map(d => ({
          cols: [d.title, clients.find(c => c.id === d.clientId)?.name || '-', d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), d.stage, d.assignedTo, d.expectedCloseDate],
          raw: d
        }))
      },
      clients: {
        kpis: [
          { label: 'Total de Clientes', value: clients.length.toString(), change: '+5', up: true },
          { label: 'Clientes Ativos', value: activeClients.length.toString(), change: `${((activeClients.length / Math.max(clients.length, 1)) * 100).toFixed(0)}%`, up: true },
          { label: 'Leads', value: leads.length.toString(), change: 'Novos', up: true },
          { label: 'Valor Estimado', value: clients.reduce((s, c) => s + c.estimatedValue, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), change: '+15%', up: true },
        ],
        headers: ['Nome', 'Email', 'Tipo', 'Status', 'Score', 'Valor Estimado'],
        rows: clients.filter(c => memberFilter === 'all' || c.assignedTo === memberFilter).map(c => ({
          cols: [c.name, c.email, c.type, c.status, c.score.toString(), c.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
          raw: c
        }))
      },
      tasks: {
        kpis: [
          { label: 'Total de Tarefas', value: tasks.length.toString(), change: 'Todas', up: true },
          { label: 'Concluídas', value: doneTasks.length.toString(), change: `${((doneTasks.length / Math.max(tasks.length, 1)) * 100).toFixed(0)}%`, up: true },
          { label: 'Pendentes', value: activeTasks.length.toString(), change: `${activeTasks.length}`, up: false },
          { label: 'Atrasadas', value: overdueTasks.length.toString(), change: 'Atenção', up: false },
        ],
        headers: ['Tarefa', 'Responsável', 'Prioridade', 'Status', 'Prazo', 'Vínculo'],
        rows: tasks.filter(t => memberFilter === 'all' || t.assignedTo === memberFilter).map(t => ({
          cols: [t.title, t.assignedTo, t.priority, t.status, t.dueDate, t.relatedTo?.name || '-'],
          raw: t
        }))
      },
      performance: {
        kpis: [
          { label: 'Membros Ativos', value: teamMembers.filter(m => m.status === 'active').length.toString(), change: 'Equipe', up: true },
          { label: 'Total Vendido', value: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), change: '+12%', up: true },
          { label: 'Deals Perdidos', value: lostDeals.length.toString(), change: lostDeals.length > 0 ? '-' + lostDeals.length : '0', up: false },
          { label: 'Taxa Conversão', value: `${deals.length > 0 ? ((closedDeals.length / deals.length) * 100).toFixed(0) : 0}%`, change: 'Geral', up: true },
        ],
        headers: ['Membro', 'Cargo', 'Deals', 'Receita', 'Clientes', 'Conversão'],
        rows: teamMembers.filter(m => m.status === 'active' && (memberFilter === 'all' || m.name === memberFilter)).map(m => {
          const memberDeals = deals.filter(d => d.assignedTo === m.name);
          const memberClosed = memberDeals.filter(d => d.stage === 'closed');
          const memberRevenue = memberClosed.reduce((s, d) => s + d.value, 0);
          const memberClients = clients.filter(c => c.assignedTo === m.name);
          const conversion = memberDeals.length > 0 ? ((memberClosed.length / memberDeals.length) * 100).toFixed(0) + '%' : '0%';
          return {
            cols: [m.name, m.role, memberDeals.length.toString(), memberRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), memberClients.length.toString(), conversion],
            raw: m
          };
        })
      }
    };
  }, [clients, deals, tasks, teamMembers, memberFilter]);

  const currentData = reportData[reportType];

  // Export functions
  const exportPDF = async () => {
    setExporting('pdf');
    await new Promise(r => setTimeout(r, 800));

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text('NexusCRM', 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Relatório de ${activeReport.label}`, 14, 32);
    doc.setFontSize(10);
    doc.setTextColor(130, 130, 130);
    doc.text(`Período: ${periods.find(p => p.id === period)?.label || period}`, 14, 40);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 46);

    // KPIs
    let y = 56;
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    currentData.kpis.forEach((kpi, i) => {
      doc.text(`${kpi.label}: ${kpi.value}`, 14 + (i % 2) * 95, y + Math.floor(i / 2) * 10);
    });
    y += Math.ceil(currentData.kpis.length / 2) * 10 + 10;

    // Table
    autoTable(doc, {
      startY: y,
      head: [currentData.headers],
      body: currentData.rows.map(r => r.cols),
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 243, 255] },
    });

    doc.save(`nexuscrm-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
    setExporting(null);
  };

  const exportExcel = async () => {
    setExporting('excel');
    await new Promise(r => setTimeout(r, 600));

    const wsData = [currentData.headers, ...currentData.rows.map(r => r.cols)];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeReport.label);
    XLSX.writeFile(wb, `nexuscrm-${reportType}-${new Date().toISOString().split('T')[0]}.xlsx`);
    setExporting(null);
  };

  const exportCSV = async () => {
    setExporting('csv');
    await new Promise(r => setTimeout(r, 400));

    const csvContent = [currentData.headers.join(','), ...currentData.rows.map(r => r.cols.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nexuscrm-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setExporting(null);
  };

  const statusLabels: Record<string, string> = {
    lead: 'Lead', negotiation: 'Negociação', active: 'Ativo', inactive: 'Inativo', lost: 'Perdido',
    new: 'Novo', qualified: 'Qualificado', proposal: 'Proposta', closed: 'Fechado',
    todo: 'A Fazer', in_progress: 'Em Progresso', done: 'Concluída',
    low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente',
    owner: 'Owner', admin: 'Admin', vendedor: 'Vendedor', atendimento: 'Atendimento', financeiro: 'Financeiro',
  };

  return (
    <div className="w-full min-h-full p-5 lg:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: activeReport.bg }}>
              <FileText className="w-5 h-5" style={{ color: activeReport.color }} />
            </div>
            Relatórios
          </h1>
          <p className="text-sm text-gray-500 mt-1">Analise e exporte dados do seu negócio</p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportPDF}
            disabled={!!exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-all"
          >
            {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
            PDF
          </button>
          <button
            onClick={exportExcel}
            disabled={!!exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition-all"
          >
            {exporting === 'excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Excel
          </button>
          <button
            onClick={exportCSV}
            disabled={!!exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-all"
          >
            {exporting === 'csv' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            CSV
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {reportTypes.map(rt => {
          const Icon = rt.icon;
          const active = reportType === rt.id;
          return (
            <button
              key={rt.id}
              onClick={() => setReportType(rt.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              style={active ? { background: `linear-gradient(135deg, ${rt.color}, ${rt.color}dd)`, boxShadow: `0 4px 14px ${rt.color}40` } : undefined}
            >
              <Icon className="w-4 h-4" />
              {rt.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filtros:</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodType)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
          >
            {periods.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
          >
            <option value="all">Todos os membros</option>
            {teamMembers.filter(m => m.status === 'active').map(m => (
              <option key={m.id} value={reportType === 'performance' ? m.name : m.name}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-xs text-gray-400">
          {currentData.rows.length} registro{currentData.rows.length !== 1 ? 's' : ''} encontrado{currentData.rows.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentData.kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="text-sm text-gray-500 font-medium mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
              {kpi.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {currentData.headers.map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.rows.length === 0 ? (
                <tr>
                  <td colSpan={currentData.headers.length} className="text-center py-12 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Nenhum dado encontrado</p>
                    <p className="text-sm mt-1">Ajuste os filtros para ver resultados</p>
                  </td>
                </tr>
              ) : (
                currentData.rows.map((row, r) => (
                  <tr key={r} className="border-b border-gray-50 last:border-0 hover:bg-violet-50/30 transition-colors">
                    {row.cols.map((col, c) => (
                      <td key={c} className="px-5 py-3.5 text-sm text-gray-700">
                        {statusLabels[col] ? (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            ['active', 'Ativo', 'closed', 'done'].includes(col) ? 'bg-emerald-100 text-emerald-700' :
                            ['lead', 'new', 'todo'].includes(col) ? 'bg-blue-100 text-blue-700' :
                            ['negotiation', 'in_progress', 'proposal'].includes(col) ? 'bg-amber-100 text-amber-700' :
                            ['lost', 'urgent'].includes(col) ? 'bg-red-100 text-red-700' :
                            ['high'].includes(col) ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {statusLabels[col]}
                          </span>
                        ) : (
                          <span className={c === 0 ? 'font-medium text-gray-900' : ''}>{col}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
