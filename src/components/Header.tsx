import { Menu, X, Home, Database, GitCompare, Camera, Brain, Wand2, GraduationCap, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      const name = localStorage.getItem('userName') || '';
      setIsAuthenticated(auth);
      setUserName(name);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    // Проверяем при изменении hash (на случай перехода между страницами)
    const handleHashChange = () => {
      checkAuth();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (page: string) => {
    if (page === 'home') return currentPage === 'home' || currentPage === '';
    if (page === 'services') {
      return ['ai-tutor', 'converter', 'admission', 'tutor', 'knowledge-converter', 'admission-helper'].includes(currentPage);
    }
    return currentPage === page || currentPage.startsWith(page);
  };

  const navItems = [
    { href: '#home', label: 'Главная', icon: Home },
    { href: '#datahub', label: 'DataHub', icon: Database },
    { href: '#compare', label: 'Сравнение', icon: GitCompare },
    { href: '#tour', label: '3D-тур', icon: Camera }
  ];

  const serviceItems = [
    { href: '#ai-tutor', label: 'AI-репетитор', icon: Brain },
    { href: '#converter', label: 'Конвертер знаний', icon: Wand2 },
    { href: '#admission', label: 'Помощник для поступления', icon: GraduationCap }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-lg' 
        : 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center group">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              SmartStudentAI
            </h1>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href.slice(1));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 group ${
                    active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                  )}
                </a>
              );
            })}
            
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button 
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  isServicesOpen || isActive('services')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>Сервисы</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                {(isServicesOpen || isActive('services')) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                )}
              </button>
              
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 z-50 ${
                isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="p-2">
                  {serviceItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                        isActive(item.href.slice(1))
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.href.slice(1)) && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="ml-2 flex items-center gap-3">
              {isAuthenticated ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group flex items-center gap-2"
                  >
                    <User className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{userName || 'Профиль'}</span>
                    <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <div className={`absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 z-50 ${
                    isProfileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-200/50">
                        <p className="font-semibold text-gray-800">{userName}</p>
                        <p className="text-sm text-gray-600 truncate">{localStorage.getItem('userEmail') || ''}</p>
                      </div>
                      <a
                        href="#profile"
                        className="block px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Профиль</span>
                      </a>
                      <a
                        href="#profile"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = '#profile';
                          const event = new Event('hashchange');
                          window.dispatchEvent(event);
                          setTimeout(() => {
                            const settingsTab = document.querySelector('[data-tab="settings"]') as HTMLElement;
                            if (settingsTab) settingsTab.click();
                          }, 100);
                          setIsProfileOpen(false);
                        }}
                        className="block px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Настройки</span>
                      </a>
                      <div className="border-t border-gray-200/50 my-1"></div>
                      <button
                        onClick={() => {
                          localStorage.removeItem('isAuthenticated');
                          localStorage.removeItem('userName');
                          localStorage.removeItem('userEmail');
                          setIsAuthenticated(false);
                          setUserName('');
                          setIsProfileOpen(false);
                          window.location.hash = '#home';
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Выйти</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <a
                    href="#register"
                    className="px-5 py-2.5 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 inline-block"
                  >
                    Регистрация
                  </a>
                  <a
                    href="#auth"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 inline-block relative overflow-hidden group"
                  >
                    <span className="relative z-10">Войти</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-200/50">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href.slice(1));
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </a>
                );
              })}
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Сервисы</div>
                <div className="space-y-1">
                  {serviceItems.map((item) => {
                    const active = isActive(item.href.slice(1));
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                          active
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {active && (
                          <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
              
              {isAuthenticated ? (
                <div className="mx-4 mt-4 space-y-2">
                  <a
                    href="#profile"
                    className="block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 text-center flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Профиль
                  </a>
                  <a
                    href="#profile"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '#profile';
                      const event = new Event('hashchange');
                      window.dispatchEvent(event);
                      setTimeout(() => {
                        const settingsTab = document.querySelector('[data-tab="settings"]') as HTMLElement;
                        if (settingsTab) settingsTab.click();
                      }, 100);
                      setIsMenuOpen(false);
                    }}
                    className="block px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Настройки
                  </a>
                  <button
                    onClick={() => {
                      localStorage.removeItem('isAuthenticated');
                      localStorage.removeItem('userName');
                      localStorage.removeItem('userEmail');
                      setIsAuthenticated(false);
                      setUserName('');
                      setIsMenuOpen(false);
                      window.location.hash = '#home';
                    }}
                    className="w-full px-6 py-3 bg-white border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="mx-4 mt-4 flex flex-col gap-2">
                  <a
                    href="#register"
                    className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Регистрация
                  </a>
                  <a
                    href="#auth"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Войти
                  </a>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

