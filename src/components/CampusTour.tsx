import { Play, Move3d, Maximize2 } from 'lucide-react';

function CampusTour() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
            3D-тур по кампусам
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Исследуйте университеты изнутри, не выходя из дома
          </p>
        </div>

        <div className="relative group">
          <div className="relative h-[600px] bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-70"></div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button className="group/play w-32 h-32 bg-white/20 backdrop-blur-xl border-4 border-white/50 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 shadow-2xl">
                <Play className="w-12 h-12 text-white ml-2 group-hover/play:scale-125 transition-transform duration-300" fill="white" />
              </button>
            </div>

            <div className="absolute top-8 left-8 flex gap-3">
              <div className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full text-white font-semibold shadow-lg flex items-center gap-2">
                <Move3d className="w-5 h-5" />
                360° View
              </div>
              <div className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full text-white font-semibold shadow-lg flex items-center gap-2">
                <Maximize2 className="w-5 h-5" />
                Full HD
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-3xl font-bold text-white mb-3">Назарбаев Университет</h3>
              <p className="text-white/80 text-lg mb-6">Главный корпус, библиотека, аудитории и студенческие пространства</p>

              <a
                href="#tour"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Посмотреть
                <Play className="w-5 h-5" />
              </a>
            </div>

            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="w-3 h-3 bg-white/50 hover:bg-white rounded-full transition-all duration-300 hover:scale-150 shadow-lg"
                ></button>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-300"></div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'КазНУ им. аль-Фараби', location: 'Алматы' },
            { title: 'КБТУ', location: 'Алматы' },
            { title: 'КазНТУ им. Сатпаева', location: 'Алматы' }
          ].map((uni, i) => (
            <a
              key={i}
              href="#tour"
              className="p-6 bg-white/40 backdrop-blur-lg border border-white/60 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 block"
            >
              <div className="h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl mb-4 flex items-center justify-center">
                <Move3d className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{uni.title}</h4>
              <p className="text-gray-600">{uni.location}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CampusTour;
