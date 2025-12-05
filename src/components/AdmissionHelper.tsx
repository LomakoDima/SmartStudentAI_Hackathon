import { ArrowLeft, GraduationCap, CheckCircle, FileCheck, Target, TrendingUp, Award, Calculator, BookOpen } from 'lucide-react';
import { useState } from 'react';

function AdmissionHelper() {
  const [step, setStep] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [scores, setScores] = useState({ ent: 0, gpa: 0 });

  const universities = [
    'Назарбаев Университет',
    'КазНУ им. аль-Фараби',
    'КБТУ',
    'КазНТУ им. Сатпаева',
    'ЕНУ им. Л.Н. Гумилёва'
  ];

  const steps = [
    {
      number: 1,
      title: 'Выбор университета',
      icon: GraduationCap,
      description: 'Выберите интересующий вас университет'
    },
    {
      number: 2,
      title: 'Ввод баллов',
      icon: Calculator,
      description: 'Укажите ваши баллы ЕНТ и средний балл'
    },
    {
      number: 3,
      title: 'Расчёт шансов',
      icon: TrendingUp,
      description: 'Получите оценку ваших шансов на поступление'
    },
    {
      number: 4,
      title: 'Рекомендации',
      icon: Target,
      description: 'Получите персональные рекомендации'
    }
  ];

  const calculateChance = () => {
    // Простая симуляция расчёта
    const totalScore = scores.ent * 0.7 + scores.gpa * 30;
    if (totalScore >= 120) return { percentage: 95, status: 'excellent' };
    if (totalScore >= 100) return { percentage: 75, status: 'good' };
    if (totalScore >= 80) return { percentage: 50, status: 'medium' };
    return { percentage: 25, status: 'low' };
  };

  const chance = step >= 3 ? calculateChance() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Вернуться на главную</span>
          </a>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl mb-6 shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Помощник для поступления
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Сопровождение на всех этапах поступления: от выбора вуза до подачи документов
            </p>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      step >= s.number
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s.number ? <CheckCircle className="w-8 h-8" /> : s.number}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 text-center max-w-[100px]">{s.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded ${
                      step > s.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl p-8">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Выберите университет</h2>
                  <div className="space-y-3">
                    {universities.map((uni) => (
                      <button
                        key={uni}
                        onClick={() => {
                          setSelectedUniversity(uni);
                          setStep(2);
                        }}
                        className="w-full p-4 bg-white/60 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl text-left transition-all duration-300 flex items-center gap-4"
                      >
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        <span className="font-medium text-gray-800">{uni}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Введите ваши баллы</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Балл ЕНТ
                      </label>
                      <input
                        type="number"
                        value={scores.ent || ''}
                        onChange={(e) => setScores({ ...scores, ent: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0-140"
                        max={140}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Средний балл аттестата (GPA)
                      </label>
                      <input
                        type="number"
                        value={scores.gpa || ''}
                        onChange={(e) => setScores({ ...scores, gpa: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.0-5.0"
                        step="0.1"
                        max={5}
                      />
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Рассчитать шансы
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && chance && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Ваши шансы на поступление</h2>
                  <div className="text-center mb-8">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <svg className="transform -rotate-90 w-48 h-48">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="16"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray={`${(chance.percentage / 100) * 552.92} 552.92`}
                          className={`${
                            chance.status === 'excellent'
                              ? 'text-green-500'
                              : chance.status === 'good'
                              ? 'text-blue-500'
                              : chance.status === 'medium'
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          } transition-all duration-1000`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-800">{chance.percentage}%</span>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 mb-4">
                      {selectedUniversity}
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setStep(2)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                      >
                        Изменить данные
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        Получить рекомендации
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Персональные рекомендации</h2>
                  <div className="space-y-4">
                    {[
                      { icon: BookOpen, title: 'Подготовка к экзаменам', text: 'Рекомендуем дополнительно подготовиться по математике и физике' },
                      { icon: FileCheck, title: 'Документы', text: 'Подготовьте все необходимые документы заранее' },
                      { icon: Target, title: 'Альтернативные варианты', text: 'Рассмотрите также КБТУ и КазНТУ как запасные варианты' }
                    ].map((rec, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <rec.icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-bold text-gray-800 mb-1">{rec.title}</h3>
                            <p className="text-sm text-gray-600">{rec.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedUniversity('');
                      setScores({ ent: 0, gpa: 0 });
                    }}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Начать заново
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Чек-лист поступления</h3>
              <div className="space-y-3">
                {[
                  'Выбрать специальность',
                  'Подготовить документы',
                  'Подать заявление',
                  'Пройти вступительные испытания',
                  'Дождаться результатов'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step > idx + 1 ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {step > idx + 1 && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-sm ${step > idx + 1 ? 'text-gray-600 line-through' : 'text-gray-800'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
              <Award className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Полезные советы</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Подавайте документы в несколько вузов</li>
                <li>• Изучите требования к поступлению заранее</li>
                <li>• Подготовьте портфолио достижений</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdmissionHelper;

