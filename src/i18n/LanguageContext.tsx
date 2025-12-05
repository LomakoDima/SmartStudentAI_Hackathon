import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, Language, TranslationKeys } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Получаем сохранённый язык из localStorage
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });
  
  const [isChanging, setIsChanging] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);

  const setLanguage = useCallback((lang: Language) => {
    if (lang === language) return;
    
    // Начинаем анимацию fade-out
    setIsChanging(true);
    setPendingLanguage(lang);
  }, [language]);

  useEffect(() => {
    if (pendingLanguage && isChanging) {
      // Ждём завершения fade-out анимации
      const timer = setTimeout(() => {
        setLanguageState(pendingLanguage);
        localStorage.setItem('language', pendingLanguage);
        setPendingLanguage(null);
        
        // Небольшая задержка перед fade-in
        setTimeout(() => {
          setIsChanging(false);
        }, 50);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [pendingLanguage, isChanging]);

  useEffect(() => {
    // Синхронизируем с localStorage при изменении
    localStorage.setItem('language', language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isChanging,
  };

  return (
    <LanguageContext.Provider value={value}>
      <div className={`language-transition ${isChanging ? 'language-changing' : 'language-ready'}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

