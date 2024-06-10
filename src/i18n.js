import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './JSON/en.json';
import esTranslation from './/JSON/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
    lng: 'es', // idioma predeterminado
    fallbackLng: 'es', // idioma de respaldo si la traducción no está disponible
    interpolation: {
      escapeValue: false, // No necesitas escapar HTML en las traducciones
    },
  });

export default i18n;