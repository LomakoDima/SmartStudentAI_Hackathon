import { Brain, School, Globe2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';

// Hook for animated counter
function useCounter(end: number, duration: number = 2000, startDelay: number = 0, isVisible: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      let startTime: number | null = null;
      const startValue = 0;
      const endValue = end;

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      requestAnimationFrame(animate);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [end, duration, startDelay, isVisible]);

  return count;
}

function Hero() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Trigger stats animation after a delay
    const timer = setTimeout(() => {
      setStatsVisible(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  // Parse stat values
  const stats = [
    { value: 130, suffix: '+', label: t.hero.stats.universities },
    { value: 500, suffix: 'K+', label: t.hero.stats.students },
    { value: 6, suffix: '', label: t.hero.stats.sections },
    { value: 100, suffix: '%', label: t.hero.stats.info }
  ];

  const count130 = useCounter(130, 1500, 100, statsVisible);
  const count500 = useCounter(500, 2000, 200, statsVisible);
  const count6 = useCounter(6, 800, 300, statsVisible);
  const count100 = useCounter(100, 1200, 400, statsVisible);

  const counters = [count130, count500, count6, count100];

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="absolute top-1/4 right-1/3 w-16 h-16 border-2 border-blue-400/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border-2 border-cyan-400/20 rounded-full animate-spin-slow delay-700"></div>

        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
          <div className="grid grid-cols-4 gap-2 opacity-10">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className={`mb-8 flex justify-center gap-3 flex-wrap ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.1s' }}>
          <div className="px-5 py-2 bg-white/40 backdrop-blur-md border border-white/50 rounded-full text-sm text-blue-700 font-medium shadow-lg">
            <Brain className="inline w-4 h-4 mr-2" />
            {t.hero.badge1}
          </div>
          <div className="px-5 py-2 bg-white/40 backdrop-blur-md border border-white/50 rounded-full text-sm text-blue-700 font-medium shadow-lg">
            <School className="inline w-4 h-4 mr-2" />
            {t.hero.badge2}
          </div>
        </div>

        <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.3s' }}>
          <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
            {t.hero.title} {t.hero.titleHighlight}
          </span>
        </h1>

        <p className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.5s' }}>
          {t.hero.description}
        </p>

        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.7s' }}>
          <a href="#datahub" className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              {t.hero.exploreButton}
              <Globe2 className="w-5 h-5" />
            </span>
          </a>

          <a href="#compare" className="px-12 py-5 bg-white/60 backdrop-blur-xl border-2 border-white/80 text-blue-700 text-lg font-semibold rounded-2xl shadow-xl hover:bg-white/80 hover:scale-105 transition-all duration-300">
            {t.hero.compareButton}
          </a>
        </div>

        <div ref={statsRef} className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.9s' }}>
          {stats.map((stat, i) => {
            const displayValue = stat.suffix === 'K+' 
              ? `${counters[i]}${stat.suffix}` 
              : `${counters[i]}${stat.suffix}`;
            
            return (
              <div 
                key={i} 
                className={`p-6 bg-white/50 backdrop-blur-lg rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 scale-in group`} 
                style={{ animationDelay: `${1.1 + i * 0.1}s` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 transition-all duration-300 group-hover:scale-110 inline-block">
                  {displayValue}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Hero;
