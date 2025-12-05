import { Brain, GraduationCap, Repeat, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';

function Services() {
  const { t } = useLanguage();
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
  const services = [
    {
      icon: Brain,
      title: t.services.items.aiTutor.title,
      description: t.services.items.aiTutor.description,
      features: t.services.items.aiTutor.features,
      color: 'from-blue-500 to-cyan-500',
      link: '#ai-tutor'
    },
    {
      icon: GraduationCap,
      title: t.services.items.admission.title,
      description: t.services.items.admission.description,
      features: t.services.items.admission.features,
      color: 'from-cyan-500 to-blue-600',
      link: '#admission'
    },
    {
      icon: Repeat,
      title: t.services.items.converter.title,
      description: t.services.items.converter.description,
      features: t.services.items.converter.features,
      color: 'from-blue-600 to-blue-700',
      link: '#converter'
    },
    {
      icon: User,
      title: t.services.items.profile.title,
      description: t.services.items.profile.description,
      features: t.services.items.profile.features,
      color: 'from-blue-700 to-cyan-600',
      link: '#profile'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="section-header text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t.services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const link = service.link;
            const CardWrapper = 'a';
            const isVisible = visibleElements.has(index);
            const isEven = index % 2 === 0;
            
            return (
              <CardWrapper
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                href={link}
                className={`group relative p-10 bg-white/50 backdrop-blur-2xl border border-white/70 rounded-3xl shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer ${isVisible ? (isEven ? 'slide-in-left' : 'slide-in-right') : 'opacity-0'}`}
                style={{ animationDelay: `${0.3 + index * 0.15}s` }}
              >
              <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${service.color} rounded-l-3xl`}></div>

              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <service.icon className="w-10 h-10 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">{service.description}</p>

                  <div className="flex flex-wrap gap-3">
                    {service.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl ${service.color} opacity-5 rounded-tl-full`}></div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
