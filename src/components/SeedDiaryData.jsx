import React, { useEffect } from 'react';

export default function SeedDiaryData() {
  useEffect(() => {
    // Agregar datos de ejemplo al localStorage para pruebas
    const exampleData = {
      watchlist: [],
      customLists: { 'Mis Favoritas': [] },
      ratings: {
        '550': {
          rating: 4.5,
          watchDate: '2025-12-10',
          movieTitle: 'Fight Club',
          review: 'Una obra maestra de cine'
        },
        '278': {
          rating: 5,
          watchDate: '2025-12-09',
          movieTitle: 'The Shawshank Redemption',
          review: 'Increíble'
        },
        '238': {
          rating: 4.5,
          watchDate: '2025-12-08',
          movieTitle: 'The Godfather',
          review: 'Clásico absoluto'
        },
        '240': {
          rating: 4,
          watchDate: '2025-12-07',
          movieTitle: 'The Godfather Part II',
          review: 'Excelente secuela'
        },
        '424': {
          rating: 4.5,
          watchDate: '2025-12-06',
          movieTitle: 'Schindler\'s List',
          review: 'Impactante'
        }
      }
    };

    // Solo agregar si no existe ya
    if (!localStorage.getItem('yourDirectoryUserData')) {
      localStorage.setItem('yourDirectoryUserData', JSON.stringify(exampleData));
      console.log('Datos de ejemplo agregados al diario');
    }
  }, []);

  return null; // Este componente no renderiza nada
}
