import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'yourDirectoryUserData';
const IMAGE_BASE = "https://image.tmdb.org/t/p/w92"; // Pósters pequeños

export default function DiaryClient() {
  const [entries, setEntries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let loadedMovies = [];

    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.watchlist && parsed.watchlist.length > 0) {
        loadedMovies = parsed.watchlist;
      }
    }

    // DATOS DE EJEMPLO (Mock Data) con URLs REALES de TMDB
    if (loadedMovies.length === 0) {
        loadedMovies = [
            { 
                id: 101, 
                title: "Barbie as The Princess & the Pauper", 
                year: 2004, 
                rating: 0, 
                liked: true, 
                watchedDate: "2025-12-10", 
                poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Wsv_6gBBs1t61VRqaiAupX0_9JMUNmK6NA&s" // URL corregida
            },
            { 
                id: 102, 
                title: "The Matrix", 
                year: 1999, 
                rating: 4.5, 
                liked: true, 
                watchedDate: "2025-12-09", 
                poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" // URL correcta
            },
            { 
                id: 103, 
                title: "Dune: Part Two", // Cambiado por Dune para asegurar foto HD
                year: 2024, 
                rating: 5, 
                liked: true, 
                watchedDate: "2025-12-09", 
                poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" // URL correcta
            },
            { 
                id: 104, 
                title: "Barbie of Swan Lake", 
                year: 2003, 
                rating: 3, 
                liked: false, 
                watchedDate: "2025-12-07", 
                poster_path: "https://pics.filmaffinity.com/barbie_of_swan_lake-741273957-large.jpg" // URL corregida
            },
            { 
                id: 105, 
                title: "Wicked", 
                year: 2024, 
                rating: 2.5, 
                liked: false, 
                watchedDate: "2025-11-20", 
                poster_path: "https://m.media-amazon.com/images/I/913cbI9-KrL._AC_UF894,1000_QL80_.jpg" // URL corregida
            },
            { 
                id: 106, 
                title: "Some Like It Hot", 
                year: 1959, 
                rating: 5, 
                liked: true, 
                watchedDate: "2025-11-08", 
                poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzL_yRIMXf9I-eVG940JgAKqnRPHPM6tzICA&s" // URL correcta
            },
        ];
    }
    
    setEntries(loadedMovies.sort((a, b) => new Date(b.watchedDate) - new Date(a.watchedDate)));
    setIsLoaded(true);
  }, []);

  // Función para renderizar estrellas (VERDE INTACTO #00E054)
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
        stars.push(<span key={i} className="text-[#00E054] text-lg">★</span>);
    }
    if (rating % 1 !== 0) stars.push(<span key="half" className="text-[#00E054] text-lg">½</span>);
    return stars;
  };

  let lastMonth = "";

  if (!isLoaded) return <div className="text-center text-gray-500 py-10">Cargando diario...</div>;

  return (
    <div className="w-full text-left font-sans">
      
      {/* Encabezado */}
      <div className="grid grid-cols-12 gap-4 text-xs tracking-wider text-gray-500 border-b border-gray-800 pb-2 mb-4 uppercase">
        <div className="col-span-2 md:col-span-1 text-center">Month</div>
        <div className="col-span-1 text-center">Day</div>
        <div className="col-span-6 md:col-span-7">Film</div>
        <div className="col-span-1 text-right">Released</div>
        <div className="col-span-1 text-center">Rating</div>
        <div className="col-span-1 text-center">Like</div>
      </div>

      <div className="flex flex-col space-y-0">
        {entries.map((movie, index) => {
            const date = new Date(movie.watchedDate);
            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const currentMonth = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            const day = date.getDate().toString().padStart(2, '0');
            
            const showMonthBlock = currentMonth !== lastMonth;
            if (showMonthBlock) lastMonth = currentMonth;

            return (
                <div key={movie.id} className="group grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    
                    {/* 1. Columna MES: TURQUESA (#92f6df) */}
                    <div className="col-span-2 md:col-span-1 flex justify-center">
                        {showMonthBlock && (
                            <div className="bg-[#2c3440] rounded-md p-1 w-12 text-center shadow-inner border border-gray-700">
                                <div className="text-[10px] text-[#92f6df] uppercase tracking-tighter leading-none font-bold">
                                    {monthNames[date.getMonth()]}
                                </div>
                                <div className="text-xs text-gray-300 font-bold leading-none mt-0.5">{date.getFullYear()}</div>
                            </div>
                        )}
                    </div>

                    {/* 2. Columna DÍA */}
                    <div className="col-span-1 text-center text-xl text-gray-400 font-light font-mono">
                        {day}
                    </div>

                    {/* 3. Columna PELÍCULA */}
                    <div className="col-span-6 md:col-span-7 flex items-center space-x-4">
                        {/* Hover de borde: Verde */}
                        <div className="shrink-0 w-9 h-14 bg-gray-700 rounded overflow-hidden shadow-sm border border-gray-700 group-hover:border-[#00E054] transition-colors">
                             {movie.poster_path ? (
                                <img src={movie.poster_path.startsWith('http') ? movie.poster_path : `${IMAGE_BASE}${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">NO IMG</div>
                             )}
                        </div>
                        {/* Hover de título: Verde */}
                        <h3 className="text-white font-bold text-base md:text-lg truncate tracking-tight group-hover:text-[#00E054] transition-colors cursor-pointer">
                            {movie.title}
                        </h3>
                    </div>

                    {/* 4. Columna AÑO */}
                    <div className="col-span-1 text-right text-sm text-gray-500">
                        {movie.year}
                    </div>

                    {/* 5. Columna RATING (Verde) */}
                    <div className="col-span-1 flex justify-center items-center space-x-0.5 min-w-[60px]">
                        {renderStars(movie.rating)}
                    </div>

                    {/* 6. Columna LIKE: LILA (#ba87d0) */}
                    <div className="col-span-1 flex justify-center">
                        {movie.liked && (
                            <svg className="w-5 h-5 text-[#ba87d0] fill-current" viewBox="0 0 20 20">
                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                        )}
                    </div>

                </div>
            );
        })}
      </div>
    </div>
  );
}