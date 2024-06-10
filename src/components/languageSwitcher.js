import React, { useEffect, useState } from 'react'; // Importa React, useEffect y useState desde React
import { useTranslation } from 'react-i18next'; // Importa el hook useTranslation para manejar las traducciones
import '../CSS/languageSwitcher.css'; // Importa los estilos CSS del componente LanguageSwitcher

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation(); // Usa el hook useTranslation para obtener las traducciones y el objeto i18n
  const [initialized, setInitialized] = useState(false); // Estado para verificar si la inicialización ha ocurrido
  const [language, setLanguage] = useState(''); // Estado para almacenar el idioma seleccionado
  const [showLanguages, setShowLanguages] = useState(false); // Estado para controlar la visibilidad de las opciones de idioma

  // Efecto para cargar el idioma almacenado al inicio
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language'); // Obtiene el idioma almacenado en el almacenamiento local
    if (storedLanguage) {
      setLanguage(storedLanguage); // Establece el idioma almacenado en el estado
      i18n.changeLanguage(storedLanguage); // Cambia el idioma según el idioma almacenado
    } else {
      setLanguage(i18n.language); // Si no hay idioma almacenado, usa el idioma actual
    }
    setInitialized(true); // Establece que la inicialización ha ocurrido
  }, [i18n]); // El efecto se ejecuta cada vez que cambia el objeto i18n

  // Función para cambiar el idioma seleccionado
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Cambia el idioma usando el objeto i18n
    localStorage.setItem('language', lng); // Almacena el idioma seleccionado en el almacenamiento local
    setLanguage(lng); // Establece el idioma seleccionado en el estado
    setShowLanguages(false); // Oculta las opciones de idioma después de seleccionar uno
  };

  // Si la inicialización no ha ocurrido, retorna null para evitar renderizado
  if (!initialized) return null;

  // Renderiza el componente LanguageSwitcher
  return (
    <div className="language-switcher-container bg-dark" >
      {/* Botón para mostrar/ocultar las opciones de idioma */}
      <button className="language-switcher-button" onClick={() => setShowLanguages(!showLanguages)}>{t('button.language')}</button>
      {/* Opciones de idioma */}
      {showLanguages && (
        <div className="language-switcher-dropdown">
          {/* Botón para cambiar al idioma inglés */}
          <button onClick={() => changeLanguage('en')} disabled={language === 'en'}>
            {t('button.english')}
          </button>
          {/* Botón para cambiar al idioma español */}
          <button onClick={() => changeLanguage('es')} disabled={language === 'es'}>
            {t('button.spanish')}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
