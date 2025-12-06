import { useState, useEffect, useRef, useCallback } from 'react';
import { Building2, Award, Users, Calendar, MapPin, Globe, ChevronRight, ChevronLeft, Star, BookOpen, Trophy, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../i18n';
import { fetchUniversities, UniversityData, clearCache } from '../services/universityAPI';

const ITEMS_PER_PAGE = 6;

function AboutUniversity() {
  const { t, language } = useLanguage();
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const loadingRef = useRef(false);
  const lastLanguageRef = useRef(language);

  const getText = (ru: string, en: string) => language === 'en' ? en : ru;

  const loadUniversities = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate requests
    if (loadingRef.current && !forceRefresh) return;
    if (!forceRefresh && lastLanguageRef.current === language && universities.length > 0) return;
    
    loadingRef.current = true;
    lastLanguageRef.current = language;
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchUniversities(language);
      if (data.length > 0) {
        setUniversities(data);
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
      loadingRef.current = false;
    }
  }, [language, universities.length]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  const handleRefresh = () => {
    clearCache();
    loadUniversities(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl mb-6 shadow-xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              {t.aboutUniversity.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
              {t.aboutUniversity.description}
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
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {language === 'ru' ? 'Обновить' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">
                {language === 'ru' ? 'Загрузка данных из API...' : 'Loading data from API...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
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

          {/* Content */}
          {!isLoading && !error && (
            selectedUniversity ? (
              // University Detail View
              <div className="space-y-8">
                <button
                  onClick={() => setSelectedUniversity(null)}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  {t.aboutUniversity.backToList}
                </button>

                {/* University Header */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    <img
                      src={selectedUniversity.image}
                      alt={getText(selectedUniversity.name, selectedUniversity.nameEn)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {getText(selectedUniversity.name, selectedUniversity.nameEn)}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {getText(selectedUniversity.city, selectedUniversity.cityEn)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {t.aboutUniversity.founded} {selectedUniversity.founded}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {selectedUniversity.rating}/10
                        </span>
                        {selectedUniversity.website && (
                          <a 
                            href={selectedUniversity.website.startsWith('http') ? selectedUniversity.website : `https://${selectedUniversity.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {language === 'ru' ? 'Сайт' : 'Website'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-50 rounded-2xl p-4 text-center">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedUniversity.students}</div>
                        <div className="text-sm text-gray-600">{t.aboutUniversity.students}</div>
                      </div>
                      <div className="bg-cyan-50 rounded-2xl p-4 text-center">
                        <Calendar className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedUniversity.founded}</div>
                        <div className="text-sm text-gray-600">{t.aboutUniversity.yearFounded}</div>
                      </div>
                      <div className="bg-green-50 rounded-2xl p-4 text-center">
                        <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{getText(selectedUniversity.type, selectedUniversity.typeEn)}</div>
                        <div className="text-sm text-gray-600">{t.aboutUniversity.type}</div>
                      </div>
                      <div className="bg-purple-50 rounded-2xl p-4 text-center">
                        <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedUniversity.rating}</div>
                        <div className="text-sm text-gray-600">{t.aboutUniversity.rating}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        {t.aboutUniversity.about}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {getText(selectedUniversity.description, selectedUniversity.descriptionEn)}
                      </p>
                    </div>

                    {/* Mission */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        {t.aboutUniversity.mission}
                      </h3>
                      <p className="text-gray-600 leading-relaxed italic">
                        "{getText(selectedUniversity.mission, selectedUniversity.missionEn)}"
                      </p>
                    </div>

                    {/* Rector */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        {t.aboutUniversity.rector}
                      </h3>
                      <p className="text-gray-600">
                        {getText(selectedUniversity.rector, selectedUniversity.rectorEn)}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-blue-600" />
                        {t.aboutUniversity.achievements}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(language === 'en' ? selectedUniversity.achievementsEn : selectedUniversity.achievements).map((achievement, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">{idx + 1}</span>
                              </div>
                              <p className="text-gray-700">{achievement}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Universities List with Pagination
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universities
                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                    .map((uni) => (
                    <div
                      key={uni.id}
                      onClick={() => setSelectedUniversity(uni)}
                      className="group bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={uni.image}
                          alt={getText(uni.name, uni.nameEn)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {uni.rating}
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                            {getText(uni.type, uni.typeEn)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {getText(uni.name, uni.nameEn)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {getText(uni.city, uni.cityEn)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {uni.founded}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {getText(uni.description, uni.descriptionEn)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            <Users className="w-4 h-4 inline mr-1" />
                            {uni.students} {t.aboutUniversity.students.toLowerCase()}
                          </span>
                          <span className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t.aboutUniversity.learnMore}
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {universities.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white/60 border border-white/70 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: Math.ceil(universities.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                            : 'bg-white/60 border border-white/70 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(universities.length / ITEMS_PER_PAGE), p + 1))}
                      disabled={currentPage === Math.ceil(universities.length / ITEMS_PER_PAGE)}
                      className="p-2 rounded-xl bg-white/60 border border-white/70 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Total count */}
                <div className="text-center mt-4 text-sm text-gray-500">
                  {language === 'ru' 
                    ? `Показано ${Math.min(currentPage * ITEMS_PER_PAGE, universities.length)} из ${universities.length} университетов`
                    : `Showing ${Math.min(currentPage * ITEMS_PER_PAGE, universities.length)} of ${universities.length} universities`
                  }
                </div>
              </>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUniversity;
