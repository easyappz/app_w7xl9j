import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentMember, updateCurrentMember } from '../../api/profileApi';
import { getToken, setAuth } from '../../api/authStorage';

function formatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('ru-RU');
}

function Profile() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getCurrentMember();
        setMember(data);
        if (data && data.username) {
          setUsername(data.username);
        }
      } catch (apiError) {
        // eslint-disable-next-line no-console
        console.error('Load profile error:', apiError);
        setError('Не удалось загрузить данные профиля.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const payload = {};

    if (username && member && username !== member.username) {
      payload.username = username;
    }

    if (password) {
      payload.password = password;
    }

    if (!payload.username && !payload.password) {
      setSuccess('Нет изменений для сохранения.');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedMember = await updateCurrentMember(payload);
      setMember(updatedMember);
      if (updatedMember && updatedMember.username) {
        setUsername(updatedMember.username);
      }
      setPassword('');

      const token = getToken();
      if (token) {
        setAuth({ token, member: updatedMember });
      }

      setSuccess('Изменения успешно сохранены.');
    } catch (apiError) {
      // eslint-disable-next-line no-console
      console.error('Update profile error:', apiError);
      setError('Не удалось сохранить изменения. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const registrationDate = member
    ? member.created_at || member.createdAt || member.date_joined || member.dateJoined
    : null;

  return (
    <div
      className="page-card"
      data-easytag="id1-react/src/components/Profile/Profile.jsx"
    >
      <h1 className="page-title">Профиль пользователя</h1>
      <p className="page-description">
        Просмотр и изменение данных вашей учетной записи.
      </p>

      {isLoading && <div>Загрузка профиля...</div>}

      {!isLoading && error && <div className="form-error">{error}</div>}

      {!isLoading && member && (
        <>
          <div className="profile-info">
            <div className="profile-info__row">
              <strong>Текущее имя пользователя: </strong>
              <span>{member.username}</span>
            </div>
            {registrationDate && (
              <div className="profile-info__row">
                <strong>Дата регистрации: </strong>
                <span>{formatDate(registrationDate)}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="profile-username">
                Новое имя пользователя
              </label>
              <input
                id="profile-username"
                type="text"
                className="form-input"
                placeholder="Измените имя пользователя"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="profile-password">
                Новый пароль
              </label>
              <input
                id="profile-password"
                type="password"
                className="form-input"
                placeholder="Оставьте пустым, если не хотите менять пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </button>

            {success && <div className="form-success">{success}</div>}
            {error && !success && <div className="form-error">{error}</div>}
          </form>
        </>
      )}
    </div>
  );
}

export default Profile;
