import { useState } from 'react';
import {
  Mail,
  Zap,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('code');
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Por favor, insira o código completo.');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('success');
  };

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setCode(newCode);
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      const nextInput = document.getElementById(`code-${lastFilledIndex}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
            NexusCRM
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {step !== 'success' && (
            <button
              onClick={step === 'email' ? onBackToLogin : () => setStep(step === 'reset' ? 'code' : 'email')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          )}

          {/* Step: Email */}
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Esqueceu a senha?</h2>
                <p className="text-gray-500 mt-2">
                  Não se preocupe! Digite seu email e enviaremos um código de recuperação.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSendCode} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all',
                    loading
                      ? 'bg-violet-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30'
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar código
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step: Code Verification */}
          {step === 'code' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Verificação</h2>
                <p className="text-gray-500 mt-2">
                  Digite o código de 6 dígitos enviado para
                </p>
                <p className="text-violet-600 font-medium">{email}</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Código de verificação
                  </label>
                  <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeInput(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all',
                    loading
                      ? 'bg-violet-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30'
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Verificar código
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Não recebeu o código?{' '}
                  <button
                    type="button"
                    className="text-violet-600 hover:text-violet-700 font-semibold"
                  >
                    Reenviar
                  </button>
                </p>
              </form>
            </>
          )}

          {/* Step: Reset Password */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nova senha</h2>
                <p className="text-gray-500 mt-2">
                  Crie uma nova senha para sua conta
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirme a nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all',
                    loading
                      ? 'bg-violet-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30'
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Salvar nova senha
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Senha alterada!</h2>
              <p className="text-gray-500 mb-8">
                Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
              </p>

              <button
                onClick={onBackToLogin}
                className="w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 transition-all"
              >
                Ir para o login
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Lembrou a senha?{' '}
          <button onClick={onBackToLogin} className="text-violet-400 hover:text-violet-300">
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
}
