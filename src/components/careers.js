import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import '../CSS/careers.css'; // Importa estilos
import { useEffect, useState } from 'react'; // Importa useEffect y useState para el manejo de estado
import { useTranslation } from 'react-i18next'; // Importa useTranslation para la internacionalización

const Careers = () => {
  const { t, i18n } = useTranslation(); // Obtiene las funciones de traducción y el objeto i18n
  const [initialized, setInitialized] = useState(false); // Estado para verificar si la inicialización está completa

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language'); // Obtiene el idioma almacenado en localStorage
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage); // Cambia el idioma si está almacenado
    }
    setInitialized(true); // Marca la inicialización como completa
  }, [i18n]); // Dependencia: i18n

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Cambia el idioma usando la función de i18n
    localStorage.setItem('language', lng); // Guarda el idioma seleccionado en localStorage
  };

  if (!initialized) return null; // Si la inicialización no está completa, retorna null

  // Lista de carreras con su respectivo nombre traducido
  const careers = [
    { id: 0, name: t('careers.careerNames.0') },
    { id: 1, name: t('careers.careerNames.1') },
    { id: 2, name: t('careers.careerNames.2') },
    { id: 3, name: t('careers.careerNames.3') },
    { id: 4, name: t('careers.careerNames.4') },
    { id: 5, name: t('careers.careerNames.5') },
    { id: 6, name: t('careers.careerNames.6') },
  ];

  return (
    <div>
      <h2>{t('careers.title')}</h2> {/* Título de la sección obtenido de las traducciones */}
      <div className="careers-grid">
        {careers.map((career) => (
          <div key={career.id} className="career-item"> {/* Mapea cada carrera */}
            <div className="career-item-overlay"></div> {/* Capa overlay para efecto visual */}
            <Link to={`/certificates/${career.id}`}>{career.name}</Link> {/* Enlace a la página de certificados */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Careers;
