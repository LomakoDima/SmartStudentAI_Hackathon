import { useState } from 'react';
import { Play, Pause, Maximize2, Minimize2, RotateCw, MapPin, Building2, GraduationCap, BookOpen, Users, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n';

interface Tour {
  id: string;
  university: string;
  city: string;
  location: string;
  thumbnail: string;
  description: string;
  duration: string;
  hotspots: Hotspot[];
}

interface Hotspot {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  image: string;
}

const tours: Tour[] = [
  {
    id: 'nu-main',
    university: 'Назарбаев Университет',
    city: 'Астана',
    location: 'Главный корпус',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    description: 'Виртуальный тур по главному корпусу Назарбаев Университета. Исследуйте современные аудитории, библиотеку и исследовательские центры.',
    duration: '15 мин',
    hotspots: [
      { id: '1', name: 'Главный вход', description: 'Входная группа с информационным центром', position: { x: 30, y: 40 }, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400' },
      { id: '2', name: 'Библиотека', description: 'Современная библиотека с читальными залами', position: { x: 60, y: 25 }, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' },
      { id: '3', name: 'Исследовательский центр', description: 'Лаборатории и научные центры', position: { x: 45, y: 70 }, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400' },
      { id: '4', name: 'Аудитории', description: 'Современные лекционные залы', position: { x: 75, y: 50 }, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400' }
    ]
  },
  {
    id: 'kaznu-main',
    university: 'КазНУ им. аль-Фараби',
    city: 'Алматы',
    location: 'Главный корпус',
    thumbnail: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    description: 'Погрузитесь в атмосферу одного из старейших и крупнейших университетов Казахстана. Исследуйте исторические здания и современные кампусы.',
    duration: '20 мин',
    hotspots: [
      { id: '1', name: 'Главное здание', description: 'Историческое здание университета', position: { x: 40, y: 35 }, image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400' },
      { id: '2', name: 'Библиотека аль-Фараби', description: 'Крупнейшая библиотека университета', position: { x: 65, y: 45 }, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { id: '3', name: 'Спортивный комплекс', description: 'Современные спортивные залы', position: { x: 25, y: 60 }, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' }
    ]
  },
  {
    id: 'kbtu-campus',
    university: 'КБТУ',
    city: 'Алматы',
    location: 'Кампус',
    thumbnail: 'https://images.unsplash.com/photo-1571260899304-425eee4c6efc?w=800',
    description: 'Современный технический университет с передовыми лабораториями и инновационными пространствами для обучения.',
    duration: '12 мин',
    hotspots: [
      { id: '1', name: 'Технические лаборатории', description: 'Современное оборудование для исследований', position: { x: 50, y: 40 }, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400' },
      { id: '2', name: 'Инновационный центр', description: 'Центр технологических инноваций', position: { x: 70, y: 55 }, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400' }
    ]
  },
  {
    id: 'kazntu-main',
    university: 'КазНТУ им. Сатпаева',
    city: 'Алматы',
    location: 'Главный корпус',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    description: 'Виртуальный тур по техническому университету с богатой историей и современной инфраструктурой.',
    duration: '18 мин',
    hotspots: [
      { id: '1', name: 'Горный музей', description: 'Уникальная коллекция минералов', position: { x: 35, y: 50 }, image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400' },
      { id: '2', name: 'Инженерные лаборатории', description: 'Лаборатории для практических занятий', position: { x: 60, y: 30 }, image: 'https://images.unsplash.com/photo-1581092160565-68a5b35a5593?w=400' }
    ]
  },
  {
    id: 'enu-campus',
    university: 'ЕНУ им. Л.Н. Гумилёва',
    city: 'Астана',
    location: 'Кампус',
    thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    description: 'Исследуйте кампус Евразийского национального университета - одного из ведущих вузов столицы.',
    duration: '16 мин',
    hotspots: [
      { id: '1', name: 'Главный корпус', description: 'Центральное здание университета', position: { x: 45, y: 40 }, image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400' },
      { id: '2', name: 'Студенческий городок', description: 'Общежития и студенческие пространства', position: { x: 30, y: 65 }, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400' }
    ]
  }
];

function CampusTour3D() {
  const { t, language } = useLanguage();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentHotspot, setCurrentHotspot] = useState<Hotspot | null>(null);
  const [viewerRotation, setViewerRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [showLocationsPanel, setShowLocationsPanel] = useState(false);

  // Переводы университетов
  const universityNames: Record<string, string> = {
    'Назарбаев Университет': language === 'en' ? 'Nazarbayev University' : 'Назарбаев Университет',
    'КазНУ им. аль-Фараби': language === 'en' ? 'Al-Farabi Kazakh National University' : 'КазНУ им. аль-Фараби',
    'КБТУ': language === 'en' ? 'Kazakh-British Technical University' : 'КБТУ',
    'КазНТУ им. Сатпаева': language === 'en' ? 'Satbayev University' : 'КазНТУ им. Сатпаева',
    'ЕНУ им. Л.Н. Гумилёва': language === 'en' ? 'L.N. Gumilyov Eurasian National University' : 'ЕНУ им. Л.Н. Гумилёва',
  };

  // Переводы городов
  const cityNames: Record<string, string> = {
    'Астана': language === 'en' ? 'Astana' : 'Астана',
    'Алматы': language === 'en' ? 'Almaty' : 'Алматы',
  };

  // Переводы локаций
  const locationNames: Record<string, string> = {
    'Главный корпус': t.tour3d.locations.mainBuilding,
    'Кампус': t.tour3d.locations.campus,
    'Главный вход': t.tour3d.locations.mainEntrance,
    'Библиотека': t.tour3d.locations.library,
    'Исследовательский центр': t.tour3d.locations.researchCenter,
    'Аудитории': t.tour3d.locations.classrooms,
    'Библиотека аль-Фараби': t.tour3d.locations.alFarabiLibrary,
    'Главное здание': language === 'en' ? 'Main Building' : 'Главное здание',
    'Спортивный комплекс': t.tour3d.locations.sportsComplex,
    'Технические лаборатории': t.tour3d.locations.techLabs,
    'Инновационный центр': t.tour3d.locations.innovationCenter,
    'Горный музей': t.tour3d.locations.miningMuseum,
    'Инженерные лаборатории': t.tour3d.locations.engineeringLabs,
    'Студенческий городок': t.tour3d.locations.studentTown,
  };

  // Переводы описаний
  const descriptionTranslations: Record<string, string> = {
    'Виртуальный тур по главному корпусу Назарбаев Университета. Исследуйте современные аудитории, библиотеку и исследовательские центры.': 
      language === 'en' ? 'Virtual tour of Nazarbayev University main building. Explore modern classrooms, library, and research centers.' : 'Виртуальный тур по главному корпусу Назарбаев Университета. Исследуйте современные аудитории, библиотеку и исследовательские центры.',
    'Погрузитесь в атмосферу одного из старейших и крупнейших университетов Казахстана. Исследуйте исторические здания и современные кампусы.':
      language === 'en' ? 'Immerse yourself in the atmosphere of one of the oldest and largest universities in Kazakhstan. Explore historic buildings and modern campuses.' : 'Погрузитесь в атмосферу одного из старейших и крупнейших университетов Казахстана. Исследуйте исторические здания и современные кампусы.',
    'Современный технический университет с передовыми лабораториями и инновационными пространствами для обучения.':
      language === 'en' ? 'A modern technical university with advanced laboratories and innovative learning spaces.' : 'Современный технический университет с передовыми лабораториями и инновационными пространствами для обучения.',
    'Виртуальный тур по техническому университету с богатой историей и современной инфраструктурой.':
      language === 'en' ? 'Virtual tour of a technical university with rich history and modern infrastructure.' : 'Виртуальный тур по техническому университету с богатой историей и современной инфраструктурой.',
    'Исследуйте кампус Евразийского национального университета - одного из ведущих вузов столицы.':
      language === 'en' ? 'Explore the campus of Eurasian National University - one of the leading universities of the capital.' : 'Исследуйте кампус Евразийского национального университета - одного из ведущих вузов столицы.',
  };

  // Переводы описаний хотспотов
  const hotspotDescriptions: Record<string, string> = {
    'Входная группа с информационным центром': language === 'en' ? 'Entrance with information center' : 'Входная группа с информационным центром',
    'Современная библиотека с читальными залами': language === 'en' ? 'Modern library with reading rooms' : 'Современная библиотека с читальными залами',
    'Лаборатории и научные центры': language === 'en' ? 'Laboratories and research centers' : 'Лаборатории и научные центры',
    'Современные лекционные залы': language === 'en' ? 'Modern lecture halls' : 'Современные лекционные залы',
    'Историческое здание университета': language === 'en' ? 'Historic university building' : 'Историческое здание университета',
    'Крупнейшая библиотека университета': language === 'en' ? 'Largest university library' : 'Крупнейшая библиотека университета',
    'Современные спортивные залы': language === 'en' ? 'Modern sports facilities' : 'Современные спортивные залы',
    'Современное оборудование для исследований': language === 'en' ? 'Modern research equipment' : 'Современное оборудование для исследований',
    'Центр технологических инноваций': language === 'en' ? 'Technology innovation center' : 'Центр технологических инноваций',
    'Уникальная коллекция минералов': language === 'en' ? 'Unique mineral collection' : 'Уникальная коллекция минералов',
    'Лаборатории для практических занятий': language === 'en' ? 'Laboratories for practical classes' : 'Лаборатории для практических занятий',
    'Центральное здание университета': language === 'en' ? 'Central university building' : 'Центральное здание университета',
    'Общежития и студенческие пространства': language === 'en' ? 'Dormitories and student spaces' : 'Общежития и студенческие пространства',
  };

  const getUniversityName = (name: string) => universityNames[name] || name;
  const getCityName = (city: string) => cityNames[city] || city;
  const getLocationName = (location: string) => locationNames[location] || location;
  const getDescription = (desc: string) => descriptionTranslations[desc] || desc;
  const getHotspotDescription = (desc: string) => hotspotDescriptions[desc] || desc;
  const getDuration = (duration: string) => {
    const num = duration.replace(/[^0-9]/g, '');
    return `${num} ${t.tour3d.duration}`;
  };

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour);
    if (tour.hotspots.length > 0) {
      setCurrentHotspot(tour.hotspots[0]);
      setCurrentLocationIndex(0);
    } else {
      setCurrentHotspot(null);
      setCurrentLocationIndex(0);
    }
    setIsPlaying(true);
    setViewerRotation(0);
  };

  const switchToHotspot = (hotspot: Hotspot) => {
    setCurrentHotspot(hotspot);
    setViewerRotation(0);
  };

  const nextLocation = () => {
    if (selectedTour) {
      const nextIndex = (currentLocationIndex + 1) % selectedTour.hotspots.length;
      setCurrentLocationIndex(nextIndex);
      switchToHotspot(selectedTour.hotspots[nextIndex]);
    }
  };

  const prevLocation = () => {
    if (selectedTour) {
      const prevIndex = currentLocationIndex === 0 ? selectedTour.hotspots.length - 1 : currentLocationIndex - 1;
      setCurrentLocationIndex(prevIndex);
      switchToHotspot(selectedTour.hotspots[prevIndex]);
    }
  };

  const handleCloseTour = () => {
    setSelectedTour(null);
    setIsPlaying(false);
    setCurrentHotspot(null);
    setIsFullscreen(false);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    setCurrentHotspot(hotspot);
  };

  const handleRotate = (direction: 'left' | 'right') => {
    setViewerRotation(prev => prev + (direction === 'left' ? -15 : 15));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      setViewerRotation(prev => prev + deltaX * 0.5);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - dragStart.x;
      setViewerRotation(prev => prev + deltaX * 0.5);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (selectedTour) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Viewer Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseTour}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{getUniversityName(selectedTour.university)}</h2>
                <p className="text-white/80 text-sm">{getLocationName(selectedTour.location)} • {getCityName(selectedTour.city)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={prevLocation}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title={t.tour3d.viewer.previousLocation}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextLocation}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title={t.tour3d.viewer.nextLocation}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* 360 Viewer */}
        <div 
          className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform"
            style={{
              backgroundImage: `url(${currentHotspot?.image || selectedTour.thumbnail})`,
              transform: `perspective(1000px) rotateY(${viewerRotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Hotspots */}
          {selectedTour.hotspots.map((hotspot, index) => (
            <button
              key={hotspot.id}
              onClick={() => {
                handleHotspotClick(hotspot);
                setCurrentLocationIndex(index);
              }}
              className={`absolute w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border-2 shadow-lg group ${
                currentHotspot?.id === hotspot.id
                  ? 'bg-blue-600 border-white scale-110'
                  : 'bg-blue-500/80 border-white/50'
              }`}
              style={{
                left: `${hotspot.position.x}%`,
                top: `${hotspot.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute bottom-full mb-2 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {getLocationName(hotspot.name)}
              </div>
            </button>
          ))}

          {/* Location Indicator */}
          {selectedTour.hotspots.length > 0 && currentHotspot && (
            <div className="absolute top-24 right-6 bg-white/20 backdrop-blur-md rounded-xl p-3 text-white text-sm z-10">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">{t.tour3d.viewer.location} {currentLocationIndex + 1} {t.tour3d.viewer.locationOf} {selectedTour.hotspots.length}</span>
              </div>
              <div className="text-xs opacity-80">{getLocationName(currentHotspot.name)}</div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                </button>
                <div className="flex-1 max-w-md">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <span className="text-white text-sm">{selectedTour.duration}</span>
              </div>

              {/* Hotspot Info */}
              {currentHotspot && (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 max-w-md mx-auto">
                  <h3 className="font-bold text-gray-800 mb-1">{getLocationName(currentHotspot.name)}</h3>
                  <p className="text-sm text-gray-600">{getHotspotDescription(currentHotspot.description)}</p>
                  <button
                    onClick={() => setCurrentHotspot(null)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {t.tour3d.viewer.close}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Instructions */}
          <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-white text-sm">
              <RotateCw className="w-5 h-5 mb-2" />
              <p>{t.tour3d.viewer.dragToRotate.split(' ').slice(0, 2).join(' ')}<br />{t.tour3d.viewer.dragToRotate.split(' ').slice(2).join(' ')}</p>
            </div>
          </div>

          {/* Locations Panel */}
          <button
            onClick={() => setShowLocationsPanel(!showLocationsPanel)}
            className="absolute bottom-24 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
            title={t.tour3d.viewer.locationsList}
          >
            <Building2 className="w-5 h-5 text-white" />
          </button>

          {showLocationsPanel && (
            <div className="absolute bottom-32 right-6 w-64 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl z-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">{t.tour3d.viewer.locations}</h3>
                <button
                  onClick={() => setShowLocationsPanel(false)}
                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedTour.hotspots.map((hotspot, index) => (
                  <button
                    key={hotspot.id}
                    onClick={() => {
                      switchToHotspot(hotspot);
                      setCurrentLocationIndex(index);
                      setShowLocationsPanel(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      currentLocationIndex === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="font-semibold text-sm">{getLocationName(hotspot.name)}</div>
                    <div className={`text-xs mt-1 ${currentLocationIndex === index ? 'text-white/80' : 'text-gray-600'}`}>
                      {getHotspotDescription(hotspot.description)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl mb-6 shadow-xl">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              {t.tour3d.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.tour3d.description}
            </p>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tours.map((tour) => (
            <div
              key={tour.id}
              onClick={() => handleTourSelect(tour)}
              className="group relative bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={tour.thumbnail}
                  alt={tour.university}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-gray-800 flex items-center gap-2">
                  <Play className="w-3 h-3" />
                  {getDuration(tour.duration)}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{getUniversityName(tour.university)}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{getCityName(tour.city)} • {getLocationName(tour.location)}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{getDescription(tour.description)}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{tour.hotspots.length} {t.tour3d.points}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    <span>{t.tour3d.view360}</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t.tour3d.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: RotateCw,
                title: t.tour3d.features.view360.title,
                description: t.tour3d.features.view360.description
              },
              {
                icon: MapPin,
                title: t.tour3d.features.interactive.title,
                description: t.tour3d.features.interactive.description
              },
              {
                icon: Maximize2,
                title: t.tour3d.features.fullscreen.title,
                description: t.tour3d.features.fullscreen.description
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
  );
}

export default CampusTour3D;

