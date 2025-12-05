import { Building2, BookOpen, FileCheck, Camera, Globe, GitCompare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function DataHub() {
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement | HTMLAnchorElement);
            if (index !== -1) {
              setVisibleElements((prev) => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Observe section header
    if (sectionRef.current) {
      const headerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in-up');
            }
          });
        },
        { threshold: 0.1 }
      );
      const header = sectionRef.current.querySelector('.section-header');
      if (header) headerObserver.observe(header);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  const cards = [
    {
      icon: Building2,
      title: 'Об университете',
      description: 'Миссия, история, достижения, руководство и другие базовые сведения образовательного учреждения',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Академические программы',
      description: 'Каталог всех образовательных программ с подробным описанием направлений, курсов и условий обучения',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: FileCheck,
      title: 'Приём и поступление',
      description: 'Требования к абитуриентам, сроки подачи документов, процесс поступления, гранты, стипендии и финансовая поддержка',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      icon: Camera,
      title: '3D-тур',
      description: 'Интерактивная возможность изучить университетский кампус в формате виртуальной экскурсии',
      gradient: 'from-blue-700 to-cyan-600'
    },
    {
      icon: Globe,
      title: 'Международное сотрудничество',
      description: 'Сведения о программах обмена, партнёрских университетах и возможностях для иностранных студентов',
      gradient: 'from-cyan-600 to-blue-500'
    },
    {
      icon: GitCompare,
      title: 'Функция сравнения',
      description: 'Инструмент для сравнения университетов или отдельных образовательных программ между собой по важным параметрам',
      gradient: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="section-header text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent fade-in-up" style={{ animationDelay: '0.1s' }}>
            DataHub ВУЗ-ов РК
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
            Единый цифровой каталог университетов Казахстана. Вся ключевая информация о вузах в удобном формате для поиска, изучения и сравнения
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const isCompare = card.title === 'Функция сравнения';
            const isTour = card.title === '3D-тур';
            const CardWrapper = (isCompare || isTour) ? 'a' : 'div';
            const wrapperProps = isCompare ? { href: '#compare' } : isTour ? { href: '#tour' } : {};
            const isVisible = visibleElements.has(index);
            
            return (
              <CardWrapper
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                {...wrapperProps}
                className={`group relative p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden ${(isCompare || isTour) ? 'cursor-pointer' : ''} ${isVisible ? 'fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.description}</p>
                  {(isCompare || isTour) && (
                    <div className="mt-4 text-blue-600 font-medium flex items-center gap-2">
                      {isCompare ? 'Перейти к сравнению' : 'Открыть 3D-туры'}
                      <card.icon className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-tl-full"></div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DataHub;
