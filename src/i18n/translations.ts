export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    // Header
    header: {
      home: 'Главная',
      dataHub: 'DataHub',
      compare: 'Сравнение',
      tour3d: '3D-тур',
      services: 'Сервисы',
      aiTutor: 'AI-репетитор',
      converter: 'Конвертер знаний',
      admission: 'Помощник поступления',
      profile: 'Профиль',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      settings: 'Настройки',
      aboutUniversity: 'Об университетах',
      academicPrograms: 'Академические программы',
      international: 'Международное сотрудничество',
    },
    
    // Hero
    hero: {
      badge1: 'Единая платформа',
      badge2: 'Все ВУЗы Казахстана',
      title: 'DataHub',
      titleHighlight: 'ВУЗов РК',
      description: 'Единый цифровой каталог университетов Казахстана. Вся информация о вузах в одном месте — удобный поиск, сравнение и выбор.',
      exploreButton: 'Исследовать DataHub',
      compareButton: 'Сравнить ВУЗы',
      stats: {
        universities: 'ВУЗов РК',
        students: 'Студентов',
        sections: 'Разделов данных',
        info: 'Информация',
        infoValue: 'Актуальная',
      },
    },
    
    // DataHub
    dataHub: {
      title: 'DataHub ВУЗов',
      description: 'Вся информация о казахстанских университетах в одном месте',
      features: {
        about: {
          title: 'Об университете',
          description: 'Миссия, история, достижения, руководство и базовые сведения',
        },
        programs: {
          title: 'Академические программы',
          description: 'Каталог образовательных программ с описанием направлений',
        },
        admission: {
          title: 'Приём и поступление',
          description: 'Требования, сроки, гранты, стипендии и финансовая поддержка',
        },
        tour: {
          title: '3D-тур',
          description: 'Виртуальные экскурсии по кампусам университетов',
        },
        international: {
          title: 'Международное сотрудничество',
          description: 'Программы обмена и партнёрские университеты',
        },
        compare: {
          title: 'Сравнение',
          description: 'Сравнивайте университеты по важным параметрам',
        },
      },
    },
    
    // Services
    services: {
      title: 'Сервисы SmartStudentAI',
      description: 'Инновационные инструменты на базе искусственного интеллекта для эффективного обучения',
      learnMore: 'Подробнее',
      items: {
        aiTutor: {
          title: 'AI-репетитор',
          description: 'Персональный AI-помощник для изучения любых предметов. Задавайте вопросы и получайте понятные объяснения.',
          features: ['Помощь по любым предметам', 'Объяснения сложных тем', 'Доступ 24/7'],
        },
        converter: {
          title: 'Конвертер знаний',
          description: 'Преобразуйте учебные материалы в удобные форматы: конспекты, карточки, mind map.',
          features: ['Анализ документов', 'Создание конспектов', 'Mind Map и карточки'],
        },
        admission: {
          title: 'Помощник поступления',
          description: 'Подготовьтесь к поступлению с AI-помощником. Рекомендации, сроки, документы.',
          features: ['Подбор университетов', 'Календарь сроков', 'Чек-листы документов'],
        },
        profile: {
          title: 'Академический профиль',
          description: 'Ваше персональное портфолио достижений и прогресс обучения.',
          features: ['Отслеживание прогресса', 'Портфолио достижений', 'Персональные рекомендации'],
        },
      },
    },
    
    // Footer
    footer: {
      description: 'Единая платформа для поиска, сравнения и выбора университетов Казахстана с AI-инструментами для успешного обучения.',
      sections: 'Разделы',
      services: 'Сервисы',
      contacts: 'Контакты',
      phone: 'Телефон',
      email: 'Email',
      address: 'Адрес',
      addressValue: 'Казахстан, г. Алматы',
      rights: 'Все права защищены.',
    },
    
    // Knowledge Converter Page
    converter: {
      title: 'Конвертер знаний',
      description: 'Преобразуйте учебные материалы в удобный формат: конспекты, mind maps, карточки и заметки',
      inputModes: {
        file: 'Файл',
        text: 'Текст',
      },
      uploadTitle: 'Загрузите документ',
      textTitle: 'Введите текст',
      dragHere: 'Перетащите файл сюда',
      or: 'или',
      selectFile: 'Выбрать файл',
      supportedFormats: 'Поддерживаются: PDF, DOCX, TXT, изображения',
      remove: 'Удалить',
      textPlaceholder: 'Вставьте или введите текст для обработки...',
      characters: 'Символов',
      clear: 'Очистить',
      selectFormat: 'Выберите формат',
      convert: 'Преобразовать',
      processing: 'Обработка...',
      processingAI: 'Обработка с помощью ИИ...',
      analyzing: 'Анализируем содержимое',
      generating: 'Генерируем контент с помощью ИИ...',
      formats: {
        summary: {
          title: 'Конспект',
          description: 'Структурированный конспект с основными тезисами',
        },
        mindmap: {
          title: 'Mind Map',
          description: 'Визуальная карта знаний с связями между понятиями',
        },
        cards: {
          title: 'Карточки',
          description: 'Карточки для запоминания (flashcards)',
        },
        notes: {
          title: 'Заметки',
          description: 'Краткие заметки с ключевыми моментами',
        },
      },
      fileTypes: {
        image: 'Изображение',
      },
      featuresTitle: 'Возможности',
      features: {
        analysis: {
          title: 'Анализ документов',
          description: 'Автоматический анализ PDF, Word и других форматов',
        },
        textbooks: {
          title: 'Работа с учебниками',
          description: 'Извлечение ключевой информации из учебных материалов',
        },
        smart: {
          title: 'Умная обработка',
          description: 'AI определяет важные концепции и создаёт структурированный контент',
        },
      },
      alerts: {
        enterText: 'Пожалуйста, введите текст для обработки',
        uploadFile: 'Пожалуйста, загрузите файл для обработки',
        apiKeyError: 'API ключ не настроен',
        apiError: 'Ошибка API',
        emptyResponse: 'Пустой ответ от ИИ',
        parseError: 'Не удалось разобрать ответ ИИ',
        unknownError: 'Неизвестная ошибка',
      },
    },
    
    // Knowledge Converter Page
    converter: {
      title: 'Конвертер знаний',
      description: 'Преобразуйте учебные материалы в удобный формат: конспекты, mind maps, карточки и заметки',
      inputModes: {
        file: 'Файл',
        text: 'Текст',
      },
      uploadTitle: 'Загрузите документ',
      textTitle: 'Введите текст',
      dragHere: 'Перетащите файл сюда',
      or: 'или',
      selectFile: 'Выбрать файл',
      supportedFormats: 'Поддерживаются: PDF, DOCX, TXT, изображения',
      remove: 'Удалить',
      textPlaceholder: 'Вставьте или введите текст для обработки...',
      characters: 'Символов',
      clear: 'Очистить',
      selectFormat: 'Выберите формат',
      convert: 'Преобразовать',
      processing: 'Обработка...',
      processingAI: 'Обработка с помощью ИИ...',
      analyzing: 'Анализируем содержимое',
      generating: 'Генерируем контент с помощью ИИ...',
      formats: {
        summary: {
          title: 'Конспект',
          description: 'Структурированный конспект с основными тезисами',
        },
        mindmap: {
          title: 'Mind Map',
          description: 'Визуальная карта знаний с связями между понятиями',
        },
        cards: {
          title: 'Карточки',
          description: 'Карточки для запоминания (flashcards)',
        },
        notes: {
          title: 'Заметки',
          description: 'Краткие заметки с ключевыми моментами',
        },
      },
      featuresTitle: 'Возможности',
      features: {
        analysis: {
          title: 'Анализ документов',
          description: 'Автоматический анализ PDF, Word и других форматов',
        },
        textbooks: {
          title: 'Работа с учебниками',
          description: 'Извлечение ключевой информации из учебных материалов',
        },
        smart: {
          title: 'Умная обработка',
          description: 'AI определяет важные концепции и создаёт структурированный контент',
        },
      },
      fileTypes: {
        image: 'Изображение',
      },
      alerts: {
        enterText: 'Пожалуйста, введите текст для обработки',
        uploadFile: 'Пожалуйста, загрузите файл для обработки',
        apiKeyError: 'API ключ не настроен',
        apiError: 'Ошибка API',
        emptyResponse: 'Пустой ответ от ИИ',
        parseError: 'Не удалось разобрать ответ ИИ',
        unknownError: 'Неизвестная ошибка',
      },
    },
    
    // AI Tutor Page
    aiTutor: {
      title: 'AI-репетитор',
      description: 'Персональный искусственный интеллект, который помогает разобраться в сложных темах и адаптируется под ваш стиль обучения',
      chatTitle: 'AI Репетитор',
      chatSubtitle: 'Готов помочь с обучением',
      emptyChat: 'Начните диалог с AI-репетитором',
      emptyHint: 'Задайте вопрос по любому предмету или теме',
      inputPlaceholder: 'Задайте вопрос...',
      send: 'Отправить',
      sending: 'Отправка...',
      thinking: 'AI думает...',
      error: 'Ошибка',
      apiKeyError: 'API ключ не найден. Пожалуйста, добавьте VITE_OPENAI_API_KEY в .env файл',
      apiError: 'Ошибка API',
      errorGeneric: 'Произошла ошибка при обращении к AI',
      noResponse: 'Извините, не удалось получить ответ.',
      time: {
        sec: 'сек',
        min: 'мин',
      },
      features: {
        adaptive: {
          title: 'Адаптивное обучение',
          description: 'AI подстраивается под ваш стиль обучения и темп усвоения материала',
        },
        explain: {
          title: 'Объяснение сложных тем',
          description: 'Получайте простые и понятные объяснения даже самых сложных концепций',
        },
        tasks: {
          title: 'Персональные задания',
          description: 'Практические задания, адаптированные под ваш уровень знаний',
        },
        progress: {
          title: 'Отслеживание прогресса',
          description: 'Видите свой прогресс и получайте рекомендации по улучшению',
        },
      },
      quickActions: 'Быстрые действия',
      subjects: {
        math: 'Математика',
        physics: 'Физика',
        chemistry: 'Химия',
        history: 'История',
      },
      explainTopic: 'Объясни тему по',
    },
    
    // 3D Tour Page
    tour3d: {
      title: '3D-туры по кампусам',
      description: 'Исследуйте университеты Казахстана в формате интерактивных виртуальных туров. Посетите кампусы, аудитории, библиотеки и лаборатории, не выходя из дома.',
      duration: 'мин',
      points: 'точек',
      view360: '360° вид',
      featuresTitle: 'Возможности виртуальных туров',
      features: {
        view360: {
          title: '360° обзор',
          description: 'Полноценный круговой обзор каждого помещения с возможностью вращения',
        },
        interactive: {
          title: 'Интерактивные точки',
          description: 'Переходите между различными локациями кампуса одним кликом',
        },
        fullscreen: {
          title: 'Полноэкранный режим',
          description: 'Погрузитесь в атмосферу университета с полноэкранным просмотром',
        },
      },
      viewer: {
        previousLocation: 'Предыдущая локация',
        nextLocation: 'Следующая локация',
        locationOf: 'из',
        location: 'Локация',
        locations: 'Локации',
        close: 'Закрыть',
        dragToRotate: 'Перетащите для вращения',
        locationsList: 'Список локаций',
      },
      locations: {
        mainBuilding: 'Главный корпус',
        campus: 'Кампус',
        mainEntrance: 'Главный вход',
        library: 'Библиотека',
        researchCenter: 'Исследовательский центр',
        classrooms: 'Аудитории',
        alFarabiLibrary: 'Библиотека аль-Фараби',
        sportsComplex: 'Спортивный комплекс',
        techLabs: 'Технические лаборатории',
        innovationCenter: 'Инновационный центр',
        miningMuseum: 'Горный музей',
        engineeringLabs: 'Инженерные лаборатории',
        studentTown: 'Студенческий городок',
      },
    },
    
    // Compare Page
    compare: {
      title: 'Сравнение университетов',
      subtitle: 'Сравните до 4 университетов по ключевым параметрам',
      searchPlaceholder: 'Поиск университета...',
      addUniversity: 'Добавить вуз',
      add: 'Добавить',
      parameter: 'Параметр',
      categories: {
        general: 'Общая информация',
        education: 'Образование',
        finance: 'Финансы',
      },
      fields: {
        city: 'Город',
        type: 'Тип',
        founded: 'Год основания',
        students: 'Количество студентов',
        rating: 'Рейтинг',
        programs: 'Количество программ',
        languages: 'Языки обучения',
        tuition: 'Стоимость обучения',
        grants: 'Гранты и стипендии',
      },
      types: {
        national: 'Национальный',
        technical: 'Технический',
        humanitarian: 'Гуманитарный',
      },
      languages: {
        kazakh: 'Казахский',
        russian: 'Русский',
        english: 'Английский',
        chinese: 'Китайский',
      },
    },
    
    // About University Page
    aboutUniversity: {
      title: 'Об университетах',
      description: 'Подробная информация о миссии, истории, достижениях и руководстве университетов Казахстана',
      backToList: 'Вернуться к списку',
      founded: 'Основан',
      students: 'студентов',
      yearFounded: 'Год основания',
      type: 'Тип',
      rating: 'Рейтинг',
      about: 'Об университете',
      mission: 'Миссия',
      rector: 'Ректор',
      achievements: 'Ключевые достижения',
      learnMore: 'Подробнее',
    },
    
    // Academic Programs Page
    academicPrograms: {
      title: 'Академические программы',
      description: 'Каталог образовательных программ университетов Казахстана с подробным описанием направлений и курсов',
      backToList: 'Вернуться к списку',
      searchPlaceholder: 'Поиск программы или университета...',
      found: 'Найдено',
      programs: 'программ',
      duration: 'Длительность',
      language: 'Язык обучения',
      tuition: 'Стоимость',
      category: 'Категория',
      aboutProgram: 'О программе',
      specializations: 'Специализации',
      careers: 'Карьерные возможности',
      details: 'Подробнее',
      notFound: 'Программы не найдены',
      tryOtherFilters: 'Попробуйте изменить параметры поиска',
    },
    
    // International Cooperation Page
    international: {
      title: 'Международное сотрудничество',
      description: 'Программы обмена, стажировки и партнёрские университеты для студентов Казахстана',
      tabs: {
        exchange: 'Программы обмена',
        partners: 'Партнёрские вузы',
      },
      stats: {
        partners: 'Партнёров',
        countries: 'Стран',
        students: 'Студентов в обмене',
        programs: 'Программ',
      },
      backToList: 'Вернуться к списку',
      funding: 'финансирование',
      duration: 'Длительность',
      fromUniversity: 'От университета',
      partner: 'Партнёр',
      deadline: 'Дедлайн',
      aboutProgram: 'О программе',
      benefits: 'Преимущества',
      requirements: 'Требования',
      details: 'Подробнее',
      programsCount: 'программ',
      studentsCount: 'студентов',
    },
  },
  
  en: {
    // Header
    header: {
      home: 'Home',
      dataHub: 'DataHub',
      compare: 'Compare',
      tour3d: '3D Tour',
      services: 'Services',
      aiTutor: 'AI Tutor',
      converter: 'Knowledge Converter',
      admission: 'Admission Helper',
      profile: 'Profile',
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
      settings: 'Settings',
      aboutUniversity: 'About Universities',
      academicPrograms: 'Academic Programs',
      international: 'International',
    },
    
    // Hero
    hero: {
      badge1: 'Unified Platform',
      badge2: 'All Universities of Kazakhstan',
      title: 'DataHub',
      titleHighlight: 'Universities of RK',
      description: 'A unified digital catalog of Kazakhstan universities. All information about universities in one place — convenient search, comparison, and selection.',
      exploreButton: 'Explore DataHub',
      compareButton: 'Compare Universities',
      stats: {
        universities: 'Universities',
        students: 'Students',
        sections: 'Data Sections',
        info: 'Information',
        infoValue: 'Up-to-date',
      },
    },
    
    // DataHub
    dataHub: {
      title: 'University DataHub',
      description: 'All information about Kazakhstan universities in one place',
      features: {
        about: {
          title: 'About University',
          description: 'Mission, history, achievements, leadership and basic information',
        },
        programs: {
          title: 'Academic Programs',
          description: 'Catalog of educational programs with direction descriptions',
        },
        admission: {
          title: 'Admission',
          description: 'Requirements, deadlines, grants, scholarships and financial support',
        },
        tour: {
          title: '3D Tour',
          description: 'Virtual tours of university campuses',
        },
        international: {
          title: 'International Cooperation',
          description: 'Exchange programs and partner universities',
        },
        compare: {
          title: 'Comparison',
          description: 'Compare universities by important parameters',
        },
      },
    },
    
    // Services
    services: {
      title: 'SmartStudentAI Services',
      description: 'Innovative AI-powered tools for effective learning',
      learnMore: 'Learn More',
      items: {
        aiTutor: {
          title: 'AI Tutor',
          description: 'Personal AI assistant for studying any subject. Ask questions and get clear explanations.',
          features: ['Help with any subject', 'Complex topic explanations', '24/7 Access'],
        },
        converter: {
          title: 'Knowledge Converter',
          description: 'Transform study materials into convenient formats: notes, flashcards, mind maps.',
          features: ['Document analysis', 'Note creation', 'Mind Map & flashcards'],
        },
        admission: {
          title: 'Admission Helper',
          description: 'Prepare for admission with AI assistant. Recommendations, deadlines, documents.',
          features: ['University selection', 'Deadline calendar', 'Document checklists'],
        },
        profile: {
          title: 'Academic Profile',
          description: 'Your personal portfolio of achievements and learning progress.',
          features: ['Progress tracking', 'Achievement portfolio', 'Personal recommendations'],
        },
      },
    },
    
    // Footer
    footer: {
      description: 'A unified platform for searching, comparing and selecting Kazakhstan universities with AI tools for successful learning.',
      sections: 'Sections',
      services: 'Services',
      contacts: 'Contacts',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      addressValue: 'Kazakhstan, Almaty',
      rights: 'All rights reserved.',
    },
    
    // Knowledge Converter Page
    converter: {
      title: 'Knowledge Converter',
      description: 'Transform study materials into convenient formats: notes, mind maps, flashcards, and summaries',
      inputModes: {
        file: 'File',
        text: 'Text',
      },
      uploadTitle: 'Upload Document',
      textTitle: 'Enter Text',
      dragHere: 'Drag file here',
      or: 'or',
      selectFile: 'Select File',
      supportedFormats: 'Supported: PDF, DOCX, TXT, images',
      remove: 'Remove',
      textPlaceholder: 'Paste or enter text to process...',
      characters: 'Characters',
      clear: 'Clear',
      selectFormat: 'Select Format',
      convert: 'Convert',
      processing: 'Processing...',
      processingAI: 'Processing with AI...',
      analyzing: 'Analyzing content',
      generating: 'Generating content with AI...',
      formats: {
        summary: {
          title: 'Summary',
          description: 'Structured summary with key points',
        },
        mindmap: {
          title: 'Mind Map',
          description: 'Visual knowledge map with concept connections',
        },
        cards: {
          title: 'Flashcards',
          description: 'Flashcards for memorization',
        },
        notes: {
          title: 'Notes',
          description: 'Brief notes with key points',
        },
      },
      fileTypes: {
        image: 'Image',
      },
      featuresTitle: 'Features',
      features: {
        analysis: {
          title: 'Document Analysis',
          description: 'Automatic analysis of PDF, Word and other formats',
        },
        textbooks: {
          title: 'Textbook Processing',
          description: 'Extract key information from study materials',
        },
        smart: {
          title: 'Smart Processing',
          description: 'AI identifies important concepts and creates structured content',
        },
      },
      alerts: {
        enterText: 'Please enter text to process',
        uploadFile: 'Please upload a file to process',
        apiKeyError: 'API key not configured',
        apiError: 'API Error',
        emptyResponse: 'Empty response from AI',
        parseError: 'Could not parse AI response',
        unknownError: 'Unknown error',
      },
    },
    
    // Knowledge Converter Page
    converter: {
      title: 'Knowledge Converter',
      description: 'Transform study materials into convenient formats: notes, mind maps, flashcards and sticky notes',
      inputModes: {
        file: 'File',
        text: 'Text',
      },
      uploadTitle: 'Upload Document',
      textTitle: 'Enter Text',
      dragHere: 'Drag file here',
      or: 'or',
      selectFile: 'Select File',
      supportedFormats: 'Supported: PDF, DOCX, TXT, images',
      remove: 'Remove',
      textPlaceholder: 'Paste or enter text to process...',
      characters: 'Characters',
      clear: 'Clear',
      selectFormat: 'Select Format',
      convert: 'Convert',
      processing: 'Processing...',
      processingAI: 'Processing with AI...',
      analyzing: 'Analyzing content',
      generating: 'Generating content with AI...',
      formats: {
        summary: {
          title: 'Summary',
          description: 'Structured summary with main points',
        },
        mindmap: {
          title: 'Mind Map',
          description: 'Visual knowledge map with concept connections',
        },
        cards: {
          title: 'Flashcards',
          description: 'Cards for memorization',
        },
        notes: {
          title: 'Notes',
          description: 'Brief notes with key points',
        },
      },
      featuresTitle: 'Features',
      features: {
        analysis: {
          title: 'Document Analysis',
          description: 'Automatic analysis of PDF, Word and other formats',
        },
        textbooks: {
          title: 'Textbook Processing',
          description: 'Extracting key information from study materials',
        },
        smart: {
          title: 'Smart Processing',
          description: 'AI identifies important concepts and creates structured content',
        },
      },
      fileTypes: {
        image: 'Image',
      },
      alerts: {
        enterText: 'Please enter text to process',
        uploadFile: 'Please upload a file to process',
        apiKeyError: 'API key not configured',
        apiError: 'API Error',
        emptyResponse: 'Empty response from AI',
        parseError: 'Could not parse AI response',
        unknownError: 'Unknown error',
      },
    },
    
    // AI Tutor Page
    aiTutor: {
      title: 'AI Tutor',
      description: 'Personal artificial intelligence that helps you understand complex topics and adapts to your learning style',
      chatTitle: 'AI Tutor',
      chatSubtitle: 'Ready to help with learning',
      emptyChat: 'Start a conversation with AI Tutor',
      emptyHint: 'Ask a question about any subject or topic',
      inputPlaceholder: 'Ask a question...',
      send: 'Send',
      sending: 'Sending...',
      thinking: 'AI is thinking...',
      error: 'Error',
      apiKeyError: 'API key not found. Please add VITE_OPENAI_API_KEY to .env file',
      apiError: 'API Error',
      errorGeneric: 'An error occurred while contacting AI',
      noResponse: 'Sorry, could not get a response.',
      time: {
        sec: 'sec',
        min: 'min',
      },
      features: {
        adaptive: {
          title: 'Adaptive Learning',
          description: 'AI adapts to your learning style and pace of material absorption',
        },
        explain: {
          title: 'Complex Topic Explanations',
          description: 'Get simple and clear explanations of even the most complex concepts',
        },
        tasks: {
          title: 'Personal Assignments',
          description: 'Practical tasks adapted to your knowledge level',
        },
        progress: {
          title: 'Progress Tracking',
          description: 'See your progress and receive recommendations for improvement',
        },
      },
      quickActions: 'Quick Actions',
      subjects: {
        math: 'Mathematics',
        physics: 'Physics',
        chemistry: 'Chemistry',
        history: 'History',
      },
      explainTopic: 'Explain a topic about',
    },
    
    // 3D Tour Page
    tour3d: {
      title: '3D Campus Tours',
      description: 'Explore Kazakhstan universities through interactive virtual tours. Visit campuses, classrooms, libraries, and laboratories from home.',
      duration: 'min',
      points: 'points',
      view360: '360° view',
      featuresTitle: 'Virtual Tour Features',
      features: {
        view360: {
          title: '360° View',
          description: 'Full panoramic view of each room with rotation capability',
        },
        interactive: {
          title: 'Interactive Points',
          description: 'Navigate between different campus locations with one click',
        },
        fullscreen: {
          title: 'Fullscreen Mode',
          description: 'Immerse yourself in the university atmosphere with fullscreen viewing',
        },
      },
      viewer: {
        previousLocation: 'Previous location',
        nextLocation: 'Next location',
        locationOf: 'of',
        location: 'Location',
        locations: 'Locations',
        close: 'Close',
        dragToRotate: 'Drag to rotate',
        locationsList: 'Locations list',
      },
      locations: {
        mainBuilding: 'Main Building',
        campus: 'Campus',
        mainEntrance: 'Main Entrance',
        library: 'Library',
        researchCenter: 'Research Center',
        classrooms: 'Classrooms',
        alFarabiLibrary: 'Al-Farabi Library',
        sportsComplex: 'Sports Complex',
        techLabs: 'Technical Laboratories',
        innovationCenter: 'Innovation Center',
        miningMuseum: 'Mining Museum',
        engineeringLabs: 'Engineering Labs',
        studentTown: 'Student Town',
      },
    },
    
    // Compare Page
    compare: {
      title: 'University Comparison',
      subtitle: 'Compare up to 4 universities by key parameters',
      searchPlaceholder: 'Search university...',
      addUniversity: 'Add University',
      add: 'Add',
      parameter: 'Parameter',
      categories: {
        general: 'General Information',
        education: 'Education',
        finance: 'Finance',
      },
      fields: {
        city: 'City',
        type: 'Type',
        founded: 'Year Founded',
        students: 'Number of Students',
        rating: 'Rating',
        programs: 'Number of Programs',
        languages: 'Languages of Instruction',
        tuition: 'Tuition Fee',
        grants: 'Grants & Scholarships',
      },
      types: {
        national: 'National',
        technical: 'Technical',
        humanitarian: 'Humanitarian',
      },
      languages: {
        kazakh: 'Kazakh',
        russian: 'Russian',
        english: 'English',
        chinese: 'Chinese',
      },
    },
    
    // About University Page
    aboutUniversity: {
      title: 'About Universities',
      description: 'Detailed information about mission, history, achievements and leadership of Kazakhstan universities',
      backToList: 'Back to list',
      founded: 'Founded',
      students: 'students',
      yearFounded: 'Year Founded',
      type: 'Type',
      rating: 'Rating',
      about: 'About University',
      mission: 'Mission',
      rector: 'Rector',
      achievements: 'Key Achievements',
      learnMore: 'Learn More',
    },
    
    // Academic Programs Page
    academicPrograms: {
      title: 'Academic Programs',
      description: 'Catalog of educational programs at Kazakhstan universities with detailed descriptions of directions and courses',
      backToList: 'Back to list',
      searchPlaceholder: 'Search program or university...',
      found: 'Found',
      programs: 'programs',
      duration: 'Duration',
      language: 'Language',
      tuition: 'Tuition',
      category: 'Category',
      aboutProgram: 'About Program',
      specializations: 'Specializations',
      careers: 'Career Opportunities',
      details: 'Details',
      notFound: 'No programs found',
      tryOtherFilters: 'Try changing search parameters',
    },
    
    // International Cooperation Page
    international: {
      title: 'International Cooperation',
      description: 'Exchange programs, internships and partner universities for students in Kazakhstan',
      tabs: {
        exchange: 'Exchange Programs',
        partners: 'Partner Universities',
      },
      stats: {
        partners: 'Partners',
        countries: 'Countries',
        students: 'Students in Exchange',
        programs: 'Programs',
      },
      backToList: 'Back to list',
      funding: 'funding',
      duration: 'Duration',
      fromUniversity: 'From University',
      partner: 'Partner',
      deadline: 'Deadline',
      aboutProgram: 'About Program',
      benefits: 'Benefits',
      requirements: 'Requirements',
      details: 'Details',
      programsCount: 'programs',
      studentsCount: 'students',
    },
  },
};

export type TranslationKeys = typeof translations.ru;

