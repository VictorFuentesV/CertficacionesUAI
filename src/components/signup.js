import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../CSS/Signin.css';

const SignUp = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      alert('Check your email for verification link');
      // Redirigir al usuario a la página de creación de perfil después de registrarse
      navigate('/crearcuenta');
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          placeholder="Contraseña"
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
        />
        <button type="submit">Submit</button>
      </form>
      Already have an account?<Link to="/login">Login</Link>
    </div>
  );
};

export default SignUp;