import React, { useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ChatHome from './components/Chat/Home';
import Profile from './components/Profile/Profile';
import RequireAuth from './components/RequireAuth';

function App() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
        window.handleRoutes(['/', '/login', '/register', '/profile']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('handleRoutes call error:', error);
    }
  }, []);

  return (
    <div className="app-root" data-easytag="id1-react/src/App.jsx">
      <ErrorBoundary>
        <header className="app-header">
          <div className="app-header__inner">
            <div className="app-logo">Easy Chat</div>
            <nav className="app-nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
                }
              >
                Чат
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
                }
              >
                Профиль
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
                }
              >
                Вход
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
                }
              >
                Регистрация
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={(
                <RequireAuth>
                  <ChatHome />
                </RequireAuth>
              )}
            />
            <Route
              path="/profile"
              element={(
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              )}
            />
          </Routes>
        </main>
      </ErrorBoundary>
    </div>
  );
}

export default App;
