import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Loader2, CheckCircle, Chrome, Shield, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

interface LoginProps {
  onLogin: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function Login({ onLogin, onRegister, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Por favor, preencha todos os campos.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onLogin();
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#07050f' }}>
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Base background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #110d2e 0%, #0a0718 45%, #06040f 100%)' }} />

        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            background: `
              radial-gradient(ellipse 70% 50% at 25% 35%, rgba(124,58,237,0.12) 0%, transparent 55%),
              radial-gradient(ellipse 50% 40% at 75% 20%, rgba(99,102,241,0.08) 0%, transparent 50%),
              radial-gradient(ellipse 45% 35% at 35% 80%, rgba(168,85,247,0.06) 0%, transparent 55%)
            `
          }} />
        </div>

        {/* Animated floating orbs */}
        <div className="absolute top-[15%] left-[20%] w-[450px] h-[450px] rounded-full animate-orb opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[20%] right-[25%] w-[350px] h-[350px] rounded-full animate-float-slow opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 55%)', filter: 'blur(70px)' }} />
        <div className="absolute top-[60%] left-[40%] w-[200px] h-[200px] rounded-full animate-float opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 55%)', filter: 'blur(50px)', animationDelay: '3s' }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }} />

        {/* ── Top: Logo ── */}
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }} />
              <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #4f46e5)' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)' }} />
                <Zap className="w-6 h-6 text-white relative z-10" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">Nexus<span className="text-violet-400">CRM</span></span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-violet-300 rounded border border-violet-500/20"
                  style={{ background: 'rgba(139,92,246,0.1)' }}>PRO</span>
                <span className="text-[10px] text-white/25 font-medium">Enterprise Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Center: Hero ── */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold mb-8 animate-fade-in-up"
            style={{ background: 'rgba(139,92,246,0.08)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.15)', animationDelay: '0.1s' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
            Plataforma SaaS Multiempresa
          </div>

          <h1 className="text-5xl xl:text-[3.5rem] font-bold leading-[1.08] mb-6 animate-fade-in-up"
            style={{ color: 'white', letterSpacing: '-0.03em', animationDelay: '0.15s' }}>
            Gerencie seus
            <br />
            <span className="gradient-text-shimmer" style={{
              background: 'linear-gradient(90deg, #c4b5fd 0%, #a78bfa 25%, #818cf8 50%, #a78bfa 75%, #c4b5fd 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'text-shimmer 4s linear infinite',
            }}>
              relacionamentos
            </span>
          </h1>

          <p className="text-[15px] leading-relaxed max-w-md animate-fade-in-up"
            style={{ color: 'rgba(255,255,255,0.4)', animationDelay: '0.25s' }}>
            Pipeline inteligente, comunicação omnichannel e automações que transformam leads em clientes fiéis.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            {[
              { icon: '💬', label: 'Omnichannel' },
              { icon: '📊', label: 'Pipeline Visual' },
              { icon: '🤖', label: 'IA Integrada' },
              { icon: '🎨', label: 'White Label' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:border-violet-500/30"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-base">{f.icon}</span>
                <span className="text-[13px] font-medium text-white/60">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12 pt-8 animate-fade-in-up"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', animationDelay: '0.45s' }}>
            {[
              { value: '2.5k+', label: 'Empresas ativas' },
              { value: '98%', label: 'Satisfação' },
              { value: '24/7', label: 'Suporte' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-white mb-0.5 tracking-tight">{s.value}</p>
                <p className="text-[11px] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom: Trust ── */}
        <div className="relative z-10 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex -space-x-2">
              {['#10b981', '#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)`, borderColor: '#110d2e', zIndex: 5 - i }}>
                  {['CS', 'AM', 'BR', 'PD', 'JK'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-white/50">+2.500 usuários</p>
              <p className="text-[10px] text-white/25">confiam no NexusCRM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/20">
            <Shield className="w-4 h-4" />
            <span className="text-[11px]">Criptografia SSL 256-bit</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-[45%] xl:w-[42%] flex items-center justify-center p-6 sm:p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0d0a20 0%, #110d2e 50%, #0d0a20 100%)' }}>
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 55%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 55%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Nexus<span className="text-violet-400">CRM</span></span>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl p-8 sm:p-10 animate-fade-in-scale"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5)' }}>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.15)' }}>
                <Sparkles className="w-3 h-3" />
                Acesso rápido e seguro
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Bem-vindo de volta</h2>
              <p className="text-sm text-white/35">Entre na sua conta para continuar</p>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="group flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03] hover:border-white/15 active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                <Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: '#ea4335' }} />
                Google
              </button>
              <button className="group flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03] hover:border-white/15 active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                <svg viewBox="0 0 23 23" className="w-4 h-4 group-hover:scale-110 transition-transform">
                  <path fill="#F35325" d="M1 1h10v10H1z"/>
                  <path fill="#81BC06" d="M12 1h10v10H12z"/>
                  <path fill="#05A6F0" d="M1 12h10v10H1z"/>
                  <path fill="#FFBA08" d="M12 12h10v10H12z"/>
                </svg>
                Microsoft
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
              <span className="text-[10px] uppercase tracking-widest text-white/20 font-medium">ou</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-4 rounded-xl flex items-center gap-3 text-sm animate-scale-in"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold mb-2 text-white/40 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 transition-colors group-focus-within:text-violet-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-all duration-300 placeholder:text-white/15"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.06)', color: 'white' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.08)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold mb-2 text-white/40 uppercase tracking-wider">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 transition-colors group-focus-within:text-violet-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-12 pr-14 py-3.5 rounded-xl text-sm focus:outline-none transition-all duration-300 placeholder:text-white/15"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.06)', color: 'white' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.08)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all duration-200 hover:bg-white/8" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div onClick={() => setRememberMe(!rememberMe)}
                    className={cn('w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 cursor-pointer',
                      rememberMe ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20' : 'bg-white/4 border-2 border-white/15 group-hover:border-violet-400/40')}>
                    {rememberMe && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Lembrar-me</span>
                </label>
                <button type="button" onClick={onForgotPassword}
                  className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                  Esqueceu a senha?
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className={cn('w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 mt-2 relative overflow-hidden',
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]')}
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)', color: 'white', boxShadow: '0 4px 24px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</>
                ) : (
                  <><span className="relative z-10">Entrar na conta</span> <ArrowRight className="w-4 h-4 relative z-10" /></>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm mt-8 text-white/30">
              Novo por aqui?{' '}
              <button onClick={onRegister} className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                Criar conta grátis
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-[11px] text-white/20">
              Ao entrar, você concorda com nossos{' '}
              <a href="#" className="text-violet-400/50 hover:text-violet-400 transition-colors">Termos</a>
              {' '}e{' '}
              <a href="#" className="text-violet-400/50 hover:text-violet-400 transition-colors">Privacidade</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
