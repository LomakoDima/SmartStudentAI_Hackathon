import { Brain, Lightbulb, Target, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';

function AITutor() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingTime, setThinkingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setThinkingTime(elapsed);
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setThinkingTime(0);
      startTimeRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} сек`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} мин`;
    }
    return `${minutes} мин ${remainingSeconds} сек`;
  };

  const sendMessageToAI = async (userMessage: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Получаем API ключ из переменных окружения или используем дефолтный
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
      
      if (!apiKey) {
        throw new Error('API ключ не найден. Пожалуйста, добавьте VITE_OPENAI_API_KEY в .env файл');
      }

      // Формируем сообщения для API
      const apiMessages = [
        {
          role: 'system',
          content: 'Ты опытный репетитор и преподаватель. Твоя задача - помогать студентам разобраться в сложных темах, объяснять материал простым и понятным языком, адаптируясь под уровень знаний ученика. Отвечай на русском языке, будь дружелюбным и терпеливым.'
        },
        ...messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Ошибка API: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || 'Извините, не удалось получить ответ.';

      return aiMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при обращении к AI';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Добавляем сообщение пользователя сразу
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const aiResponse = await sendMessageToAI(userMessage);
      setMessages([...newMessages, { role: 'ai' as const, content: aiResponse }]);
    } catch (err) {
      // Ошибка уже обработана в sendMessageToAI
      console.error('Ошибка при отправке сообщения:', err);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Адаптивное обучение',
      description: 'AI подстраивается под ваш стиль обучения и темп усвоения материала'
    },
    {
      icon: Lightbulb,
      title: 'Объяснение сложных тем',
      description: 'Получайте простые и понятные объяснения даже самых сложных концепций'
    },
    {
      icon: Target,
      title: 'Персональные задания',
      description: 'Практические задания, адаптированные под ваш уровень знаний'
    },
    {
      icon: TrendingUp,
      title: 'Отслеживание прогресса',
      description: 'Видите свой прогресс и получайте рекомендации по улучшению'
    }
  ];

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
          <div className="mb-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                AI-репетитор
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Персональный искусственный интеллект, который помогает разобраться в сложных темах и адаптируется под ваш стиль обучения
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl overflow-hidden h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Репетитор</h2>
                    <p className="text-sm text-white/80">Готов помочь с обучением</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <p className="text-lg font-medium mb-2">Начните диалог с AI-репетитором</p>
                    <p className="text-sm">Задайте вопрос по любому предмету или теме</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-2xl p-4 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <p className="text-sm text-gray-600">
                              AI думает... ({formatTime(thinkingTime)})
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    <p className="font-medium mb-1">Ошибка</p>
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Задайте вопрос..."
                    className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      'Отправить'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Быстрые действия</h3>
              <div className="space-y-2">
                {['Математика', 'Физика', 'Химия', 'История'].map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setInput(`Объясни тему по ${subject.toLowerCase()}`)}
                    className="w-full text-left px-4 py-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors text-sm font-medium text-gray-700"
                  >
                    {subject}
                  </button>
                ))}
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

export default AITutor;

