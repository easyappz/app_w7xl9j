import instance from './axios';
import './axiosAuth';

export async function getMessages() {
  const response = await instance.get('/api/chat/messages');
  return response.data;
}

export async function sendMessage({ text }) {
  const response = await instance.post('/api/chat/messages', {
    text,
  });

  return response.data;
}
