import axios from 'axios';

export function getScales() {
  return axios.get('/api/tests/scales');
}

export function createScaleFromText(text) {
  return axios.post('/api/tests/generate', { text });
}

export function createScaleFromFile(file) {
  const form = new FormData();
  form.append('file', file);
  return axios.post('/api/tests/generate-file', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function updateScale(id, data) {
  return axios.put(`/api/tests/scales/${id}`, data);
}

export function deleteScale(id) {
  return axios.delete(`/api/tests/scales/${id}`);
}