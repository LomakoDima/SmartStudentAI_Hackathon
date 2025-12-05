import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useLanguage } from '../i18n';

function Footer() {
  const { t, language } = useLanguage();
  
  const sections = language === 'ru' ? [
    {
      title: 'О платформе',
      links: ['О нас', 'Миссия', 'Команда', 'Карьера', 'Новости']
    },
    {
      title: t.footer.contacts,
      links: ['support@smartstudent.ai', '+7 (727) 123-45-67', t.footer.addressValue, 'Обратная связь']
    },
    {
      title: 'Партнёры',
      links: ['Вузы-партнёры', 'Корпоративные клиенты', 'Стать партнёром', 'Интеграции']
    },
    {
      title: 'Университеты',
      links: ['Каталог вузов', 'Рейтинги', 'Программы обучения', 'Стипендии']
    },
    {
      title: 'Документы',
      links: ['Пользовательское соглашение', 'Политика конфиденциальности', 'Правила использования', 'FAQ']
    }
  ] : [
    {
      title: 'About Platform',
      links: ['About Us', 'Mission', 'Team', 'Careers', 'News']
    },
    {
      title: t.footer.contacts,
      links: ['support@smartstudent.ai', '+7 (727) 123-45-67', t.footer.addressValue, 'Feedback']
    },
    {
      title: 'Partners',
      links: ['Partner Universities', 'Corporate Clients', 'Become a Partner', 'Integrations']
    },
    {
      title: 'Universities',
      links: ['University Catalog', 'Rankings', 'Study Programs', 'Scholarships']
    },
    {
      title: 'Legal',
      links: ['Terms of Service', 'Privacy Policy', 'Usage Rules', 'FAQ']
    }
  ];

  return (
    <footer className="relative py-20 px-6 bg-gradient-to-b from-transparent to-gray-900 text-white mt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-cyan-900/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-6 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-start gap-2"
                    >
                      {section.title === 'Контакты' && i < 3 && (
                        <>
                          {i === 0 && <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                          {i === 1 && <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                          {i === 2 && <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        </>
                      )}
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                SmartStudentAI
              </div>
              <p className="text-gray-400 text-sm">© 2025 SmartStudentAI. {t.footer.rights}</p>
            </div>

            <div className="flex gap-4">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Facebook, label: 'Facebook' }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>{language === 'ru' ? 'Образовательная платформа' : 'Educational Platform'}</span>
            <span>•</span>
            <span>{language === 'ru' ? 'Казахстан, 2025' : 'Kazakhstan, 2025'}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>
    </footer>
  );
}

export default Footer;
