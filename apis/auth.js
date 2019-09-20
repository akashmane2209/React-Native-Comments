import axios from 'axios';
const apiUrl = 'http://192.168.0.120:3000/auth/login';

export const login = async name => {
  const response = await axios.post(apiUrl, name);
  return response;
};
