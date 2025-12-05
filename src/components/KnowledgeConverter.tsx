import { FileText, Upload, FileCheck, BookOpen, Image, File, Sparkles, Wand2, Type, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../i18n';

// Типы для результатов ИИ
interface MindMapNode {
  id: string;
  content: string;
  children?: MindMapNode[];
}

interface FlashCard {
  question: string;
  answer: string;
}

interface Note {
  title: string;
  content: string;
}

interface AIResult {
  format: string;
  summary?: string;
  mindmap?: MindMapNode;
  cards?: FlashCard[];
  notes?: Note[];
}

function KnowledgeConverter() {
  const { t, language } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState<'summary' | 'mindmap' | 'cards' | 'notes'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const formats = [
    {
      id: 'summary' as const,
      icon: FileText,
      title: t.converter.formats.summary.title,
      description: t.converter.formats.summary.description
    },
    {
      id: 'mindmap' as const,
      icon: Sparkles,
      title: t.converter.formats.mindmap.title,
      description: t.converter.formats.mindmap.description
    },
    {
      id: 'cards' as const,
      icon: FileCheck,
      title: t.converter.formats.cards.title,
      description: t.converter.formats.cards.description
    },
    {
      id: 'notes' as const,
      icon: BookOpen,
      title: t.converter.formats.notes.title,
      description: t.converter.formats.notes.description
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProcess = async () => {
    if (inputMode === 'text' && !textInput.trim()) {
      alert(t.converter.alerts.enterText);
      return;
    }
    
    if (inputMode === 'file' && !uploadedFile) {
      alert(t.converter.alerts.uploadFile);
      return;
    }
    
    setIsProcessing(true);
    setProcessingStatus(t.converter.analyzing + '...');
    
    try {
      // Получаем текст для обработки
      let contentToProcess = textInput;
      
      if (inputMode === 'file' && uploadedFile) {
        // Читаем содержимое файла (для текстовых файлов)
        if (uploadedFile.type === 'text/plain' || uploadedFile.name.endsWith('.txt')) {
          contentToProcess = await uploadedFile.text();
        } else {
          // Для других файлов используем имя и тип как контекст
          contentToProcess = `Файл: ${uploadedFile.name} (${uploadedFile.type}). Создай пример контента на тему, связанную с названием файла.`;
        }
      }
      
      setProcessingStatus(t.converter.generating);
      
      // Формируем промпт в зависимости от формата
      const langInstruction = language === 'ru' ? 'на русском языке' : 'in English';
      const prompts: Record<string, string> = {
        summary: `Проанализируй следующий текст и создай структурированный конспект ${langInstruction}. Верни JSON в формате:
{
  "title": "Заголовок конспекта",
  "sections": [
    {
      "heading": "Название раздела",
      "content": "Содержимое раздела",
      "keyPoints": ["Ключевой пункт 1", "Ключевой пункт 2"]
    }
  ],
  "conclusion": "Заключение"
}

Текст для анализа:
${contentToProcess}`,
        
        mindmap: `Проанализируй следующий текст и создай структуру mind map ${langInstruction}. Верни JSON в формате:
{
  "center": "Главная тема",
  "branches": [
    {
      "title": "Ветка 1",
      "color": "blue",
      "children": [
        {
          "title": "Подтема 1.1",
          "children": [
            {"title": "Детали 1.1.1"},
            {"title": "Детали 1.1.2"}
          ]
        },
        {
          "title": "Подтема 1.2",
          "children": [
            {"title": "Детали 1.2.1"},
            {"title": "Детали 1.2.2"}
          ]
        }
      ]
    }
  ]
}

Создай 3-4 основные ветки, каждая с 2-3 подтемами, и у каждой подтемы 2 детали. Текст для анализа:
${contentToProcess}`,
        
        cards: `Проанализируй следующий текст и создай карточки для запоминания (flashcards) ${langInstruction}. Верни JSON в формате:
{
  "cards": [
    {
      "question": "Вопрос",
      "answer": "Ответ"
    }
  ]
}

Создай 8-12 карточек. Текст для анализа:
${contentToProcess}`,
        
        notes: `Проанализируй следующий текст и создай краткие заметки ${langInstruction}. Верни JSON в формате:
{
  "notes": [
    {
      "title": "Заголовок заметки",
      "content": "Содержимое заметки (2-3 предложения)",
      "color": "blue"
    }
  ]
}

Создай 5-8 заметок с разными цветами (blue, cyan, green, purple, pink). Текст для анализа:
${contentToProcess}`
      };
      
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error(t.converter.alerts.apiKeyError);
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Ты помощник для создания учебных материалов. Всегда отвечай ТОЛЬКО валидным JSON без markdown разметки.'
            },
            {
              role: 'user',
              content: prompts[selectedFormat]
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        throw new Error(`${t.converter.alerts.apiError}: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error(t.converter.alerts.emptyResponse);
      }
      
      // Парсим JSON ответ
      let parsedResult;
      try {
        // Убираем возможные markdown блоки
        const cleanJson = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedResult = JSON.parse(cleanJson);
      } catch {
        throw new Error(t.converter.alerts.parseError);
      }
      
      // Сохраняем результат в localStorage для передачи на страницу результата
      const result: AIResult = {
        format: selectedFormat,
        ...parsedResult
      };
      
      localStorage.setItem('converterResult', JSON.stringify(result));
      
      setIsProcessing(false);
      // Переход на страницу результата после обработки
      window.location.hash = `#converter-result?format=${selectedFormat}`;
      
    } catch (error) {
      console.error('Error processing:', error);
      setIsProcessing(false);
      alert(`${t.converter.alerts.apiError}: ${error instanceof Error ? error.message : t.converter.alerts.unknownError}`);
    }
  };

  const isProcessDisabled = isProcessing || (inputMode === 'text' ? !textInput.trim() : !uploadedFile);

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
                {t.converter.title}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.converter.description}
              </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl p-8">
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                <button
                  onClick={() => setInputMode('file')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    inputMode === 'file'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  {t.converter.inputModes.file}
                </button>
                <button
                  onClick={() => setInputMode('text')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    inputMode === 'text'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Type className="w-5 h-5" />
                  {t.converter.inputModes.text}
                </button>
              </div>

              {inputMode === 'file' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.converter.uploadTitle}</h2>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors mb-6 relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.doc,image/*"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">{t.converter.dragHere}</p>
                      <p className="text-sm text-gray-500 mb-4">{t.converter.or}</p>
                      <span className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                        {t.converter.selectFile}
                      </span>
                      <p className="text-xs text-gray-500 mt-4">{t.converter.supportedFormats}</p>
                    </label>
                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <File className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-800">{uploadedFile.name}</span>
                            <span className="text-xs text-gray-500">({(uploadedFile.size / 1024).toFixed(2)} KB)</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                              const input = document.getElementById('file-upload') as HTMLInputElement;
                              if (input) input.value = '';
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            {t.converter.remove}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File Types */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: File, label: 'PDF', color: 'from-red-500 to-red-600' },
                      { icon: FileText, label: 'DOCX', color: 'from-blue-500 to-blue-600' },
                      { icon: Image, label: t.converter.fileTypes.image, color: 'from-green-500 to-green-600' }
                    ].map((type, idx) => (
                      <div
                        key={idx}
                        className={`bg-gradient-to-br ${type.color} rounded-xl p-4 text-white text-center`}
                      >
                        <type.icon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs font-medium">{type.label}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.converter.textTitle}</h2>
                  
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={t.converter.textPlaceholder}
                    className="w-full h-64 px-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
                  />
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>{t.converter.characters}: {textInput.length}</span>
                    <button
                      onClick={() => setTextInput('')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t.converter.clear}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{t.converter.processingAI}</h3>
                    <p className="text-sm text-gray-600">{processingStatus || t.converter.analyzing}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.converter.selectFormat}</h2>
              
              <div className="space-y-4">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white/40 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          selectedFormat === format.id
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                            : 'bg-gray-100'
                        }`}
                      >
                        <format.icon
                          className={`w-7 h-7 ${
                            selectedFormat === format.id ? 'text-white' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{format.title}</h3>
                        <p className="text-sm text-gray-600">{format.description}</p>
                      </div>
                      {selectedFormat === format.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleProcess}
                disabled={isProcessDisabled}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t.converter.processing}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    {t.converter.convert}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t.converter.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: t.converter.features.analysis.title,
                description: t.converter.features.analysis.description
              },
              {
                icon: BookOpen,
                title: t.converter.features.textbooks.title,
                description: t.converter.features.textbooks.description
              },
              {
                icon: Sparkles,
                title: t.converter.features.smart.title,
                description: t.converter.features.smart.description
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default KnowledgeConverter;

