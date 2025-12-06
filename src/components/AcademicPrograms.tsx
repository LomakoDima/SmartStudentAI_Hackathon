import { useState, useEffect, useRef, useCallback } from 'react';
import { GraduationCap, Search, Filter, Clock, DollarSign, Users, ChevronRight, ChevronLeft, BookOpen, Award, MapPin, Star, Loader2, RefreshCw } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../i18n';
import { fetchAcademicPrograms, ProgramData, clearCache } from '../services/universityAPI';

const ITEMS_PER_PAGE = 6;

const categories = [
  { ru: 'Все', en: 'All' },
  { ru: 'IT и технологии', en: 'IT & Technology' },
  { ru: 'Инженерия', en: 'Engineering' },
  { ru: 'Бизнес и экономика', en: 'Business & Economics' },
  { ru: 'Медицина', en: 'Medicine' },
  { ru: 'Гуманитарные науки', en: 'Humanities' },
  { ru: 'Естественные науки', en: 'Natural Sciences' },
  { ru: 'Право', en: 'Law' }
];

const degrees = [
  { ru: 'Все уровни', en: 'All Levels' },
  { ru: 'Бакалавриат', en: 'Bachelor' },
  { ru: 'Магистратура', en: 'Master' },
  { ru: 'Докторантура', en: 'PhD' }
];

function AcademicPrograms() {
  const { t, language } = useLanguage();
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedDegree, setSelectedDegree] = useState('Все уровни');
  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const loadingRef = useRef(false);
  const lastLanguageRef = useRef(language);

  const getText = (ru: string, en: string) => language === 'en' ? en : ru;

  const loadPrograms = useCallback(async (forceRefresh = false) => {
    if (loadingRef.current && !forceRefresh) return;
    if (!forceRefresh && lastLanguageRef.current === language && programs.length > 0) return;
    
    loadingRef.current = true;
    lastLanguageRef.current = language;
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAcademicPrograms(language);
      if (data.length > 0) {
        setPrograms(data);
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
  }, [language, programs.length]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const handleRefresh = () => {
    clearCache();
    loadPrograms(true);
  };

  const filteredPrograms = programs.filter((program) => {
    const name = getText(program.name, program.nameEn).toLowerCase();
    const uni = getText(program.university, program.universityEn).toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || uni.includes(searchQuery.toLowerCase());
    
    const programCategory = getText(program.category, program.categoryEn);
    const selectedCat = language === 'en' 
      ? categories.find(c => c.en === selectedCategory)?.en 
      : categories.find(c => c.ru === selectedCategory)?.ru;
    const matchesCategory = selectedCategory === 'Все' || selectedCategory === 'All' || programCategory === selectedCat || program.category === selectedCategory || program.categoryEn === selectedCategory;
    
    const programDegree = getText(program.degree, program.degreeEn);
    const matchesDegree = selectedDegree === 'Все уровни' || selectedDegree === 'All Levels' || programDegree.includes(selectedDegree) || program.degree === selectedDegree || program.degreeEn === selectedDegree;
    
    return matchesSearch && matchesCategory && matchesDegree;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDegree]);

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl mb-6 shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              {t.academicPrograms.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
              {t.academicPrograms.description}
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
                className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {language === 'ru' ? 'Обновить' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600">
                {language === 'ru' ? 'Загрузка программ из API...' : 'Loading programs from API...'}
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
            selectedProgram ? (
              // Program Detail View
              <div className="space-y-8">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  {t.academicPrograms.backToList}
                </button>

                <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4 inline-block">
                          {getText(selectedProgram.degree, selectedProgram.degreeEn)}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                          {getText(selectedProgram.name, selectedProgram.nameEn)}
                        </h2>
                        <p className="text-white/90 mt-2 flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          {getText(selectedProgram.university, selectedProgram.universityEn)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                        <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-800">{getText(selectedProgram.duration, selectedProgram.durationEn)}</div>
                        <div className="text-sm text-gray-600">{t.academicPrograms.duration}</div>
                      </div>
                      <div className="bg-teal-50 rounded-2xl p-4 text-center">
                        <BookOpen className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-800">{getText(selectedProgram.language, selectedProgram.languageEn)}</div>
                        <div className="text-sm text-gray-600">{t.academicPrograms.language}</div>
                      </div>
                      <div className="bg-green-50 rounded-2xl p-4 text-center">
                        <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-800">{getText(selectedProgram.tuition, selectedProgram.tuitionEn)}</div>
                        <div className="text-sm text-gray-600">{t.academicPrograms.tuition}</div>
                      </div>
                      <div className="bg-cyan-50 rounded-2xl p-4 text-center">
                        <Award className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-800">{getText(selectedProgram.category, selectedProgram.categoryEn)}</div>
                        <div className="text-sm text-gray-600">{t.academicPrograms.category}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t.academicPrograms.aboutProgram}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {getText(selectedProgram.description, selectedProgram.descriptionEn)}
                      </p>
                    </div>

                    {/* Specializations */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t.academicPrograms.specializations}</h3>
                      <div className="flex flex-wrap gap-2">
                        {(language === 'en' ? selectedProgram.specializationsEn : selectedProgram.specializations).map((spec, idx) => (
                          <span key={idx} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Careers */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t.academicPrograms.careers}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(language === 'en' ? selectedProgram.careersEn : selectedProgram.careers).map((career, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-700 font-medium">{career}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Programs List
              <>
                {/* Search and Filters */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-lg mb-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder={t.academicPrograms.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none bg-white min-w-[200px]"
                      >
                        {categories.map((cat) => (
                          <option key={cat.ru} value={language === 'en' ? cat.en : cat.ru}>
                            {getText(cat.ru, cat.en)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Degree Filter */}
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={selectedDegree}
                        onChange={(e) => setSelectedDegree(e.target.value)}
                        className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none bg-white min-w-[180px]"
                      >
                        {degrees.map((deg) => (
                          <option key={deg.ru} value={language === 'en' ? deg.en : deg.ru}>
                            {getText(deg.ru, deg.en)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    {t.academicPrograms.found}: <span className="font-semibold text-emerald-600">{filteredPrograms.length}</span> {t.academicPrograms.programs}
                  </p>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPrograms.map((program) => (
                    <div
                      key={program.id}
                      onClick={() => setSelectedProgram(program)}
                      className="group bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            {getText(program.degree, program.degreeEn)}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 mt-3 group-hover:text-emerald-600 transition-colors">
                            {getText(program.name, program.nameEn)}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {getText(program.university, program.universityEn)}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {getText(program.description, program.descriptionEn)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(language === 'en' ? program.specializationsEn : program.specializations).slice(0, 3).map((spec, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getText(program.duration, program.durationEn)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {getText(program.tuition, program.tuitionEn)}
                          </span>
                        </div>
                        <span className="text-emerald-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          {t.academicPrograms.details}
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPrograms.length === 0 && (
                  <div className="text-center py-16">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500">{t.academicPrograms.notFound}</h3>
                    <p className="text-gray-400 mt-2">{t.academicPrograms.tryOtherFilters}</p>
                  </div>
                )}

                {/* Pagination */}
                {filteredPrograms.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white/60 border border-white/70 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                            : 'bg-white/60 border border-white/70 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white/60 border border-white/70 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Total count */}
                {filteredPrograms.length > 0 && (
                  <div className="text-center mt-4 text-sm text-gray-500">
                    {language === 'ru' 
                      ? `Показано ${Math.min(currentPage * ITEMS_PER_PAGE, filteredPrograms.length)} из ${filteredPrograms.length} программ`
                      : `Showing ${Math.min(currentPage * ITEMS_PER_PAGE, filteredPrograms.length)} of ${filteredPrograms.length} programs`
                    }
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AcademicPrograms;
