import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMessages, sendMessage } from '../../api/chatApi';
import { getToken, clearAuth } from '../../api/authStorage';

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

function Home() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate('/login');
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getMessages();
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (apiError) {
        // eslint-disable-next-line no-console
        console.error('Load messages error:', apiError);
        setError('Не удалось загрузить сообщения. Попробуйте обновить страницу.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [navigate]);

  const handleSend = async (event) => {
    event.preventDefault();
    setError('');

    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    setIsSending(true);

    try {
      const newMessage = await sendMessage({ text: trimmed });
      setMessages((previous) => [...previous, newMessage]);
      setText('');
    } catch (apiError) {
      // eslint-disable-next-line no-console
      console.error('Send message error:', apiError);
      setError('Не удалось отправить сообщение. Попробуйте еще раз.');
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div
      className="page-card chat-layout"
      data-easytag="id1-react/src/components/Chat/Home.jsx"
    >
      <div className="chat-header">
        <div className="chat-header__title">Групповой чат</div>
        <div className="chat-header__actions">
          <Link className="link" to="/profile">
            Профиль
          </Link>
          <button
            type="button"
            className="button-secondary"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {isLoading && <div>Загрузка сообщений...</div>}
        {!isLoading && messages.length === 0 && !error && (
          <div className="chat-empty">Сообщений пока нет.</div>
        )}
        {!isLoading && error && <div className="form-error">{error}</div>}
        {!isLoading && !error &&
          messages.map((message, index) => {
            const key = message.id ? String(message.id) : `${index}`;
            const authorName = message.author_username || message.author || 'Аноним';
            const createdAt = formatDate(message.created_at || message.createdAt);

            return (
              <div key={key} className="chat-message">
                <div className="chat-message__meta">
                  <span>{authorName}</span>
                  {createdAt && <span> · {createdAt}</span>}
                </div>
                <div className="chat-message__text">{message.text}</div>
              </div>
            );
          })}
      </div>

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          className="form-input chat-input-field"
          placeholder="Напишите сообщение"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button
          type="submit"
          className="button-primary"
          disabled={isSending}
        >
          {isSending ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
}

export default Home;
