import { useState, useEffect } from 'react';
import { Globe, Plane, Users, Building, Award, ChevronRight, MapPin, Calendar, ArrowRightLeft, GraduationCap, Handshake, Star, Loader2, RefreshCw } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../i18n';
import { fetchExchangePrograms, ExchangeProgramData, clearCache } from '../services/universityAPI';

interface Partner {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  countryEn: string;
  type: string;
  typeEn: string;
  programs: number;
  students: number;
  flag: string;
}

// Partner universities data (could also be fetched from API)
const partners: Partner[] = [
  { id: '1', name: 'MIT', nameEn: 'MIT', country: 'США', countryEn: 'USA', type: 'Исследовательский', typeEn: 'Research', programs: 5, students: 120, flag: '🇺🇸' },
  { id: '2', name: 'Кембридж', nameEn: 'Cambridge', country: 'Великобритания', countryEn: 'UK', type: 'Академический', typeEn: 'Academic', programs: 8, students: 200, flag: '🇬🇧' },
  { id: '3', name: 'ETH Zurich', nameEn: 'ETH Zurich', country: 'Швейцария', countryEn: 'Switzerland', type: 'Технический', typeEn: 'Technical', programs: 4, students: 80, flag: '🇨🇭' },
  { id: '4', name: 'Токийский университет', nameEn: 'University of Tokyo', country: 'Япония', countryEn: 'Japan', type: 'Исследовательский', typeEn: 'Research', programs: 6, students: 150, flag: '🇯🇵' },
  { id: '5', name: 'Сорбонна', nameEn: 'Sorbonne', country: 'Франция', countryEn: 'France', type: 'Гуманитарный', typeEn: 'Humanities', programs: 7, students: 180, flag: '🇫🇷' },
  { id: '6', name: 'TU Munich', nameEn: 'TU Munich', country: 'Германия', countryEn: 'Germany', type: 'Технический', typeEn: 'Technical', programs: 9, students: 250, flag: '🇩🇪' }
];

function International() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'exchange' | 'partners'>('exchange');
  const [exchangePrograms, setExchangePrograms] = useState<ExchangeProgramData[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ExchangeProgramData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getText = (ru: string, en: string) => language === 'en' ? en : ru;

  useEffect(() => {
    loadExchangePrograms();
  }, [language]);

  const loadExchangePrograms = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchExchangePrograms(language);
      if (data.length > 0) {
        setExchangePrograms(data);
      } else {
        setError(language === 'ru' 
          ? 'Не удалось загрузить данные. Проверьте подключение к интернету и API ключ.'
          : 'Failed to load data. Check your internet connection and API key.');
      }
    } catch (e) {
      setError(language === 'ru' 
        ? 'Произошла ошибка при загрузке данных'
        : 'An error occurred while loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    clearCache();
    loadExchangePrograms();
  };

  const tabs = [
    { id: 'exchange' as const, label: t.international.tabs.exchange, icon: ArrowRightLeft },
    { id: 'partners' as const, label: t.international.tabs.partners, icon: Handshake }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl mb-6 shadow-xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
              {t.international.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
              {t.international.description}
            </p>
            
            {/* API Status & Refresh */}
            <div className="flex items-center justify-center gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {language === 'ru' ? 'Данные из API' : 'Data from API'}
              </span>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {language === 'ru' ? 'Обновить' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 text-center shadow-lg">
              <Building className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-800">150+</div>
              <div className="text-sm text-gray-600">{t.international.stats.partners}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 text-center shadow-lg">
              <Plane className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-800">50+</div>
              <div className="text-sm text-gray-600">{t.international.stats.countries}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 text-center shadow-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-800">2000+</div>
              <div className="text-sm text-gray-600">{t.international.stats.students}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 text-center shadow-lg">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-800">30+</div>
              <div className="text-sm text-gray-600">{t.international.stats.programs}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedProgram(null); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white/60 text-gray-600 hover:bg-white/80'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && activeTab === 'exchange' && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">
                {language === 'ru' ? 'Загрузка программ из API...' : 'Loading programs from API...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && activeTab === 'exchange' && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  {language === 'ru' ? 'Попробовать снова' : 'Try again'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'exchange' && !isLoading && !error && (
            selectedProgram ? (
              // Program Detail View
              <div className="space-y-8">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  {t.international.backToList}
                </button>

                <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">{selectedProgram.flag}</span>
                          <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium">
                            {getText(selectedProgram.type, selectedProgram.typeEn)}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                          {getText(selectedProgram.name, selectedProgram.nameEn)}
                        </h2>
                        <p className="text-white/90 mt-2 flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          {getText(selectedProgram.country, selectedProgram.countryEn)} • {getText(selectedProgram.partnerUniversity, selectedProgram.partnerUniversityEn)}
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                        {getText(selectedProgram.funding, selectedProgram.fundingEn)} {t.international.funding}
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-purple-50 rounded-2xl p-4 text-center">
                        <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-800">{getText(selectedProgram.duration, selectedProgram.durationEn)}</div>
                        <div className="text-sm text-gray-600">{t.international.duration}</div>
                      </div>
                      <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                        <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-800">{getText(selectedProgram.country, selectedProgram.countryEn)}</div>
                        <div className="text-sm text-gray-600">{t.international.partner}</div>
                      </div>
                      <div className="bg-violet-50 rounded-2xl p-4 text-center">
                        <Building className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-800 text-sm">{getText(selectedProgram.partnerUniversity, selectedProgram.partnerUniversityEn)}</div>
                        <div className="text-sm text-gray-600">{t.international.partner}</div>
                      </div>
                      <div className="bg-fuchsia-50 rounded-2xl p-4 text-center">
                        <Calendar className="w-8 h-8 text-fuchsia-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-800">{getText(selectedProgram.deadline, selectedProgram.deadlineEn)}</div>
                        <div className="text-sm text-gray-600">{t.international.deadline}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t.international.aboutProgram}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {getText(selectedProgram.description, selectedProgram.descriptionEn)}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t.international.benefits}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(language === 'en' ? selectedProgram.benefitsEn : selectedProgram.benefits).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Star className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t.international.requirements}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(language === 'en' ? selectedProgram.requirementsEn : selectedProgram.requirements).map((req, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {idx + 1}
                            </div>
                            <span className="text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Exchange Programs List
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exchangePrograms.map((program) => (
                  <div
                    key={program.id}
                    onClick={() => setSelectedProgram(program)}
                    className="group bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{program.flag}</span>
                        <div>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {getText(program.type, program.typeEn)}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {getText(program.country, program.countryEn)}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {getText(program.funding, program.fundingEn)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {getText(program.name, program.nameEn)}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {getText(program.description, program.descriptionEn)}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {getText(program.duration, program.durationEn)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {t.international.deadline}: {getText(program.deadline, program.deadlineEn)}
                      </span>
                      <span className="text-purple-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t.international.details}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'partners' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="group bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{partner.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {getText(partner.name, partner.nameEn)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getText(partner.country, partner.countryEn)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {getText(partner.type, partner.typeEn)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      <span>{partner.programs} {t.international.programsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>{partner.students} {t.international.studentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default International;
