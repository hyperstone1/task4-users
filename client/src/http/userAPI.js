import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { host } from '../utils/constants';

export const login = async (email, password, date) => {
  const { data } = await axios.post(`${host}/api/user/login`, {
    email,
    password,
    date,
  });
  localStorage.setItem('token', data.token);

  return jwt_decode(data.token);
};
export const registration = async (email, password, firstName, date) => {
  const { data } = await axios.post(`${host}/api/user/registration`, {
    email,
    password,
    firstName,
    date,
  });
  localStorage.setItem('token', data.token);

  return jwt_decode(data.token);
};

export const getUsers = async () => {
  const { data } = await axios.get(`${host}/api/user/users`);
  return data;
};

export const blockUser = async (idUsers) => {
  const { data } = await axios.post(`${host}/api/user/block`, idUsers);
  return data;
};
export const unblockUser = async (idUsers) => {
  const { data } = await axios.post(`${host}/api/user/unblock`, idUsers);
  return data;
};
export const deleteUser = async (idUsers) => {
  const { data } = await axios.post(`${host}/api/user/delete`, idUsers);
  return data;
};
