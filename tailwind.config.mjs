// tailwind.config.mjs
import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'], // Asegura que escanee todos los archivos de tu proyecto
  theme: {
    extend: {
      colors: {
        // Colores de Your Directory
        'accent-purple': {
          DEFAULT: '#9333ea', 
          light: '#d8bffd', // Morado Pastel para el acento
          dark: '#7c3aed', 
        },
        'base-dark': '#0a0a0a', // Gris muy oscuro para el fondo
      },
      fontFamily: {
        // Establece Inter como fuente única
        sans: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [],
});