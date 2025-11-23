import instance from './axios';
import './axiosAuth';
import { setAuth, clearAuth } from './authStorage';

export async function register({ username, password }) {
  const response = await instance.post('/api/auth/register', {
    username,
    password,
  });

  const data = response.data;

  if (data && data.token) {
    setAuth({ token: data.token, member: data.member });
  } else {
    clearAuth();
  }

  return data;
}

export async function login({ username, password }) {
  const response = await instance.post('/api/auth/login', {
    username,
    password,
  });

  const data = response.data;

  if (data && data.token) {
    setAuth({ token: data.token, member: data.member });
  } else {
    clearAuth();
  }

  return data;
}
