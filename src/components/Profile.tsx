import { User, BookOpen, TrendingUp, Target, FileText, Calendar, Star, Trophy, Settings, Bell, Shield, Globe, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function Profile() {
  const { t } = useLanguage();
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
    { icon: BookOpen, label: t.profile.stats.coursesCompleted, value: '0', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: t.profile.stats.goalsAchieved, value: '0/10', color: 'from-green-500 to-emerald-500' },
    { icon: Star, label: t.profile.stats.rating, value: '0', color: 'from-yellow-500 to-orange-500' },
    { icon: Trophy, label: t.profile.stats.achievements, value: '0', color: 'from-purple-500 to-pink-500' }
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
              {t.profile.title}
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              {t.profile.description}
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
                  {t.profile.interestsHint}
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                  0
                </div>
                <div className="text-xs text-gray-600">{t.profile.averageScore}</div>
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
                { id: 'overview', label: t.profile.tabs.overview, icon: User },
                { id: 'portfolio', label: t.profile.tabs.portfolio, icon: FileText },
                { id: 'progress', label: t.profile.tabs.progress, icon: TrendingUp },
                { id: 'achievements', label: t.profile.tabs.achievements, icon: Trophy },
                { id: 'settings', label: t.profile.tabs.settings, icon: Settings }
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
                    {t.profile.overview.learningProgress}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <TrendingUp className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">{t.profile.overview.progressHint}</p>
                    <p className="text-gray-400 text-xs">{t.profile.overview.progressSubHint}</p>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {t.profile.overview.recentActivity}
                  </h3>
                  <div className="text-center py-10">
                    <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">{t.profile.overview.activityHint}</p>
                    <p className="text-gray-400 text-xs">{t.profile.overview.activitySubHint}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800">{t.profile.portfolio.title}</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">{t.profile.portfolio.hint}</p>
                    <p className="text-gray-400 text-xs">{t.profile.portfolio.subHint}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800">{t.profile.progressTab.title}</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <TrendingUp className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">{t.profile.progressTab.hint}</p>
                    <p className="text-gray-400 text-xs">{t.profile.progressTab.subHint}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800">{t.profile.achievementsTab.title}</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-10">
                    <Trophy className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">{t.profile.achievementsTab.hint}</p>
                    <p className="text-gray-400 text-xs">{t.profile.achievementsTab.subHint}</p>
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
                    {t.profile.settings.profileSettings}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.name}</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.email}</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                      {t.profile.settings.saveChanges}
                    </button>
                  </div>
                </div>

                {/* Уведомления */}
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    {t.profile.settings.notifications}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{t.profile.settings.emailNotifications}</p>
                        <p className="text-sm text-gray-600">{t.profile.settings.emailNotificationsDesc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{t.profile.settings.courseNotifications}</p>
                        <p className="text-sm text-gray-600">{t.profile.settings.courseNotificationsDesc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{t.profile.settings.achievementNotifications}</p>
                        <p className="text-sm text-gray-600">{t.profile.settings.achievementNotificationsDesc}</p>
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
                    {t.profile.settings.security}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.currentPassword}</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t.profile.settings.currentPasswordPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.newPassword}</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t.profile.settings.newPasswordPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.confirmPassword}</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t.profile.settings.confirmPasswordPlaceholder}
                      />
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                      {t.profile.settings.changePassword}
                    </button>
                  </div>
                </div>

                {/* Язык и регион */}
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    {t.profile.settings.languageRegion}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.interfaceLanguage}</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>{t.profile.languages.russian}</option>
                        <option>{t.profile.languages.kazakh}</option>
                        <option>{t.profile.languages.english}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.timezone}</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>{t.profile.timezones.almaty}</option>
                        <option>{t.profile.timezones.astana}</option>
                        <option>{t.profile.timezones.atyrau}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Внешний вид */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-600" />
                    {t.profile.settings.appearance}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.profile.settings.theme}</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button className="px-4 py-3 border-2 border-blue-600 bg-blue-50 rounded-lg font-medium text-blue-700">
                          {t.profile.settings.themeLight}
                        </button>
                        <button className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400">
                          {t.profile.settings.themeDark}
                        </button>
                        <button className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400">
                          {t.profile.settings.themeAuto}
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
                <h3 className="font-bold text-gray-800 text-sm">{t.profile.sidebar.recommendations}</h3>
              </div>
              <div className="p-4">
                <div className="text-center py-6">
                  <Target className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs mb-1">{t.profile.sidebar.personalRecommendations}</p>
                  <p className="text-gray-400 text-xs">{t.profile.sidebar.recommendationsHint}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl shadow-lg">
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-2">{t.profile.sidebar.monthlyGoals}</h3>
                <div className="text-center py-4">
                  <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs mb-1">{t.profile.sidebar.setGoals}</p>
                  <p className="text-gray-400 text-xs">{t.profile.sidebar.trackProgress}</p>
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

