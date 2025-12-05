import { useState, Fragment } from 'react';
import { Search, X, GitCompare } from 'lucide-react';

interface University {
  id: string;
  name: string;
  city: string;
  type: string;
  founded: number;
  students: string;
  programs: number;
  tuition: string;
  grants: string;
  rating: number;
  international: boolean;
  languages: string[];
}

const universities: University[] = [
  {
    id: '1',
    name: 'Назарбаев Университет',
    city: 'Астана',
    type: 'Национальный',
    founded: 2010,
    students: '5000+',
    programs: 45,
    tuition: 'От 2 500 000 ₸',
    grants: 'До 100%',
    rating: 9.8,
    international: true,
    languages: ['Казахский', 'Русский', 'Английский']
  },
  {
    id: '2',
    name: 'КазНУ им. аль-Фараби',
    city: 'Алматы',
    type: 'Национальный',
    founded: 1934,
    students: '20000+',
    programs: 180,
    tuition: 'От 800 000 ₸',
    grants: 'До 100%',
    rating: 9.2,
    international: true,
    languages: ['Казахский', 'Русский', 'Английский']
  },
  {
    id: '3',
    name: 'КБТУ',
    city: 'Алматы',
    type: 'Технический',
    founded: 1963,
    students: '8000+',
    programs: 65,
    tuition: 'От 1 200 000 ₸',
    grants: 'До 80%',
    rating: 8.9,
    international: true,
    languages: ['Казахский', 'Русский', 'Английский']
  },
  {
    id: '4',
    name: 'КазНТУ им. Сатпаева',
    city: 'Алматы',
    type: 'Технический',
    founded: 1934,
    students: '15000+',
    programs: 120,
    tuition: 'От 900 000 ₸',
    grants: 'До 90%',
    rating: 8.7,
    international: true,
    languages: ['Казахский', 'Русский']
  },
  {
    id: '5',
    name: 'КазУМОиМЯ им. Абылай хана',
    city: 'Алматы',
    type: 'Гуманитарный',
    founded: 1941,
    students: '12000+',
    programs: 85,
    tuition: 'От 700 000 ₸',
    grants: 'До 85%',
    rating: 8.5,
    international: true,
    languages: ['Казахский', 'Русский', 'Английский', 'Китайский']
  },
  {
    id: '6',
    name: 'ЕНУ им. Л.Н. Гумилёва',
    city: 'Астана',
    type: 'Национальный',
    founded: 1996,
    students: '18000+',
    programs: 95,
    tuition: 'От 850 000 ₸',
    grants: 'До 95%',
    rating: 8.6,
    international: true,
    languages: ['Казахский', 'Русский', 'Английский']
  }
];

function Compare() {
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUnis = universities.filter(uni => selectedUniversities.includes(uni.id));

  const addUniversity = (id: string) => {
    if (selectedUniversities.length < 4 && !selectedUniversities.includes(id)) {
      setSelectedUniversities([...selectedUniversities, id]);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const removeUniversity = (id: string) => {
    setSelectedUniversities(selectedUniversities.filter(uniId => uniId !== id));
  };

  const comparisonCategories = [
    {
      title: 'Общая информация',
      fields: [
        { label: 'Город', key: 'city' },
        { label: 'Тип', key: 'type' },
        { label: 'Год основания', key: 'founded' },
        { label: 'Количество студентов', key: 'students' },
        { label: 'Рейтинг', key: 'rating' }
      ]
    },
    {
      title: 'Образование',
      fields: [
        { label: 'Количество программ', key: 'programs' },
        { label: 'Языки обучения', key: 'languages' }
      ]
    },
    {
      title: 'Финансы',
      fields: [
        { label: 'Стоимость обучения', key: 'tuition' },
        { label: 'Гранты и стипендии', key: 'grants' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              Сравнение университетов
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Сравните до 4 университетов по ключевым параметрам
            </p>
          </div>
        </div>

        {/* Selected Universities */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {selectedUnis.map((uni) => (
              <div
                key={uni.id}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 min-w-[180px]"
              >
                <button
                  onClick={() => removeUniversity(uni.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{uni.name}</h3>
                  <p className="text-xs text-gray-500">{uni.city}</p>
                </div>
              </div>
            ))}

            {selectedUniversities.length < 4 && (
              <button
                onClick={() => setShowSearch(true)}
                className={`rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedUniversities.length === 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 min-w-[240px] shadow-lg hover:shadow-xl font-semibold text-base'
                    : 'bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 p-4 min-w-[180px]'
                }`}
              >
                <Search className={selectedUniversities.length === 0 ? 'w-5 h-5' : 'w-4 h-4 text-gray-400'} />
                <span className={selectedUniversities.length === 0 ? 'text-base font-semibold' : 'text-sm font-medium text-gray-700'}>
                  {selectedUniversities.length === 0 ? 'Добавить вуз' : 'Добавить'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Search Dropdown */}
        {showSearch && (
          <div className="mb-8 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск университета..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredUniversities
                .filter(uni => !selectedUniversities.includes(uni.id))
                .map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => addUniversity(uni.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900">{uni.name}</div>
                    <div className="text-sm text-gray-500">{uni.city}</div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedUniversities.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold sticky left-0 bg-gray-50 z-10 min-w-[220px]">
                      Параметр
                    </th>
                    {selectedUnis.map((uni) => (
                      <th key={uni.id} className="px-6 py-4 text-center text-gray-900 font-semibold min-w-[200px]">
                        <div className="text-sm leading-tight">{uni.name}</div>
                        <div className="text-xs font-normal text-gray-500 mt-1">{uni.city}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonCategories.map((category, catIndex) => (
                    <Fragment key={catIndex}>
                      <tr className="bg-gray-50">
                        <td colSpan={selectedUnis.length + 1} className="px-6 py-3 font-semibold text-gray-900 text-sm uppercase tracking-wide">
                          {category.title}
                        </td>
                      </tr>
                      {category.fields.map((field, fieldIndex) => (
                        <tr
                          key={fieldIndex}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 sticky left-0 bg-white z-10">
                            <span className="font-medium text-gray-700">{field.label}</span>
                          </td>
                          {selectedUnis.map((uni) => (
                            <td key={uni.id} className="px-6 py-4 text-center text-gray-900">
                              {field.key === 'languages' ? (
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                  {(uni[field.key as keyof University] as string[]).map((lang, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                    >
                                      {lang}
                                    </span>
                                  ))}
                                </div>
                              ) : field.key === 'rating' ? (
                                <span className="font-semibold">{uni[field.key as keyof University] as string | number}</span>
                              ) : (
                                <span>{uni[field.key as keyof University] as string | number}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Compare;

