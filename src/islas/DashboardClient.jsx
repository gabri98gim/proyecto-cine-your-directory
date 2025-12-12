import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STORAGE_KEY = 'yourDirectoryUserData';

// TUS COLORES PERSONALIZADOS
const COLORS = {
    GREEN: '#00E054',   // Para puntuación
    TURQUOISE: '#92f6df', // Para horas vistas
    PURPLE: '#ba87d0',    // Para géneros
    BG_DARK: '#1B2228'    // Color de fondo de las tarjetas
};

export default function DashboardClient() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // 1. Cargar datos de localStorage
        const savedData = localStorage.getItem(STORAGE_KEY);
        let loadedMovies = [];

        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.watchlist && parsed.watchlist.length > 0) {
                loadedMovies = parsed.watchlist;
            }
        }

        // 2. MOCK DATA ENRIQUECIDO (Si está vacío, usamos esto para probar)
        // Necesitamos añadir 'runtime' (minutos) y 'genres' para las estadísticas
        if (loadedMovies.length === 0 || !loadedMovies[0].genres) {
            loadedMovies = [
                { id: 101, title: "Barbie", rating: 4, runtime: 114, genres: ["Comedy", "Fantasy"], watchedDate: "2025-12-10" },
                { id: 102, title: "The Matrix", rating: 5, runtime: 136, genres: ["Sci-Fi", "Action"], watchedDate: "2025-12-09" },
                { id: 103, title: "Dune: Part Two", rating: 5, runtime: 166, genres: ["Sci-Fi", "Adventure"], watchedDate: "2025-12-09" },
                { id: 104, title: "Oppenheimer", rating: 4.5, runtime: 180, genres: ["Drama", "History"], watchedDate: "2025-11-20" },
                { id: 105, title: "Some Like It Hot", rating: 5, runtime: 121, genres: ["Comedy", "Romance"], watchedDate: "2025-11-08" },
                { id: 106, title: "Blade Runner 2049", rating: 4, runtime: 164, genres: ["Sci-Fi", "Drama"], watchedDate: "2025-10-01" },
                 { id: 107, title: "Mad Max: Fury Road", rating: 4.5, runtime: 120, genres: ["Action", "Sci-Fi"], watchedDate: "2025-09-15" },
            ];
        }

        // 3. PROCESAMIENTO DE DATOS (Matemáticas)
        processStats(loadedMovies);
    }, []);


    const processStats = (movies) => {
        if (movies.length === 0) {
            setStats({ totalHours: 0, avgRating: 0, totalMovies: 0, genreData: [] });
            return;
        }

        // A. Calcular Horas Totales
        const totalMinutes = movies.reduce((acc, movie) => acc + (movie.runtime || 0), 0);
        const totalHours = (totalMinutes / 60).toFixed(1);

        // B. Calcular Puntuación Media (Solo de pelis puntuadas > 0)
        const ratedMovies = movies.filter(m => m.rating > 0);
        const avgRating = ratedMovies.length > 0
            ? (ratedMovies.reduce((acc, m) => acc + m.rating, 0) / ratedMovies.length).toFixed(1)
            : 0;

        // C. Contar Géneros para la gráfica
        const genreCounts = {};
        movies.forEach(movie => {
            if (movie.genres) {
                movie.genres.forEach(genre => {
                    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                });
            }
        });

        // Formatear para Recharts (array de objetos) y ordenar por cantidad
        const genreData = Object.entries(genreCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value) // Ordenar descendente
            .slice(0, 5); // Top 5 géneros

        setStats({
            totalHours,
            avgRating,
            totalMovies: movies.length,
            genreData
        });
    };

    // Componente de Tooltip personalizado para la gráfica (Estilo oscuro)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-[#14181c] border border-gray-700 p-3 rounded shadow-xl">
              <p className="text-gray-200 font-bold">{label}</p>
              <p className="text-sm" style={{color: COLORS.PURPLE}}>
                {`${payload[0].value} películas`}
              </p>
            </div>
          );
        }
        return null;
      };


    if (!stats) return <div className="text-center text-gray-500 py-20">Calculando estadísticas...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            
            {/* TARJETA 1: Resumen Principal (Horas y Rating) */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Total Películas */}
                <div className="bg-[#1B2228] p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col items-center justify-center">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Vistas</h3>
                    <p className="text-5xl font-extrabold text-white">{stats.totalMovies}</p>
                </div>

                {/* Horas Vistas (Color TURQUESA) */}
                <div className="bg-[#1B2228] p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-[${COLORS.TURQUOISE}] opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Horas Totales</h3>
                    <div className="flex items-baseline">
                        <p className="text-5xl font-extrabold" style={{ color: COLORS.TURQUOISE }}>{stats.totalHours}</p>
                        <span className="text-gray-500 ml-2">hrs</span>
                    </div>
                     <svg className="w-12 h-12 absolute bottom-2 right-2 opacity-20" style={{ color: COLORS.TURQUOISE }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>

                {/* Puntuación Media (Color VERDE) */}
                <div className="bg-[#1B2228] p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
                     <div className={`absolute inset-0 bg-[${COLORS.GREEN}] opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Puntuación Media</h3>
                    <div className="flex items-center">
                        <p className="text-5xl font-extrabold mr-2" style={{ color: COLORS.GREEN }}>{stats.avgRating}</p>
                        <svg className="w-8 h-8" style={{ color: COLORS.GREEN }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                </div>
            </div>

            {/* TARJETA 2: Gráfica de Géneros (Color LILA) */}
            <div className="col-span-1 md:col-span-2 bg-[#1B2228] p-6 rounded-xl border border-gray-800 shadow-lg">
                <h3 className="text-white text-lg font-bold mb-6 flex items-center">
                    Géneros Más Vistos
                    <span className="ml-2 text-xs text-gray-500 font-normal">(Top 5)</span>
                </h3>
                
                <div className="h-80 w-full">
                {stats.genreData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Gráfica de Barras Horizontales */}
                        <BarChart
                            layout="vertical"
                            data={stats.genreData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                            <XAxis type="number" stroke="#9ca3af" tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" stroke="#fff" tickLine={false} axisLine={false} width={80} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {
                                    // Aplicamos el color LILA a todas las barras
                                    stats.genreData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS.PURPLE} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        No hay suficientes datos de género.
                    </div>
                )}
                </div>
            </div>

        </div>
    );
}