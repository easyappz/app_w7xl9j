import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../../api/authApi';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Пожалуйста, заполните имя пользователя и пароль.');
      return;
    }

    setIsSubmitting(true);

    try {
      await loginRequest({ username, password });
      navigate('/');
    } catch (apiError) {
      // eslint-disable-next-line no-console
      console.error('Login error:', apiError);
      setError('Неверное имя пользователя или пароль.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="page-card"
      data-easytag="id1-react/src/components/Auth/Login.jsx"
    >
      <h1 className="page-title">Вход</h1>
      <p className="page-description">
        Введите свои данные, чтобы продолжить работу в чате.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label" htmlFor="login-username">
            Имя пользователя
          </label>
          <input
            id="login-username"
            type="text"
            className="form-input"
            placeholder="Введите имя пользователя"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="login-password">
            Пароль
          </label>
          <input
            id="login-password"
            type="password"
            className="form-input"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button
          type="submit"
          className="button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>

        {error && <div className="form-error">{error}</div>}
      </form>

      <p className="page-footer-text">
        Нет аккаунта?{' '}
        <Link className="link" to="/register">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

export default Login;
