import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importa los iconos de las redes sociales
import '../CSS/Footer.css'; // Importa los estilos CSS del footer
import { useTranslation } from 'react-i18next'; // Importa el hook useTranslation para manejar las traducciones
import { useEffect, useState } from 'react'; // Importa useEffect y useState desde React

const Footer = () => {
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

  // Renderiza el componente Footer
  return (
    <div className="footer-container">
      {/* Contenedor del footer */}
      <footer className="footer">
        <div className="footer-content">
          {/* Contenido del footer */}
          <div className="social-icons">
            {/* Iconos de redes sociales con enlaces */}
            <a href="https://www.facebook.com/uai.universidad/?locale=es_LA" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/UAI_CL?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/uai_cl/?hl=es" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
          {/* Texto de derechos reservados */}
          <p>{t('Footer.content')}</p>
        </div>
      </footer>
    </div>
  );
};


export default Footer;
