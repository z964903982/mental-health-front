import axios from 'axios'

export function fetchAllScales() {
  return axios.get('/api/scales')
}

export function fetchScaleDetail(id) {
  return axios.get(`/api/scales/${id}`)
}

export function submitScale(id, payload) {
  return axios.post(`/api/user/scales/${id}/submit`, payload)
}

export function fetchUserRecords(userId) {
  return axios.get('/api/user/records', { params: { userId } })
}

export function fetchRecordDetail(id) {
  return axios.get(`/api/user/records/${id}`)
}