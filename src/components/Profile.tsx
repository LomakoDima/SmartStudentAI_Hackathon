import { User, Award, BookOpen, TrendingUp, Target, FileText, Calendar, Star, Trophy, Settings, Bell, Shield, Globe, Palette, Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

function Profile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'progress' | 'achievements' | 'settings'>('overview');
  const [userName, setUserName] = useState('Ломако Дмитрий');
  const [userEmail, setUserEmail] = useState('lomakodima898@gmail.com');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Ломако Дмитрий';
    const email = localStorage.getItem('userEmail') || 'lomakodima898@gmail.com';
    setUserName(name);
    setUserEmail(email);
  }, []);

  const stats = [
    { icon: BookOpen, label: 'Изучено курсов', value: '0', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Достигнуто целей', value: '0/10', color: 'from-green-500 to-emerald-500' },
    { icon: Star, label: 'Рейтинг', value: '0', color: 'from-yellow-500 to-orange-500' },
    { icon: Trophy, label: 'Достижения', value: '0', color: 'from-purple-500 to-pink-500' }
  ];

  const achievements = [
    { id: 1, title: 'Отличник', description: 'Завершено 10 курсов с отличием', icon: Trophy, unlocked: true },
    { id: 2, title: 'Математический гений', description: 'Решено 100 задач по математике', icon: BookOpen, unlocked: true },
    { id: 3, title: 'Исследователь', description: 'Завершено 5 исследовательских проектов', icon: Award, unlocked: false },
    { id: 4, title: 'Лидер', description: 'Помог 20 студентам', icon: Star, unlocked: false }
  ];

  const recentActivity = [
    { date: 'Сегодня', action: 'Завершён курс "Математический анализ"', icon: BookOpen },
    { date: 'Вчера', action: 'Добавлено достижение "Отличник"', icon: Trophy },
    { date: '2 дня назад', action: 'Обновлён профиль', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Личный академический профиль
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Портфолио достижений, отслеживание прогресса и персональные рекомендации
            </p>
          </div>
        </div>

        {/* Main Card - Profile, Stats, Tabs */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                ЛД
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{userName}</h2>
                <p className="text-gray-600 mb-2">{userEmail}</p>
                <p className="text-gray-500 text-xs italic">
                  Ваши интересы и специализации будут отображаться здесь после заполнения профиля
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                  0
                </div>
                <div className="text-xs text-gray-600">Средний балл</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200/50">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-4 ${index < stats.length - 1 ? 'border-r border-gray-200/50' : ''} ${index < 2 ? 'md:border-b-0 border-b border-gray-200/50' : ''}`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="p-2">
            <div className="flex gap-2">
              {[
                { id: 'overview', label: 'Обзор', icon: User },
                { id: 'portfolio', label: 'Портфолио', icon: FileText },
                { id: 'progress', label: 'Прогресс', icon: TrendingUp },
                { id: 'achievements', label: 'Достижения', icon: Trophy },
                { id: 'settings', label: 'Настройки', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'overview' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Прогресс обучения
                  </h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <TrendingUp className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">Данные о прогрессе появятся здесь</p>
                    <p className="text-gray-400 text-xs">после начала обучения на платформе</p>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Последняя активность
                  </h3>
                  <div className="text-center py-10">
                    <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">История активности будет отображаться</p>
                    <p className="text-gray-400 text-xs">по мере использования сервисов платформы</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800">Мои проекты</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">Портфолио проектов будет доступно</p>
                    <p className="text-gray-400 text-xs">после добавления ваших работ</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800">Детальная статистика</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <TrendingUp className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">Статистика обучения появится</p>
                    <p className="text-gray-400 text-xs">после прохождения курсов и выполнения заданий</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800">Достижения</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <Trophy className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">Ваши достижения будут отображаться здесь</p>
                    <p className="text-gray-400 text-xs">по мере выполнения учебных задач и целей</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg overflow-hidden">
                {/* Настройки профиля */}
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Настройки профиля
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                      Сохранить изменения
                    </button>
                  </div>
                </div>

                {/* Уведомления */}
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Уведомления
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Email уведомления</p>
                        <p className="text-sm text-gray-600">Получать уведомления на почту</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Уведомления о курсах</p>
                        <p className="text-sm text-gray-600">Новые материалы и задания</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Уведомления о достижениях</p>
                        <p className="text-sm text-gray-600">Новые награды и прогресс</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Безопасность */}
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Безопасность
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Введите текущий пароль"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Введите новый пароль"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите пароль</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Повторите новый пароль"
                      />
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                      Изменить пароль
                    </button>
                  </div>
                </div>

                {/* Язык и регион */}
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Язык и регион
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Язык интерфейса</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Русский</option>
                        <option>Қазақша</option>
                        <option>English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Часовой пояс</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Алматы (UTC+6)</option>
                        <option>Астана (UTC+6)</option>
                        <option>Атырау (UTC+5)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Внешний вид */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-600" />
                    Внешний вид
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Тема оформления</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button className="px-4 py-3 border-2 border-blue-600 bg-blue-50 rounded-lg font-medium text-blue-700">
                          Светлая
                        </button>
                        <button className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400">
                          Тёмная
                        </button>
                        <button className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400">
                          Авто
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg">
              <div className="p-4 border-b border-gray-200/50">
                <h3 className="font-bold text-gray-800 text-sm">Рекомендации</h3>
              </div>
              <div className="p-4">
                <div className="text-center py-6">
                  <Target className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs mb-1">Персональные рекомендации</p>
                  <p className="text-gray-400 text-xs">появятся на основе вашей активности</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl shadow-lg">
              <div className="p-4">
                <Target className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-bold text-gray-800 text-sm mb-2">Цели на месяц</h3>
                <div className="text-center py-4">
                  <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs mb-1">Установите цели для</p>
                  <p className="text-gray-400 text-xs">отслеживания прогресса</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

