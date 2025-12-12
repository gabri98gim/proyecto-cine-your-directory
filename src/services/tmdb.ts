const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Tipos de datos
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Función helper para hacer peticiones
async function fetchTMDB<T>(endpoint: string, apiKey: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=es-ES`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }
  
  return response.json();
}

// Función para obtener URL de imágenes
export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-movie.jpg'; // Puedes crear un placeholder
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

// Obtener películas populares
export async function getPopularMovies(apiKey: string, page: number = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>(`/movie/popular?page=${page}`, apiKey);
}

// Obtener películas mejor valoradas
export async function getTopRatedMovies(apiKey: string, page: number = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>(`/movie/top_rated?page=${page}`, apiKey);
}

// Obtener películas en cartelera
export async function getNowPlayingMovies(apiKey: string, page: number = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>(`/movie/now_playing?page=${page}`, apiKey);
}

// Obtener películas próximamente
export async function getUpcomingMovies(apiKey: string, page: number = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>(`/movie/upcoming?page=${page}`, apiKey);
}

// Buscar películas
export async function searchMovies(query: string, apiKey: string, page: number = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`, apiKey);
}

// Obtener detalles de una película
export async function getMovieDetails(movieId: number, apiKey: string): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/movie/${movieId}`, apiKey);
}

// Obtener películas por género
export async function getMoviesByGenre(genreId: number, apiKey: string, page: number = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>(`/discover/movie?with_genres=${genreId}&page=${page}`, apiKey);
}

// Lista de géneros comunes
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIFI: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
};