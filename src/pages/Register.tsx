import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Loader2,
  CheckCircle,
  User,
  Building2,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company.trim()) newErrors.company = 'Nome da empresa é obrigatório';
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);
    
    // Simula chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    onRegister();
  };

  const passwordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength();
  const strengthLabels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-600'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
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
          {/* Back Button */}
          <button
            onClick={step === 1 ? onBackToLogin : () => setStep(1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Voltar ao login' : 'Voltar'}
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Crie sua conta' : 'Configure sua empresa'}
            </h2>
            <p className="text-gray-500 mt-2">
              {step === 1 
                ? 'Comece seu teste grátis de 14 dias'
                : 'Últimos passos para começar'
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                step >= 1 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'
              )}>
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className={cn('text-sm font-medium', step >= 1 ? 'text-gray-900' : 'text-gray-400')}>
                Dados pessoais
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200">
              <div className={cn('h-full bg-violet-600 transition-all', step >= 2 ? 'w-full' : 'w-0')} />
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                step >= 2 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'
              )}>
                2
              </div>
              <span className={cn('text-sm font-medium', step >= 2 ? 'text-gray-900' : 'text-gray-400')}>
                Empresa
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className={cn(
                        'w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all',
                        errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                      )}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email profissional
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="seu@empresa.com"
                      className={cn(
                        'w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all',
                        errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      className={cn(
                        'w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all',
                        errors.phone ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                      )}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 transition-all"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nome da empresa
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      placeholder="Sua Empresa Ltda"
                      className={cn(
                        'w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all',
                        errors.company ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                      )}
                    />
                  </div>
                  {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Crie uma senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className={cn(
                        'w-full pl-11 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all',
                        errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-1 flex-1 rounded-full transition-colors',
                              i < strength ? strengthColors[strength] : 'bg-gray-200'
                            )}
                          />
                        ))}
                      </div>
                      <p className={cn('text-xs', strength >= 3 ? 'text-emerald-600' : 'text-gray-500')}>
                        Força: {strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirme a senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Repita a senha"
                      className={cn(
                        'w-full pl-11 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all',
                        errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      onClick={() => {
                        setAcceptTerms(!acceptTerms);
                        if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                      }}
                      className={cn(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5',
                        acceptTerms
                          ? 'bg-violet-600 border-violet-600'
                          : errors.terms
                            ? 'border-red-400'
                            : 'border-gray-300 hover:border-violet-400'
                      )}
                    >
                      {acceptTerms && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-600">
                      Li e concordo com os{' '}
                      <a href="#" className="text-violet-600 hover:underline">Termos de Uso</a>
                      {' '}e{' '}
                      <a href="#" className="text-violet-600 hover:underline">Política de Privacidade</a>
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all',
                    loading
                      ? 'bg-violet-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40'
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar minha conta grátis
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem uma conta?{' '}
            <button
              onClick={onBackToLogin}
              className="text-violet-600 hover:text-violet-700 font-semibold"
            >
              Fazer login
            </button>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { label: '14 dias grátis', icon: '🎁' },
            { label: 'Sem cartão', icon: '💳' },
            { label: 'Cancele quando quiser', icon: '✨' },
          ].map((item) => (
            <div key={item.label} className="text-slate-400 text-xs">
              <span className="text-lg block mb-1">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
