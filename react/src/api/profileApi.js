import instance from './axios';
import './axiosAuth';

export async function getCurrentMember() {
  const response = await instance.get('/api/members/me');
  return response.data;
}

export async function updateCurrentMember(payload) {
  const response = await instance.patch('/api/members/me', payload);
  return response.data;
}
