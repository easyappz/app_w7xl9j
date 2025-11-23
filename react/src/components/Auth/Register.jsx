import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../../api/authApi';

function Register() {
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
      await registerRequest({ username, password });
      navigate('/');
    } catch (apiError) {
      // eslint-disable-next-line no-console
      console.error('Registration error:', apiError);
      setError('Ошибка регистрации. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="page-card"
      data-easytag="id1-react/src/components/Auth/Register.jsx"
    >
      <h1 className="page-title">Регистрация</h1>
      <p className="page-description">
        Создайте учетную запись, чтобы войти в групповой чат.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label" htmlFor="register-username">
            Имя пользователя
          </label>
          <input
            id="register-username"
            type="text"
            className="form-input"
            placeholder="Введите имя пользователя"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="register-password">
            Пароль
          </label>
          <input
            id="register-password"
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
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        {error && <div className="form-error">{error}</div>}
      </form>

      <p className="page-footer-text">
        Уже есть аккаунт?{' '}
        <Link className="link" to="/login">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Register;
