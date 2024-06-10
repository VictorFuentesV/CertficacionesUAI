import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../CSS/Navbar.css';
import { supabase } from '../supabaseClient';

function NavBar() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null); // Estado para almacenar el rol del usuario
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null); // Resetear el rol del usuario al cerrar sesión
    navigate('/home');
  }

  async function getUserRole(userId) {
    const { data, error } = await supabase
      .from('userinfo')
      .select('role')
      .eq('userid', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    return data.role;
  }

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    setSession(session);

    if (session) {
      const userRole = await getUserRole(session.user.id);
      setRole(userRole);
    }
  };

  useEffect(() => {
    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getUserRole(session.user.id).then(role => setRole(role));
      } else {
        setRole(null);
      }
    });

    return () => {
      typeof unsubscribe === 'function' && unsubscribe();
    };
  }, []);

  useEffect(() => {
    getSession();
  }, []);

  return (
    <div className="navbar navbar-expand-lg bg-primary p-6 d-flex justify-content-between bg-ffc107">
      <div className="topnav">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/home">
              {t('navbar.home')}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/carreras">
              {t('navbar.certificates')}
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <ul className="navbar-nav mx.auto justify-content">
          {session && role === 'Estudiante' && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/miscertificados">
                {t('navbar.myCertificates')}
              </NavLink>
            </li>
          )}
          {session && role === 'Administrador' && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/administracion">
                {t('navbar.admin')}
              </NavLink>
            </li>
          )}
          {session && role === 'Administrador' && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/estadisticas">
                {t('navbar.stats')}
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            {session ? (
              <button className="nav-link" onClick={handleLogout}>
                {t('navbar.logOut')}
              </button>
            ) : (
              <NavLink className="nav-link" to="/login">
                {t('navbar.logIn')}
              </NavLink>
            )}
          </li>
          {session && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-user-circle"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#fff"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                  <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                </svg>
                {t('navbar.account')}
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
