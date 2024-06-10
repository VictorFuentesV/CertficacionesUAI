import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

function Profile() {
  const { t } = useTranslation();
  const { user, userInfo } = useContext(UserContext);

  return (
    <div className="card card-body">
      <h2>{t('profile.title')}</h2>
      {user && (
        <div>
          <p>
            <strong>{t('profile.email')}:</strong> {user.email}
          </p>
          {userInfo && (
            <div>
              <p>
                <strong>{t('profile.name')}:</strong> {userInfo.name}
              </p>
              <p>
                <strong>{t('profile.lastname')}:</strong> {userInfo.lastname}
              </p>
              <p>
                <strong>{t('profile.career')}:</strong> {t(userInfo.career)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;