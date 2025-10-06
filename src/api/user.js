import axios from 'axios';

export function registerUser(data) {
  return axios.post('/api/user/register', data);
}

export function loginUser(data) {
  return axios.post('/api/user/login', data);
}

export function adminLogin(data) {
  return axios.post('/api/user/admin/login', data);
}
