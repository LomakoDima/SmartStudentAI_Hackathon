import { useState, useRef, useEffect } from 'react';
import { GraduationCap, Send, Loader2, User, Bot, Sparkles, FileText, Target, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StudentProfile {
  entScore: number;
  gpa: number;
  interests: string;
  preferredCity: string;
  budget: string;
}

function AdmissionHelper() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'checklist'>('chat');
  const [profile, setProfile] = useState<StudentProfile>({
    entScore: 0,
    gpa: 0,
    interests: '',
    preferredCity: '',
    budget: ''
  });
  const [checklist, setChecklist] = useState<{ item: string; completed: boolean }[]>([]);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    ru: {
      title: 'AI Помощник для поступления',
      description: 'Персональный AI-консультант для подготовки к поступлению в университеты Казахстана',
      tabs: {
        chat: 'Консультация',
        profile: 'Мой профиль',
        checklist: 'Чек-лист'
      },
      chat: {
        placeholder: 'Задайте вопрос о поступлении...',
        send: 'Отправить',
        thinking: 'AI думает...',
        welcome: 'Привет! Я ваш AI-помощник для поступления в университеты Казахстана. Я могу помочь с:\n\n• Выбором университета и специальности\n• Информацией о требованиях и сроках\n• Подготовкой документов\n• Расчётом шансов на поступление\n• Советами по подготовке к ЕНТ\n• Написанием мотивационного письма\n\nЗадайте любой вопрос!',
        error: 'Произошла ошибка. Попробуйте ещё раз.',
        quickQuestions: [
          'Какие документы нужны для поступления?',
          'Как рассчитать мои шансы на грант?',
          'Помоги написать мотивационное письмо',
          'Сроки подачи документов 2025'
        ]
      },
      profile: {
        title: 'Ваш профиль абитуриента',
        entScore: 'Балл ЕНТ (или ожидаемый)',
        gpa: 'Средний балл аттестата',
        interests: 'Интересующие направления',
        interestsPlaceholder: 'Например: IT, медицина, бизнес...',
        preferredCity: 'Предпочтительный город',
        budget: 'Бюджет на обучение',
        budgetOptions: ['Грант', 'До 1 млн ₸/год', '1-2 млн ₸/год', 'Без ограничений'],
        save: 'Сохранить профиль',
        saved: 'Профиль сохранён!',
        getRecommendations: 'Получить рекомендации от AI'
      },
      checklist: {
        title: 'Персональный чек-лист',
        generate: 'Сгенерировать чек-лист',
        generating: 'Генерация...',
        empty: 'Заполните профиль и нажмите "Сгенерировать чек-лист" для получения персонализированного плана подготовки',
        markDone: 'Отметить как выполнено'
      },
      features: {
        consultation: {
          title: 'AI Консультации',
          desc: 'Мгновенные ответы на все вопросы о поступлении'
        },
        recommendations: {
          title: 'Персональные рекомендации',
          desc: 'Советы на основе ваших баллов и интересов'
        },
        documents: {
          title: 'Помощь с документами',
          desc: 'Чек-листы и шаблоны для поступления'
        },
        motivation: {
          title: 'Мотивационное письмо',
          desc: 'AI поможет написать эффективное письмо'
        }
      }
    },
    en: {
      title: 'AI Admission Helper',
      description: 'Personal AI consultant for preparing to enter universities in Kazakhstan',
      tabs: {
        chat: 'Consultation',
        profile: 'My Profile',
        checklist: 'Checklist'
      },
      chat: {
        placeholder: 'Ask a question about admission...',
        send: 'Send',
        thinking: 'AI is thinking...',
        welcome: 'Hello! I am your AI assistant for admission to universities in Kazakhstan. I can help with:\n\n• Choosing a university and major\n• Information about requirements and deadlines\n• Document preparation\n• Calculating admission chances\n• UNT preparation tips\n• Writing a motivation letter\n\nAsk any question!',
        error: 'An error occurred. Please try again.',
        quickQuestions: [
          'What documents are needed for admission?',
          'How to calculate my grant chances?',
          'Help me write a motivation letter',
          'Application deadlines 2025'
        ]
      },
      profile: {
        title: 'Your Applicant Profile',
        entScore: 'UNT Score (or expected)',
        gpa: 'GPA',
        interests: 'Areas of Interest',
        interestsPlaceholder: 'e.g.: IT, medicine, business...',
        preferredCity: 'Preferred City',
        budget: 'Education Budget',
        budgetOptions: ['Grant', 'Up to $2,000/year', '$2,000-4,000/year', 'No limit'],
        save: 'Save Profile',
        saved: 'Profile saved!',
        getRecommendations: 'Get AI Recommendations'
      },
      checklist: {
        title: 'Personal Checklist',
        generate: 'Generate Checklist',
        generating: 'Generating...',
        empty: 'Fill in your profile and click "Generate Checklist" to get a personalized preparation plan',
        markDone: 'Mark as done'
      },
      features: {
        consultation: {
          title: 'AI Consultations',
          desc: 'Instant answers to all admission questions'
        },
        recommendations: {
          title: 'Personal Recommendations',
          desc: 'Advice based on your scores and interests'
        },
        documents: {
          title: 'Document Help',
          desc: 'Checklists and templates for admission'
        },
        motivation: {
          title: 'Motivation Letter',
          desc: 'AI will help write an effective letter'
        }
      }
    }
  };

  const texts = t[language];

  const cities = language === 'ru' 
    ? ['Любой', 'Алматы', 'Астана', 'Караганда', 'Шымкент']
    : ['Any', 'Almaty', 'Astana', 'Karaganda', 'Shymkent'];

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: texts.chat.welcome,
        timestamp: new Date()
      }]);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const systemPrompt = language === 'ru'
        ? `Ты - опытный консультант по поступлению в университеты Казахстана. Ты помогаешь абитуриентам с:
- Выбором университета и специальности
- Информацией о требованиях и сроках поступления
- Подготовкой документов
- Расчётом шансов на грант
- Советами по подготовке к ЕНТ
- Написанием мотивационных писем

Профиль абитуриента (если заполнен):
- Балл ЕНТ: ${profile.entScore || 'не указан'}
- GPA: ${profile.gpa || 'не указан'}
- Интересы: ${profile.interests || 'не указаны'}
- Город: ${profile.preferredCity || 'не указан'}
- Бюджет: ${profile.budget || 'не указан'}

Давай конкретные, практические советы. Будь дружелюбным и поддерживающим. Отвечай на русском.`
        : `You are an experienced consultant for university admission in Kazakhstan. You help applicants with:
- Choosing a university and major
- Information about requirements and deadlines
- Document preparation
- Calculating grant chances
- UNT (Unified National Testing) preparation tips
- Writing motivation letters

Applicant profile (if filled):
- UNT Score: ${profile.entScore || 'not specified'}
- GPA: ${profile.gpa || 'not specified'}
- Interests: ${profile.interests || 'not specified'}
- City: ${profile.preferredCity || 'not specified'}
- Budget: ${profile.budget || 'not specified'}

Give specific, practical advice. Be friendly and supportive. Answer in English.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: content }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0]?.message?.content || texts.chat.error,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: texts.chat.error,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChecklist = async () => {
    setIsGeneratingChecklist(true);
    
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const prompt = language === 'ru'
        ? `Создай персонализированный чек-лист для поступления в университет Казахстана.

Профиль абитуриента:
- Балл ЕНТ: ${profile.entScore || 'не указан'}
- GPA: ${profile.gpa || 'не указан'}
- Интересы: ${profile.interests || 'IT, технологии'}
- Предпочтительный город: ${profile.preferredCity || 'Алматы'}
- Бюджет: ${profile.budget || 'Грант'}

Верни JSON массив из 10-15 пунктов в формате:
[{"item": "текст пункта"}, {"item": "текст пункта"}]

Включи конкретные шаги: подготовка документов, сроки, подача заявления, подготовка к ЕНТ, написание мотивационного письма и т.д.
Только JSON, без markdown и пояснений.`
        : `Create a personalized checklist for university admission in Kazakhstan.

Applicant profile:
- UNT Score: ${profile.entScore || 'not specified'}
- GPA: ${profile.gpa || 'not specified'}
- Interests: ${profile.interests || 'IT, technology'}
- Preferred city: ${profile.preferredCity || 'Almaty'}
- Budget: ${profile.budget || 'Grant'}

Return a JSON array of 10-15 items in format:
[{"item": "item text"}, {"item": "item text"}]

Include specific steps: document preparation, deadlines, application submission, UNT preparation, motivation letter writing, etc.
Only JSON, no markdown or explanations.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      let content = data.choices[0]?.message?.content || '[]';
      
      // Clean JSON
      content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd + 1);
      }

      const items = JSON.parse(content);
      setChecklist(items.map((i: { item: string }) => ({ item: i.item, completed: false })));
    } catch (error) {
      console.error('Checklist generation error:', error);
    } finally {
      setIsGeneratingChecklist(false);
    }
  };

  const getRecommendations = () => {
    const prompt = language === 'ru'
      ? `На основе моего профиля (ЕНТ: ${profile.entScore}, GPA: ${profile.gpa}, интересы: ${profile.interests}, город: ${profile.preferredCity}, бюджет: ${profile.budget}), какие университеты и специальности мне подойдут? Какие у меня шансы на грант?`
      : `Based on my profile (UNT: ${profile.entScore}, GPA: ${profile.gpa}, interests: ${profile.interests}, city: ${profile.preferredCity}, budget: ${profile.budget}), which universities and majors would suit me? What are my chances for a grant?`;
    
    setActiveTab('chat');
    sendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              {texts.title}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {texts.description}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: MessageSquare, ...texts.features.consultation },
              { icon: Target, ...texts.features.recommendations },
              { icon: FileText, ...texts.features.documents },
              { icon: Sparkles, ...texts.features.motivation }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-xl p-4 text-center">
                <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Tabs */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-xl p-2 flex gap-2">
                {(['chat', 'profile', 'checklist'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {texts.tabs[tab]}
                  </button>
                ))}
              </div>

              {/* Profile Form */}
              {activeTab === 'profile' && (
                <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">{texts.profile.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{texts.profile.entScore}</label>
                      <input
                        type="number"
                        value={profile.entScore || ''}
                        onChange={(e) => setProfile({ ...profile, entScore: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0-140"
                        max={140}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{texts.profile.gpa}</label>
                      <input
                        type="number"
                        value={profile.gpa || ''}
                        onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.0-5.0"
                        step="0.1"
                        max={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{texts.profile.interests}</label>
                      <input
                        type="text"
                        value={profile.interests}
                        onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={texts.profile.interestsPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{texts.profile.preferredCity}</label>
                      <select
                        value={profile.preferredCity}
                        onChange={(e) => setProfile({ ...profile, preferredCity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">--</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{texts.profile.budget}</label>
                      <select
                        value={profile.budget}
                        onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">--</option>
                        {texts.profile.budgetOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={getRecommendations}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      {texts.profile.getRecommendations}
                    </button>
                  </div>
                </div>
              )}

              {/* Checklist */}
              {activeTab === 'checklist' && (
                <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">{texts.checklist.title}</h3>
                    <button
                      onClick={generateChecklist}
                      disabled={isGeneratingChecklist}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {isGeneratingChecklist ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {texts.checklist.generating}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          {texts.checklist.generate}
                        </>
                      )}
                    </button>
                  </div>
                  
                  {checklist.length === 0 ? (
                    <p className="text-gray-500 text-sm">{texts.checklist.empty}</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {checklist.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const newChecklist = [...checklist];
                            newChecklist[idx].completed = !newChecklist[idx].completed;
                            setChecklist(newChecklist);
                          }}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            item.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                            {item.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Questions */}
              {activeTab === 'chat' && (
                <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-3 text-sm">{language === 'ru' ? 'Быстрые вопросы' : 'Quick Questions'}</h4>
                  <div className="space-y-2">
                    {texts.chat.quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-xl overflow-hidden h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{language === 'ru' ? 'AI Консультант' : 'AI Consultant'}</h3>
                      <p className="text-white/70 text-sm">{language === 'ru' ? 'Готов помочь с поступлением' : 'Ready to help with admission'}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-blue-600'
                          : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{texts.chat.thinking}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputMessage)}
                      placeholder={texts.chat.placeholder}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => sendMessage(inputMessage)}
                      disabled={isLoading || !inputMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdmissionHelper;
