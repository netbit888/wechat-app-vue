// src/api/modules/user.js
import { http } from '../request.js';

export default {
  login:  (credentials) => http.post('/users/login', credentials),
  register:(userData)   => http.post('/users/register', userData),
  getProfile:()         => http.get('/users/profile'),
  logout:()            => http.post('/users/logout'),
  updateProfile:(data) => http.put('/users/profile', data),
  uploadAvatar:(formData, onProgress) => http.upload('/users/avatar', formData, onProgress),
  getSettings:()       => http.get('/users/settings'),
  updateSettings:(data)=> http.put('/users/settings', data)
};