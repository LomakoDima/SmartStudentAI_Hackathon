// University Data API Service
// Получение реальных данных об университетах Казахстана

export interface UniversityData {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  cityEn: string;
  type: string;
  typeEn: string;
  founded: number;
  rector: string;
  rectorEn: string;
  students: string;
  description: string;
  descriptionEn: string;
  mission: string;
  missionEn: string;
  achievements: string[];
  achievementsEn: string[];
  website: string;
  rating: number;
  image: string;
}

export interface ProgramData {
  id: string;
  name: string;
  nameEn: string;
  university: string;
  universityEn: string;
  degree: string;
  degreeEn: string;
  duration: string;
  durationEn: string;
  language: string;
  languageEn: string;
  tuition: string;
  tuitionEn: string;
  description: string;
  descriptionEn: string;
  specializations: string[];
  specializationsEn: string[];
  careers: string[];
  careersEn: string[];
  category: string;
  categoryEn: string;
}

export interface ExchangeProgramData {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  country: string;
  countryEn: string;
  partnerUniversity: string;
  partnerUniversityEn: string;
  duration: string;
  durationEn: string;
  description: string;
  descriptionEn: string;
  benefits: string[];
  benefitsEn: string[];
  requirements: string[];
  requirementsEn: string[];
  deadline: string;
  deadlineEn: string;
  funding: string;
  fundingEn: string;
  flag: string;
}

// Cache management
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

function getFromCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const item: CacheItem<T> = JSON.parse(cached);
      if (Date.now() - item.timestamp < CACHE_DURATION) {
        return item.data;
      }
    }
  } catch (e) {
    console.error('Cache read error:', e);
  }
  return null;
}

function setToCache<T>(key: string, data: T): void {
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error('Cache write error:', e);
  }
}

// OpenAI API for detailed information
async function fetchFromAI(prompt: string, language: 'ru' | 'en' = 'ru'): Promise<string | null> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OpenAI API key not found in environment variables');
    console.error('Please add VITE_OPENAI_API_KEY to your .env file');
    return null;
  }

  console.log('🔄 Fetching data from OpenAI API...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: language === 'ru' 
              ? 'Ты эксперт по образованию в Казахстане. Предоставляй точную и актуальную информацию об университетах, программах и международном сотрудничестве. ВАЖНО: Отвечай ТОЛЬКО в формате JSON массива без markdown разметки, без ```json, без пояснений - только чистый JSON.'
              : 'You are an expert on education in Kazakhstan. Provide accurate and up-to-date information about universities, programs, and international cooperation. IMPORTANT: Respond ONLY in JSON array format without markdown, without ```json, without explanations - only pure JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Response Error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      console.log('✅ Data received from API');
      return content;
    }
    
    console.error('❌ Empty response from API');
    return null;
  } catch (e) {
    console.error('❌ OpenAI API error:', e);
    return null;
  }
}

// Fetch universities list
export async function fetchUniversities(language: 'ru' | 'en' = 'ru'): Promise<UniversityData[]> {
  const cacheKey = `universities_${language}`;
  const cached = getFromCache<UniversityData[]>(cacheKey);
  if (cached) return cached;

  const prompt = language === 'ru' 
    ? `Предоставь информацию о 9 главных университетах Казахстана в формате JSON массива:
[{
  "id": "уникальный_id",
  "name": "Название на русском",
  "nameEn": "Name in English",
  "city": "Город на русском",
  "cityEn": "City in English",
  "type": "Тип вуза (Национальный/Технический/Частный/Медицинский/Педагогический)",
  "typeEn": "Type in English",
  "founded": год_основания_число,
  "rector": "ФИО ректора",
  "rectorEn": "Rector name in English",
  "students": "Примерное количество студентов",
  "description": "Краткое описание университета 2-3 предложения",
  "descriptionEn": "Description in English",
  "mission": "Миссия университета",
  "missionEn": "Mission in English",
  "achievements": ["Достижение 1", "Достижение 2", "Достижение 3"],
  "achievementsEn": ["Achievement 1", "Achievement 2", "Achievement 3"],
  "website": "официальный сайт",
  "rating": рейтинг_от_7_до_10
}]
Включи: Назарбаев Университет, КазНУ им. аль-Фараби, КБТУ, КазНТУ им. Сатпаева, ЕНУ им. Гумилёва, КИМЭП, МУИТ, SDU, КазНМУ.`
    : `Provide information about 9 main universities of Kazakhstan in JSON array format:
[{
  "id": "unique_id",
  "name": "Name in Russian",
  "nameEn": "Name in English",
  "city": "City in Russian",
  "cityEn": "City in English",
  "type": "Type in Russian",
  "typeEn": "Type (National/Technical/Private/Medical/Pedagogical)",
  "founded": year_number,
  "rector": "Rector name in Russian",
  "rectorEn": "Rector name in English",
  "students": "Approximate number of students",
  "description": "Brief description in Russian",
  "descriptionEn": "Brief description 2-3 sentences in English",
  "mission": "Mission in Russian",
  "missionEn": "University mission in English",
  "achievements": ["Achievement 1 RU", "Achievement 2 RU", "Achievement 3 RU"],
  "achievementsEn": ["Achievement 1", "Achievement 2", "Achievement 3"],
  "website": "official website",
  "rating": rating_from_7_to_10
}]
Include: Nazarbayev University, Al-Farabi KazNU, KBTU, Satbayev University, ENU, KIMEP, IITU, SDU, KazNMU.`;

  const aiResponse = await fetchFromAI(prompt, language);
  
  if (aiResponse) {
    try {
      // Clean response from markdown if present
      let cleanResponse = aiResponse.trim();
      
      // Remove markdown code blocks
      cleanResponse = cleanResponse.replace(/```json\s*/gi, '');
      cleanResponse = cleanResponse.replace(/```\s*/g, '');
      cleanResponse = cleanResponse.trim();
      
      // Find JSON array in response
      const jsonStart = cleanResponse.indexOf('[');
      const jsonEnd = cleanResponse.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      console.log('📝 Parsing universities JSON...');
      const universities: UniversityData[] = JSON.parse(cleanResponse);
      
      // Local university images from public/images folder
      const universityImages: Record<string, string> = {
        // Nazarbayev University
        'nazarbayev': '/images/NU_Building.JPG',
        'nu': '/images/NU_Building.JPG',
        
        // Al-Farabi KazNU
        'казну': '/images/Al-Farabi_KazNU_rektorat.jpg',
        'farabi': '/images/Al-Farabi_KazNU_rektorat.jpg',
        'фараби': '/images/Al-Farabi_KazNU_rektorat.jpg',
        
        // KBTU
        'кбту': '/images/kbtu_front_build.jpg',
        'kbtu': '/images/kbtu_front_build.jpg',
        'british': '/images/kbtu_front_build.jpg',
        
        // Satbayev University (KazNTU)
        'сатпаев': '/images/Satpaev_Kazakh_National_Technical_University_in_Almaty.jpeg',
        'satbayev': '/images/Satpaev_Kazakh_National_Technical_University_in_Almaty.jpeg',
        'казнту': '/images/Satpaev_Kazakh_National_Technical_University_in_Almaty.jpeg',
        
        // ENU (L.N. Gumilyov Eurasian National University)
        'гумилёв': '/images/L.N.Gumilyov_Eurasian_National_University.jpeg',
        'gumilyov': '/images/L.N.Gumilyov_Eurasian_National_University.jpeg',
        'гумилев': '/images/L.N.Gumilyov_Eurasian_National_University.jpeg',
        'ену': '/images/L.N.Gumilyov_Eurasian_National_University.jpeg',
        'enu': '/images/L.N.Gumilyov_Eurasian_National_University.jpeg',
        'eurasian': '/images/L.N.Gumilyov_Eurasian_National_University.jpeg',
      };
      
      // Fallback images for universities without local photos
      const fallbackImages = [
        'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
        'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      ];
      
      universities.forEach((uni, idx) => {
        const nameLower = (uni.name + ' ' + uni.nameEn).toLowerCase();
        let matchedImage: string | null = null;
        
        // Try to match by university name
        for (const [key, imageUrl] of Object.entries(universityImages)) {
          if (nameLower.includes(key.toLowerCase())) {
            matchedImage = imageUrl;
            break;
          }
        }
        
        // Use matched local image or fallback
        uni.image = matchedImage || fallbackImages[idx % fallbackImages.length];
      });
      
      console.log(`✅ Loaded ${universities.length} universities`);
      setToCache(cacheKey, universities);
      return universities;
    } catch (e) {
      console.error('❌ Failed to parse universities response:', e);
      console.error('Raw response:', aiResponse.substring(0, 500));
    }
  }
  
  return [];
}

// Fetch academic programs
export async function fetchAcademicPrograms(language: 'ru' | 'en' = 'ru'): Promise<ProgramData[]> {
  const cacheKey = `programs_${language}`;
  const cached = getFromCache<ProgramData[]>(cacheKey);
  if (cached) return cached;

  const prompt = language === 'ru'
    ? `Предоставь информацию о 10 популярных образовательных программах в университетах Казахстана в формате JSON массива:
[{
  "id": "уникальный_id",
  "name": "Название программы на русском",
  "nameEn": "Program name in English",
  "university": "Университет на русском",
  "universityEn": "University in English",
  "degree": "Бакалавриат/Магистратура/Докторантура",
  "degreeEn": "Bachelor/Master/PhD",
  "duration": "X года",
  "durationEn": "X years",
  "language": "Язык обучения",
  "languageEn": "Language of instruction",
  "tuition": "Стоимость в тенге/год",
  "tuitionEn": "Cost in USD/year",
  "description": "Описание программы",
  "descriptionEn": "Program description",
  "specializations": ["Специализация 1", "Специализация 2", "Специализация 3"],
  "specializationsEn": ["Specialization 1", "Specialization 2", "Specialization 3"],
  "careers": ["Карьера 1", "Карьера 2", "Карьера 3"],
  "careersEn": ["Career 1", "Career 2", "Career 3"],
  "category": "Категория (IT и технологии/Медицина/Бизнес и экономика/Инженерия/Гуманитарные науки/Естественные науки/Право)",
  "categoryEn": "Category in English"
}]
Включи: Computer Science, Data Science, Медицина, MBA, Нефтегазовое дело, Право, Международные отношения, Инженерия, Финансы, Биология. Разные университеты.`
    : `Provide information about 10 popular educational programs at Kazakhstan universities in JSON array format:
[{
  "id": "unique_id",
  "name": "Program name in Russian",
  "nameEn": "Program name in English",
  "university": "University in Russian",
  "universityEn": "University in English",
  "degree": "Bachelor/Master/PhD in Russian",
  "degreeEn": "Bachelor/Master/PhD",
  "duration": "X years in Russian",
  "durationEn": "X years",
  "language": "Language in Russian",
  "languageEn": "Language of instruction",
  "tuition": "Cost in KZT/year",
  "tuitionEn": "Cost in USD/year",
  "description": "Description in Russian",
  "descriptionEn": "Program description in English",
  "specializations": ["Spec 1 RU", "Spec 2 RU", "Spec 3 RU"],
  "specializationsEn": ["Specialization 1", "Specialization 2", "Specialization 3"],
  "careers": ["Career 1 RU", "Career 2 RU", "Career 3 RU"],
  "careersEn": ["Career 1", "Career 2", "Career 3"],
  "category": "Category in Russian",
  "categoryEn": "Category (IT & Technology/Medicine/Business & Economics/Engineering/Humanities/Natural Sciences/Law)"
}]
Include: Computer Science, Data Science, Medicine, MBA, Oil & Gas, Law, International Relations, Engineering, Finance, Biology. Different universities.`;

  const aiResponse = await fetchFromAI(prompt, language);
  
  if (aiResponse) {
    try {
      let cleanResponse = aiResponse.trim();
      cleanResponse = cleanResponse.replace(/```json\s*/gi, '');
      cleanResponse = cleanResponse.replace(/```\s*/g, '');
      cleanResponse = cleanResponse.trim();
      
      const jsonStart = cleanResponse.indexOf('[');
      const jsonEnd = cleanResponse.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      console.log('📝 Parsing programs JSON...');
      const programs: ProgramData[] = JSON.parse(cleanResponse);
      console.log(`✅ Loaded ${programs.length} programs`);
      setToCache(cacheKey, programs);
      return programs;
    } catch (e) {
      console.error('❌ Failed to parse programs response:', e);
      console.error('Raw response:', aiResponse.substring(0, 500));
    }
  }
  
  return [];
}

// Fetch exchange programs
export async function fetchExchangePrograms(language: 'ru' | 'en' = 'ru'): Promise<ExchangeProgramData[]> {
  const cacheKey = `exchange_${language}`;
  const cached = getFromCache<ExchangeProgramData[]>(cacheKey);
  if (cached) return cached;

  const prompt = language === 'ru'
    ? `Предоставь информацию о 8 реальных программах международного обмена для студентов Казахстана в формате JSON массива:
[{
  "id": "уникальный_id",
  "name": "Название программы на русском",
  "nameEn": "Program name in English",
  "type": "Тип (Обмен/Стажировка/Магистратура/Докторантура/Летняя школа)",
  "typeEn": "Type (Exchange/Internship/Master's/PhD/Summer School)",
  "country": "Страна на русском",
  "countryEn": "Country in English",
  "partnerUniversity": "Партнёрский университет на русском",
  "partnerUniversityEn": "Partner university in English",
  "duration": "Длительность на русском",
  "durationEn": "Duration in English",
  "description": "Описание программы",
  "descriptionEn": "Program description",
  "benefits": ["Преимущество 1", "Преимущество 2", "Преимущество 3"],
  "benefitsEn": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "requirements": ["Требование 1", "Требование 2", "Требование 3"],
  "requirementsEn": ["Requirement 1", "Requirement 2", "Requirement 3"],
  "deadline": "Дедлайн подачи",
  "deadlineEn": "Application deadline",
  "funding": "Полное/Частичное",
  "fundingEn": "Full/Partial",
  "flag": "эмодзи флага страны"
}]
Включи: Erasmus+, DAAD, Fulbright, Bolashak, MEXT (Япония), Korean Government Scholarship, Chevening, Türkiye Burslari.`
    : `Provide information about 8 real international exchange programs for Kazakhstan students in JSON array format:
[{
  "id": "unique_id",
  "name": "Program name in Russian",
  "nameEn": "Program name in English",
  "type": "Type in Russian",
  "typeEn": "Type (Exchange/Internship/Master's/PhD/Summer School)",
  "country": "Country in Russian",
  "countryEn": "Country in English",
  "partnerUniversity": "Partner in Russian",
  "partnerUniversityEn": "Partner university in English",
  "duration": "Duration in Russian",
  "durationEn": "Duration in English",
  "description": "Description in Russian",
  "descriptionEn": "Program description in English",
  "benefits": ["Benefit 1 RU", "Benefit 2 RU", "Benefit 3 RU"],
  "benefitsEn": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "requirements": ["Req 1 RU", "Req 2 RU", "Req 3 RU"],
  "requirementsEn": ["Requirement 1", "Requirement 2", "Requirement 3"],
  "deadline": "Deadline in Russian",
  "deadlineEn": "Application deadline",
  "funding": "Full/Partial in Russian",
  "fundingEn": "Full/Partial",
  "flag": "country flag emoji"
}]
Include: Erasmus+, DAAD, Fulbright, Bolashak, MEXT (Japan), Korean Government Scholarship, Chevening, Türkiye Burslari.`;

  const aiResponse = await fetchFromAI(prompt, language);
  
  if (aiResponse) {
    try {
      let cleanResponse = aiResponse.trim();
      cleanResponse = cleanResponse.replace(/```json\s*/gi, '');
      cleanResponse = cleanResponse.replace(/```\s*/g, '');
      cleanResponse = cleanResponse.trim();
      
      const jsonStart = cleanResponse.indexOf('[');
      const jsonEnd = cleanResponse.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      console.log('📝 Parsing exchange programs JSON...');
      const programs: ExchangeProgramData[] = JSON.parse(cleanResponse);
      console.log(`✅ Loaded ${programs.length} exchange programs`);
      setToCache(cacheKey, programs);
      return programs;
    } catch (e) {
      console.error('❌ Failed to parse exchange programs response:', e);
      console.error('Raw response:', aiResponse.substring(0, 500));
    }
  }
  
  return [];
}

// Search university by name
export async function searchUniversity(query: string, language: 'ru' | 'en' = 'ru'): Promise<UniversityData | null> {
  const prompt = language === 'ru'
    ? `Найди информацию об университете "${query}" в Казахстане и верни в формате JSON:
{
  "id": "уникальный_id",
  "name": "Полное название на русском",
  "nameEn": "Full name in English",
  "city": "Город",
  "cityEn": "City",
  "type": "Тип вуза",
  "typeEn": "Type",
  "founded": год,
  "rector": "ФИО ректора",
  "rectorEn": "Rector name",
  "students": "Количество студентов",
  "description": "Описание",
  "descriptionEn": "Description",
  "mission": "Миссия",
  "missionEn": "Mission",
  "achievements": ["Достижение 1", "Достижение 2", "Достижение 3"],
  "achievementsEn": ["Achievement 1", "Achievement 2", "Achievement 3"],
  "website": "сайт",
  "rating": рейтинг
}
Если университет не найден, верни null.`
    : `Find information about "${query}" university in Kazakhstan and return in JSON format:
{
  "id": "unique_id",
  "name": "Full name in Russian",
  "nameEn": "Full name in English",
  "city": "City in Russian",
  "cityEn": "City",
  "type": "Type in Russian",
  "typeEn": "Type",
  "founded": year,
  "rector": "Rector in Russian",
  "rectorEn": "Rector name",
  "students": "Number of students",
  "description": "Description in Russian",
  "descriptionEn": "Description",
  "mission": "Mission in Russian",
  "missionEn": "Mission",
  "achievements": ["Achievement 1 RU", "Achievement 2 RU", "Achievement 3 RU"],
  "achievementsEn": ["Achievement 1", "Achievement 2", "Achievement 3"],
  "website": "website",
  "rating": rating
}
If university not found, return null.`;

  const aiResponse = await fetchFromAI(prompt, language);
  
  if (aiResponse && aiResponse !== 'null') {
    try {
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```json?\n?/g, '').replace(/```$/g, '');
      }
      
      const university: UniversityData = JSON.parse(cleanResponse);
      university.image = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800';
      return university;
    } catch (e) {
      console.error('Failed to parse search response:', e);
    }
  }
  
  return null;
}

// Clear cache (useful for forcing refresh)
export function clearCache(): void {
  const keys = ['universities_ru', 'universities_en', 'programs_ru', 'programs_en', 'exchange_ru', 'exchange_en'];
  keys.forEach(key => localStorage.removeItem(key));
}

// Check if data is cached
export function isCached(type: 'universities' | 'programs' | 'exchange', language: 'ru' | 'en'): boolean {
  const key = `${type}_${language}`;
  return getFromCache(key) !== null;
}

