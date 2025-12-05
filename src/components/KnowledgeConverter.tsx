import { FileText, Upload, FileCheck, BookOpen, Image, File, Download, Sparkles, Wand2, Type } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function KnowledgeConverter() {
  const [selectedFormat, setSelectedFormat] = useState<'summary' | 'mindmap' | 'cards' | 'notes'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const formats = [
    {
      id: 'summary' as const,
      icon: FileText,
      title: 'Конспект',
      description: 'Структурированный конспект с основными тезисами'
    },
    {
      id: 'mindmap' as const,
      icon: Sparkles,
      title: 'Mind Map',
      description: 'Визуальная карта знаний с связями между понятиями'
    },
    {
      id: 'cards' as const,
      icon: FileCheck,
      title: 'Карточки',
      description: 'Карточки для запоминания (flashcards)'
    },
    {
      id: 'notes' as const,
      icon: BookOpen,
      title: 'Заметки',
      description: 'Краткие заметки с ключевыми моментами'
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProcess = () => {
    if (inputMode === 'text' && !textInput.trim()) {
      alert('Пожалуйста, введите текст для обработки');
      return;
    }
    
    if (inputMode === 'file' && !uploadedFile) {
      alert('Пожалуйста, загрузите файл для обработки');
      return;
    }
    
    setIsProcessing(true);
    // Симуляция обработки
    setTimeout(() => {
      setIsProcessing(false);
      // Переход на страницу результата после обработки
      window.location.hash = `#converter-result?format=${selectedFormat}`;
    }, 2000);
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
                Конвертер знаний
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Преобразуйте учебные материалы в удобный формат: конспекты, mind maps, карточки и заметки
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
                  Файл
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
                  Текст
                </button>
              </div>

              {inputMode === 'file' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Загрузите документ</h2>
                  
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
                      <p className="text-lg font-semibold text-gray-700 mb-2">Перетащите файл сюда</p>
                      <p className="text-sm text-gray-500 mb-4">или</p>
                      <span className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                        Выбрать файл
                      </span>
                      <p className="text-xs text-gray-500 mt-4">Поддерживаются: PDF, DOCX, TXT, изображения</p>
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
                            Удалить
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
                      { icon: Image, label: 'Изображение', color: 'from-green-500 to-green-600' }
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Введите текст</h2>
                  
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Вставьте или введите текст для обработки..."
                    className="w-full h-64 px-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
                  />
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>Символов: {textInput.length}</span>
                    <button
                      onClick={() => setTextInput('')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Очистить
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-spin">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Обработка документа...</h3>
                    <p className="text-sm text-gray-600">Анализируем содержимое и извлекаем ключевую информацию</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Выберите формат</h2>
              
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
                    Обработка...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Преобразовать
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Возможности</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Анализ документов',
                description: 'Автоматический анализ PDF, Word и других форматов'
              },
              {
                icon: BookOpen,
                title: 'Работа с учебниками',
                description: 'Извлечение ключевой информации из учебных материалов'
              },
              {
                icon: Sparkles,
                title: 'Умная обработка',
                description: 'AI определяет важные концепции и создаёт структурированный контент'
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

