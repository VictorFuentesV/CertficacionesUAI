import React from 'react';
import Hero from './hero';
import { useTranslation } from 'react-i18next'; // Importa el hook useTranslation para manejar las traducciones
import { useEffect, useState } from 'react'; // Importa useEffect y useState desde React

const Home = () => {
  const { t, i18n } = useTranslation(); // Usa el hook useTranslation para obtener las traducciones y el objeto i18n
  const [initialized, setInitialized] = useState(false); // Estado para verificar si la inicialización ha ocurrido

  // Efecto para cargar el idioma almacenado al inicio
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language'); // Obtiene el idioma almacenado en el almacenamiento local
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage); // Cambia el idioma según el idioma almacenado
    }
    setInitialized(true); // Establece que la inicialización ha ocurrido
  }, [i18n]); // El efecto se ejecuta cada vez que cambia el objeto i18n

  // Función para cambiar el idioma seleccionado
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Cambia el idioma usando el objeto i18n
    localStorage.setItem('language', lng); // Almacena el idioma seleccionado en el almacenamiento local
  };

  // Si la inicialización no ha ocurrido, retorna null para evitar renderizado
  if (!initialized) return null;

  // Renderiza el componente Home
  return (
    <div>
      <Hero />
    
    <div className="home">
      {/* Contenido del home con el título traducido */}
      <div className="content-hero">
        <h2>{t('home.title')}</h2> {/* Obtiene y muestra el título del héroe traducido */}
        <p>{t('home.content')}</p>
      </div>
      </div>
    </div>
  );
};



export default Home;