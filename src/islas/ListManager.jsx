// src/islas/ListManager.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';

const STORAGE_KEY = 'yourDirectoryUserData'; 

// Estructura inicial del Diario del usuario
const initialData = {
    watchlist: [], 
    customLists: {
        'Mis Favoritas': []
    }, 
    ratings: {}
};

// Crear contexto para compartir funciones de puntuación
const DiaryContext = createContext(null);

export function useDiary() {
    const context = useContext(DiaryContext);
    if (!context) {
        throw new Error('useDiary must be used within ListManager');
    }
    return context;
}

export default function ListManager({ children }) {
    // Estado principal del Diario
    const [userData, setUserData] = useState(initialData);
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Estado del modal de listas
    const [listModalOpen, setListModalOpen] = useState(false);
    const [currentMovie, setCurrentMovie] = useState(null);

    // Cargar datos del localStorage SOLO en el cliente
    useEffect(() => {
        const json = localStorage.getItem(STORAGE_KEY);
        if (json) {
            setUserData(JSON.parse(json));
        }
        setIsLoaded(true);
    }, []);

    // Guardar en localStorage cuando userData cambia
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            console.log('Diario de usuario actualizado y guardado.');
        }
    }, [userData, isLoaded]);

    // Escuchar evento para abrir modal de listas
    useEffect(() => {
        const handleOpenModal = (e) => {
            setCurrentMovie(e.detail.movie);
            setListModalOpen(true);
        };

        window.addEventListener('open-list-modal', handleOpenModal);
        return () => window.removeEventListener('open-list-modal', handleOpenModal);
    }, []);

    // Función para puntuar una película
    const rateMovie = (movieId, rating, movieTitle = '', review = '') => {
        setUserData(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings,
                [movieId]: {
                    rating,
                    movieTitle,
                    review,
                    watchDate: new Date().toISOString().split('T')[0]
                }
            }
        }));
    };

    // Función para eliminar una puntuación
    const removeRating = (movieId) => {
        setUserData(prev => {
            const newRatings = { ...prev.ratings };
            delete newRatings[movieId];
            return {
                ...prev,
                ratings: newRatings
            };
        });
    };

    // Función para crear una nueva lista
    const createList = (listName, description = '') => {
        if (!listName.trim()) return;
        
        setUserData(prev => ({
            ...prev,
            customLists: {
                ...prev.customLists,
                [listName]: {
                    movies: [],
                    description,
                    createdAt: new Date().toISOString()
                }
            }
        }));
    };

    // Función para agregar película a una lista
    const addMovieToList = (listName, movie) => {
        setUserData(prev => {
            const list = prev.customLists[listName];
            
            // Verificar si es un array antiguo o un objeto nuevo
            const currentMovies = Array.isArray(list) ? list : (list?.movies || []);
            
            // Verificar si la película ya está
            const exists = currentMovies.some(m => m.id === movie.id);
            if (exists) return prev;

            const movieData = {
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average,
                addedAt: new Date().toISOString()
            };

            return {
                ...prev,
                customLists: {
                    ...prev.customLists,
                    [listName]: {
                        movies: [...currentMovies, movieData],
                        description: list?.description || '',
                        createdAt: list?.createdAt || new Date().toISOString()
                    }
                }
            };
        });
    };

    // Función para eliminar película de una lista
    const removeMovieFromList = (listName, movieId) => {
        setUserData(prev => {
            const list = prev.customLists[listName];
            const currentMovies = Array.isArray(list) ? list : (list?.movies || []);

            return {
                ...prev,
                customLists: {
                    ...prev.customLists,
                    [listName]: {
                        movies: currentMovies.filter(m => m.id !== movieId),
                        description: list?.description || '',
                        createdAt: list?.createdAt || new Date().toISOString()
                    }
                }
            };
        });
    };

    // Función para eliminar una lista completa
    const deleteList = (listName) => {
        setUserData(prev => {
            const newLists = { ...prev.customLists };
            delete newLists[listName];
            return {
                ...prev,
                customLists: newLists
            };
        });
    };

    const diaryContextValue = {
        rateMovie,
        removeRating,
        userData,
        createList,
        addMovieToList,
        removeMovieFromList,
        deleteList,
        listModalOpen,
        setListModalOpen,
        currentMovie,
        setCurrentMovie
    };

    return (
        <DiaryContext.Provider value={diaryContextValue}>
            <div>
                {children}
                
                {/* Modal de listas integrado */}
                {listModalOpen && (
                    <ListModalIntegrated 
                        isOpen={listModalOpen}
                        onClose={() => setListModalOpen(false)}
                        movie={currentMovie}
                        lists={userData.customLists}
                        onCreateList={createList}
                        onAddToList={addMovieToList}
                    />
                )}
            </div>
        </DiaryContext.Provider>
    );
}

// Modal integrado en el ListManager
function ListModalIntegrated({ isOpen, onClose, movie, lists, onCreateList, onAddToList }) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');

    if (!isOpen || !movie) return null;

    const handleCreateList = (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;

        onCreateList(newListName, newListDescription);
        setNewListName('');
        setNewListDescription('');
        setShowCreateForm(false);
    };

    const handleAddToList = (listName) => {
        onAddToList(listName, movie);
        alert(`✓ Agregado a "${listName}"`);
        setTimeout(() => onClose(), 300);
    };

    const isMovieInList = (listName) => {
        const list = lists[listName];
        const movies = Array.isArray(list) ? list : (list?.movies || []);
        return movies.some(m => m.id === movie.id);
    };

    const listEntries = Object.entries(lists);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#1B2228] rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#14181c] px-6 py-4 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            Agregar a lista
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{movie.title}</p>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
                    {/* Listas existentes */}
                    {listEntries.length > 0 && !showCreateForm && (
                        <div className="p-4">
                            {listEntries.map(([listName, list]) => {
                                const movies = Array.isArray(list) ? list : (list?.movies || []);
                                const description = list?.description || '';
                                
                                return (
                                    <button
                                        key={listName}
                                        onClick={() => handleAddToList(listName)}
                                        disabled={isMovieInList(listName)}
                                        className={`w-full text-left p-4 rounded-lg mb-2 transition-all ${
                                            isMovieInList(listName)
                                                ? 'bg-gray-800 opacity-50 cursor-not-allowed'
                                                : 'bg-[#2c3440] hover:bg-[#3a4552]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium">{listName}</h3>
                                                {description && (
                                                    <p className="text-gray-400 text-sm mt-1 line-clamp-1">{description}</p>
                                                )}
                                                <p className="text-gray-500 text-xs mt-1">
                                                    {movies.length} {movies.length === 1 ? 'película' : 'películas'}
                                                </p>
                                            </div>
                                            {isMovieInList(listName) ? (
                                                <svg className="w-5 h-5 text-green-500 ml-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Botón crear nueva lista */}
                    {!showCreateForm ? (
                        <div className="p-4 border-t border-gray-700">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="w-full bg-[#ba87d0] text-[#14181c] font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Crear nueva lista
                            </button>
                        </div>
                    ) : (
                        /* Formulario de creación */
                        <form onSubmit={handleCreateList} className="p-4 border-t border-gray-700">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Nombre de la lista *
                                    </label>
                                    <input
                                        type="text"
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                        placeholder="Ej: Clásicos que adoro"
                                        className="w-full bg-[#2c3440] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba87d0]"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Descripción (opcional)
                                    </label>
                                    <textarea
                                        value={newListDescription}
                                        onChange={(e) => setNewListDescription(e.target.value)}
                                        placeholder="Describe tu lista..."
                                        className="w-full bg-[#2c3440] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba87d0] resize-none"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#ba87d0] text-[#14181c] font-bold py-2 rounded-lg hover:bg-white transition-colors"
                                    >
                                        Crear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            setNewListName('');
                                            setNewListDescription('');
                                        }}
                                        className="flex-1 bg-gray-700 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}