import React, { useState } from 'react';

const IMAGE_BASE = "https://image.tmdb.org/t/p/w154";

// 1. DATOS FICTICIOS INICIALES
const INITIAL_LISTS = [
    {
        id: 1,
        title: "Películas para una tarde lluviosa",
        count: 12,
        description: "Esa sensación de manta, té caliente y melancolía.",
        likes: 342,
        comments: 15,
        posters: ["https://m.media-amazon.com/images/I/61aYi4WoBVL._AC_UF894,1000_QL80_.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHOHKHmmVS2DOr52B73rWI3H5PjOi8Tg6F6g&s", "https://storage.googleapis.com/pod_public/1300/251706.jpg", "https://pics.filmaffinity.com/hotaru_no_haka_grave_of_the_fireflies_tombstone_of_the_fireflies-607078653-large.jpg", "https://img2.rtve.es/v/16717917/vertical/?h=400"]
    },
    {
        id: 2,
        title: "Cyberpunk & Neon Aesthetics",
        count: 8,
        description: "Visualmente impresionantes. Colores saturados, futuros distópicos y sintetizadores.",
        likes: 890,
        comments: 42,
        posters: ["/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", "https://pics.filmaffinity.com/blade_runner_2049-681477614-large.jpg", "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", "https://pics.filmaffinity.com/tron_legacy-673830445-large.jpg"]
    },
    {
        id: 3,
        title: "The Cillian Murphy Collection",
        count: 5,
        description: "Necesito ver CINCO películas más de Cillian antes de fin de año.",
        likes: 120,
        comments: 3,
        posters: ["https://pics.filmaffinity.com/28_days_later-469569758-large.jpg", "https://pics.filmaffinity.com/Oppenheimer-487312908-large.jpg", "https://pics.filmaffinity.com/Steve-826303002-large.jpg", "https://pics.filmaffinity.com/Batman_Begins-413277928-large.jpg", "https://pics.filmaffinity.com/Origen-109425434-large.jpg"]
    }
];

// Banco de imágenes para rellenar las nuevas listas automáticamente
const RANDOM_POSTERS = [
    "/hVIKyTk13AvOGv7ICmJjK44DTzp.jpg", "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", "/9JX7dcI5Xz7p7zW4k8j8q8j8.jpg",
    "/pyc94i9A0qQItQc2A4H3nZ4Yt7H.jpg", "/v0eQLbzT6sWojNRvlVRJEX0CBmz.jpg", "/c5Tqxeo1UpBvnAc3csUm7j3yef5.jpg",
    "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", "/ox4goZd956NgqC618.jpg"
];

export default function ListsClient() {
    const [lists, setLists] = useState(INITIAL_LISTS);

    // FUNCIÓN PARA CREAR LISTA (Demo)
    const handleCreateList = () => {
        // Usamos prompt simple para la demo rápida
        const title = window.prompt("¿Cómo quieres llamar a tu nueva lista?", "Mis Favoritas 2025");
        
        if (title) {
            const description = window.prompt("Añade una descripción corta:", "Una selección personal...");
            
            // Creamos una nueva lista "falsa" pero visualmente completa
            const newList = {
                id: Date.now(), // ID único basado en tiempo
                title: title,
                count: Math.floor(Math.random() * 20) + 1, // Número aleatorio de pelis
                description: description || "Sin descripción.",
                likes: 0,
                comments: 0,
                // Cogemos 5 pósters aleatorios del banco para que quede bonito
                posters: RANDOM_POSTERS.sort(() => 0.5 - Math.random()).slice(0, 5)
            };

            // Añadimos la nueva lista AL PRINCIPIO
            setLists([newList, ...lists]);
        }
    };

    return (
        <div>
            {/* Cabecera con Botón de Crear */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-2 mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-white text-lg font-semibold uppercase tracking-widest">
                        Listas Populares
                    </h1>
                    
                    {/* BOTÓN + NUEVA LISTA */}
                    <button 
                        onClick={handleCreateList}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-[#00E054] text-gray-200 hover:text-[#14181c] px-3 py-1 rounded text-xs font-bold transition-colors uppercase tracking-wider"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nueva Lista
                    </button>
                </div>
                
                <div className="text-xs text-gray-500 flex items-center space-x-4 mt-2 md:mt-0">
                    <span className="cursor-pointer hover:text-white transition">Sort by WHEN UPDATED v</span>
                </div>
            </div>

            {/* Grid de Listas */}
            <div className="flex flex-col space-y-8">
                {lists.map((list) => (
                    <div key={list.id} className="group flex flex-col md:flex-row gap-6 hover:bg-[#1B2228] p-4 -mx-4 rounded-xl transition-colors duration-300 cursor-pointer">
                        
                        {/* PÓSTERS */}
                        <div className="shrink-0">
                            <div className="flex h-24 md:h-32 shadow-lg relative pl-2">
                                {list.posters.map((poster, index) => (
                                    <div 
                                        key={index}
                                        className={`relative h-full aspect-2/3 border border-gray-900 overflow-hidden bg-gray-800
                                            ${index > 0 ? '-ml-8 md:-ml-10 shadow-[-4px_0_8px_rgba(0,0,0,0.5)]' : 'z-10'} 
                                            transition-transform duration-300 group-hover:translate-x-1`}
                                        style={{ zIndex: 5 - index }}
                                    >
                                        <img 
                                            src={poster.startsWith('/') ? `${IMAGE_BASE}${poster}` : poster} 
                                            alt="Poster" 
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="flex flex-col justify-center grow">
                            <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#92f6df] transition-colors mb-1">
                                {list.title}
                            </h2>
                            
                            <div className="flex items-center text-xs text-gray-500 font-semibold space-x-4 mb-3">
                                <div className="flex items-center space-x-1">
                                    <img src={`https://i.pravatar.cc/150?u=${list.id}`} alt="User" className="w-5 h-5 rounded-full border border-gray-600"/>
                                    <span className="text-gray-400 hover:text-white transition">UsuarioDemo</span>
                                </div>
                                <span>{list.count} films</span>
                                <span className="flex items-center space-x-1">
                                    <svg className="w-3 h-3 text-[#ba87d0]" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                                    <span>{list.likes}</span>
                                </span>
                            </div>

                            <p className="text-gray-300 text-sm font-serif leading-relaxed line-clamp-2">
                                {list.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}