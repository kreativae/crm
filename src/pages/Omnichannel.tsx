import { useState, useRef } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  MessageSquare,
  Bot,
  Clock,
  CheckCheck,
  Check,
  ArrowRight,
  Zap,
  Hash,
  Lock,
  UserPlus,
  FileText,
  Users,
} from 'lucide-react';
import { conversations as mockConversations } from '../data';
import type { Conversation, Channel } from '../types';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

const channelConfig: Record<Channel, { label: string; color: string; bg: string }> = {
  whatsapp: { label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-100' },
  instagram: { label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-100' },
  facebook: { label: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-100' },
  telegram: { label: 'Telegram', color: 'text-sky-600', bg: 'bg-sky-100' },
  webchat: { label: 'Webchat', color: 'text-violet-600', bg: 'bg-violet-100' },
  email: { label: 'Email', color: 'text-gray-600', bg: 'bg-gray-100' },
};

const quickReplies = [
  'Olá! Como posso ajudar?',
  'Vou verificar e retorno em breve.',
  'Agendamento confirmado! ✅',
  'Segue a proposta em anexo.',
  'Posso transferir para outro atendente?',
];

export function Omnichannel() {
  const { addNotification, setCurrentPage, setIsCreateDealModalOpen, setIsCreateTaskModalOpen } = useApp();
  const [conversations, setConversations] = useState(mockConversations);
  const [selected, setSelected] = useState<Conversation>(conversations[0]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [, setShowTransferModal] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Send message function
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as const,
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selected.id 
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: message, lastMessageTime: 'Agora' }
        : conv
    ));

    setSelected(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: message,
      lastMessageTime: 'Agora',
    }));

    setMessage('');
    addNotification('success', 'Mensagem enviada', `Mensagem enviada para ${selected.clientName}`);
  };

  // Close conversation
  const handleCloseConversation = () => {
    setConversations(prev => prev.map(conv => 
      conv.id === selected.id 
        ? { ...conv, status: 'closed' }
        : conv
    ));
    setSelected(prev => ({ ...prev, status: 'closed' }));
    addNotification('info', 'Conversa encerrada', `Conversa com ${selected.clientName} foi encerrada`);
  };

  // Add emoji
  const handleAddEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Emojis list
  const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '👍', '👋', '🙏', '💪', '❤️', '✅', '⭐', '🎉', '🔥'];

  const filtered = conversations.filter((c) => {
    const matchSearch = c.clientName.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === 'all' || c.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const openCount = conversations.filter(c => c.status === 'open').length;

  return (
    <div className="flex" style={{ height: '100%', maxHeight: '100%', overflow: 'hidden' }}>
      {/* Sidebar - Conversations List */}
      <div className="w-80 lg:w-96 border-r border-gray-100 bg-white flex flex-col shrink-0" style={{ height: '100%', maxHeight: '100%' }}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-500" />
              Conversas
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{openCount}</span>
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
          </div>
          {/* Channel pills */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setChannelFilter('all')}
              className={cn('px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors', channelFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
            >
              Todos
            </button>
            {(Object.entries(channelConfig) as [Channel, { label: string }][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setChannelFilter(key)}
                className={cn('px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors', channelFilter === key ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelected(conv)}
              className={cn(
                'w-full flex items-start gap-3 p-4 border-b border-gray-50 text-left transition-colors hover:bg-gray-50',
                selected.id === conv.id && 'bg-violet-50 border-l-2 border-l-violet-500'
              )}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  {conv.clientName.charAt(0)}
                </div>
                <div className={cn('absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center', channelConfig[conv.channel].bg)}>
                  <Hash className={cn('w-2.5 h-2.5', channelConfig[conv.channel].color)} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 truncate">{conv.clientName}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">{conv.lastMessageTime}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', channelConfig[conv.channel].bg, channelConfig[conv.channel].color)}>
                    {channelConfig[conv.channel].label}
                  </span>
                  {conv.unread > 0 && (
                    <span className="w-4.5 h-4.5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center px-1.5">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50" style={{ height: '100%', maxHeight: '100%', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
              {selected.clientName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{selected.clientName}</h3>
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', channelConfig[selected.channel].bg, channelConfig[selected.channel].color)}>
                  {channelConfig[selected.channel].label}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" /> {selected.assignedTo}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => addNotification('info', 'Ligação', `Iniciando ligação para ${selected.clientName}...`)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-emerald-600 transition-colors"
              title="Ligar"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button 
              onClick={() => addNotification('info', 'Videochamada', `Iniciando videochamada com ${selected.clientName}...`)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-violet-600 transition-colors"
              title="Videochamada"
            >
              <Video className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowTransferModal(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 flex items-center gap-1 text-xs font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4" /> Transferir
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-scale-in">
                    <button 
                      onClick={() => {
                        setIsCreateTaskModalOpen(true);
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      Criar Tarefa
                    </button>
                    <button 
                      onClick={() => {
                        setIsCreateDealModalOpen(true);
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4 text-gray-400" />
                      Criar Negociação
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage('clients');
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4 text-gray-400" />
                      Ver Cliente
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button 
                      onClick={() => {
                        handleCloseConversation();
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Encerrar Conversa
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ minHeight: 0 }}>
          {selected.messages.map((msg) => (
            <div key={msg.id} className={cn('flex', msg.sender === 'agent' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm',
                msg.sender === 'agent'
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-md'
                  : msg.sender === 'bot'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-md'
                    : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
              )}>
                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-1 mb-1">
                    <Bot className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-semibold text-amber-600">Bot</span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
                <div className={cn('flex items-center justify-end gap-1 mt-1', msg.sender === 'agent' ? 'text-white/60' : 'text-gray-400')}>
                  <span className="text-[10px]">{msg.timestamp}</span>
                  {msg.sender === 'agent' && (
                    msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-sky-300" /> : <Check className="w-3 h-3" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="px-6 pb-2">
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-lg">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" /> Respostas Rápidas
              </p>
              <div className="space-y-1">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => { setMessage(qr); setShowQuickReplies(false); }}
                    className="w-full text-left text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-6 py-3 shrink-0">
          <div className="flex items-end gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={cn('p-2 rounded-lg hover:bg-gray-100 shrink-0 transition-colors', showAttachMenu ? 'text-violet-600 bg-violet-50' : 'text-gray-400')}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              {showAttachMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAttachMenu(false)} />
                  <div className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-scale-in">
                    <button 
                      onClick={() => { addNotification('info', 'Anexo', 'Selecione uma imagem...'); setShowAttachMenu(false); }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      📷 Imagem
                    </button>
                    <button 
                      onClick={() => { addNotification('info', 'Anexo', 'Selecione um documento...'); setShowAttachMenu(false); }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      📄 Documento
                    </button>
                    <button 
                      onClick={() => { addNotification('info', 'Anexo', 'Selecione um arquivo...'); setShowAttachMenu(false); }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      📁 Arquivo
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className={cn('p-2 rounded-lg hover:bg-gray-100 shrink-0', showQuickReplies ? 'text-violet-600 bg-violet-50' : 'text-gray-400')}
            >
              <Zap className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Digite sua mensagem..."
                rows={1}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={cn('p-2 rounded-lg hover:bg-gray-100 shrink-0 transition-colors', showEmojiPicker ? 'text-violet-600 bg-violet-50' : 'text-gray-400')}
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 animate-scale-in">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Emojis</p>
                    <div className="grid grid-cols-8 gap-1">
                      {emojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleAddEmoji(emoji)}
                          className="w-7 h-7 flex items-center justify-center text-lg hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={cn(
                'p-2.5 rounded-xl text-white shadow-lg shadow-violet-200 shrink-0 transition-all',
                message.trim() 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700' 
                  : 'bg-gray-300 cursor-not-allowed shadow-none'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Right Panel - Client Info */}
      <div className="w-72 border-l border-gray-100 bg-white p-4 overflow-y-auto hidden xl:block" style={{ height: '100%', maxHeight: '100%' }}>
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
            {selected.clientName.charAt(0)}
          </div>
          <h3 className="font-bold text-gray-900 mt-3">{selected.clientName}</h3>
          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mt-2', channelConfig[selected.channel].bg, channelConfig[selected.channel].color)}>
            {channelConfig[selected.channel].label}
          </span>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Responsável</p>
            <p className="text-sm font-medium text-gray-900">{selected.assignedTo}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', selected.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>
              {selected.status === 'open' ? 'Aberta' : 'Fechada'}
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Mensagens</p>
            <p className="text-sm font-medium text-gray-900">{selected.messages.length}</p>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ações</p>
            <div className="space-y-2">
              <button 
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="w-full text-left text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                📋 Criar Tarefa
              </button>
              <button 
                onClick={() => setIsCreateDealModalOpen(true)}
                className="w-full text-left text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                💰 Criar Negociação
              </button>
              <button 
                onClick={() => setCurrentPage('clients')}
                className="w-full text-left text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                👤 Ver Cliente
              </button>
              <button 
                onClick={handleCloseConversation}
                disabled={selected.status === 'closed'}
                className={cn(
                  'w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                  selected.status === 'closed' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                )}
              >
                🔒 {selected.status === 'closed' ? 'Conversa Encerrada' : 'Encerrar Conversa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
