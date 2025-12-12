import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- ICONO PERSONALIZADO (Chincheta + Claqueta) ---
// Usamos L.divIcon para renderizar un SVG vectorial nítido
const CustomIcon = L.divIcon({
  className: 'custom-map-icon', // Clase vacía para evitar cuadros blancos por defecto
  html: `
    <div style="position: relative; display: flex; justify-content: center; align-items: center; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5));">
      <svg width="40" height="48" viewBox="0 0 384 512" fill="#00E054">
        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
      </svg>
      
      <div style="position: absolute; top: 8px; color: #14181c;">
         <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 3h-3l-2-3h-2l2 3h-3l-2-3h-2l2 3h-3l-2-3H2v15h20V4h-4zM4 17V9h16v8H4z"/>
         </svg>
      </div>
    </div>
  `,
  iconSize: [40, 48],   // Tamaño total
  iconAnchor: [20, 48], // Punto de anclaje (la punta del pin, abajo al centro)
  popupAnchor: [0, -50] // Donde sale el popup (arriba del pin)
});


// DATOS DE LOCALIZACIONES
const LOCATIONS = [
    {
        id: 1,
        title: "El Señor de los Anillos",
        place: "Hobbiton (Matamata, Nueva Zelanda)",
        coords: [-37.8577, 175.6806],
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiiKXWkAIUlZ47rDI6kpHZMbr4gjrc1HmeIA&s",
        desc: "La Comarca, hogar de Bilbo y Frodo Bolsón."
    },
    {
        id: 2,
        title: "Joker",
        place: "Joker Stairs (Bronx, NY)",
        coords: [40.8359, -73.9240],
        image: "https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        desc: "Las famosas escaleras donde Arthur Fleck baila."
    },
    {
        id: 3,
        title: "Harry Potter",
        place: "Estación King's Cross (Londres)",
        coords: [51.5316, -0.1246],
        image: "https://image.tmdb.org/t/p/w200/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
        desc: "Plataforma 9 ¾, la entrada al mundo mágico."
    },
    {
        id: 4,
        title: "Game of Thrones",
        place: "Dubrovnik (Croacia)",
        coords: [42.6507, 18.0944],
        image: "https://image.tmdb.org/t/p/w200/1XS1oqL89opfnbGw83trZrcr5bb.jpg",
        desc: "King's Landing (Desembarco del Rey)."
    },
    {
        id: 5,
        title: "Jurassic Park",
        place: "Kualoa Ranch (Hawaii)",
        coords: [21.5209, -157.8373],
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNXvyph0pfPxmwIhT0xvDIia4o4VNzPQnoog&s",
        desc: "El valle donde corren los Gallimimus."
    },
    {
        id: 6,
        title: "La Casa de Papel",
        place: "Fábrica Nacional de Moneda (Madrid)",
        coords: [40.4223, -3.6696],
        image: "https://image.tmdb.org/t/p/w200/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
        desc: "El lugar del primer gran atraco."
    }
];

export default function MapClient() {
  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-700 shadow-2xl z-0 relative">
      <MapContainer 
        center={[20, 0]}
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {LOCATIONS.map((loc) => (
          // Usamos nuestro icono personalizado aquí 👇
          <Marker key={loc.id} position={loc.coords} icon={CustomIcon}>
            <Popup className="custom-popup">
               <div className="text-center w-40 font-sans">
                    <img 
                        src={loc.image} 
                        alt={loc.title} 
                        className="w-full h-24 object-cover rounded mb-2"
                    />
                    <h3 className="font-bold text-gray-900 text-sm">{loc.title}</h3>
                    <p className="text-xs text-gray-600 italic mb-1">{loc.place}</p>
                    <p className="text-xs text-gray-500">{loc.desc}</p>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}