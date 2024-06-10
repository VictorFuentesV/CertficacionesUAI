import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import '../CSS/newuser.css';

const careers = [
  { id: 0, name: 'careers.careerNames.0' },
  { id: 1, name: 'careers.careerNames.1' },
  { id: 2, name: 'careers.careerNames.2' },
  { id: 3, name: 'careers.careerNames.3' },
  { id: 4, name: 'careers.careerNames.4' },
  { id: 5, name: 'careers.careerNames.5' },
  { id: 6, name: 'careers.careerNames.6' },
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function UserProfileForm() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    career: '',
  });
  const { addUserInfo, loading } = useContext(UserContext);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === 'name' || name === 'lastname' ? capitalize(value) : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addUserInfo(formData.name, formData.lastname, formData.career);
    setFormData({ name: '', lastname: '', career: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <input
        type="text"
        value={formData.name}
        name="name"
        onChange={handleChange}
        required
        placeholder={t('form.name')}
        className="form-control"
      />
      <input
        type="text"
        value={formData.lastname}
        name="lastname"
        onChange={handleChange}
        required
        placeholder={t('form.lastname')}
        className="form-control"
      />
      <select
        name="career"
        value={formData.career}
        onChange={handleChange}
        required
        className="form-control"
      >
        <option value="">{t('form.selectCareer')}</option>
        {careers.map((career) => (
          <option key={career.id} value={career.name}>
            {t(career.name)}
          </option>
        ))}
      </select>
      <div className="bg-dark ms-auto">
        <button disabled={loading} className="btn btn-primary btn-sm">
          {loading ? t('form.loading') : t('form.createProfile')}
        </button>
      </div>
    </form>
  );
}

export default UserProfileForm;