import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, School } from 'lucide-react';

interface AuthProps {
  initialMode?: 'login' | 'register';
}

function Auth({ initialMode = 'login' }: AuthProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  
  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Вход:', { email: formData.email, password: formData.password });
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      console.log('Регистрация:', formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Back button */}
        <a
          href="#home"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Вернуться на главную</span>
        </a>

        {/* Auth Container - Unified */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src="/src/images/datahub.jpg" 
                  alt="DataHub" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 text-white space-y-6 max-w-md">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <School className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">SmartStudentAI</h2>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {isLogin ? 'Добро пожаловать обратно!' : 'Начните свой путь к знаниям'}
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {isLogin 
                    ? 'Войдите в свой аккаунт, чтобы продолжить обучение и отслеживать свой прогресс.'
                    : 'Присоединяйтесь к тысячам студентов, которые уже используют наши сервисы для достижения академических целей.'
                  }
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Доступ к DataHub университетов</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>AI-репетитор и конвертер знаний</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>3D-туры по кампусам</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Card */}
            <div className="w-full lg:w-1/2 p-8 md:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
              <School className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SmartStudentAI
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Добро пожаловать обратно!' : 'Создайте аккаунт'}
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Введите ваше имя"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span>Запомнить меня</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Забыли пароль?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/40 backdrop-blur-md text-gray-500">или</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-white/80 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Продолжить с Google
            </button>
            <button className="w-full py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-white/80 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Продолжить с Facebook
            </button>
          </div>

          {/* Continue without registration button */}
          <div className="mt-6">
            <button
              onClick={() => {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userName', 'Ломако Дмитрий');
                localStorage.setItem('userEmail', 'lomakodima898@gmail.com');
                window.location.hash = '#home';
                window.location.reload();
              }}
              className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200"
            >
              Продолжить без регистрации
            </button>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Нет аккаунта?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Зарегистрируйтесь
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Войдите
                </button>
              </>
            )}
          </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

