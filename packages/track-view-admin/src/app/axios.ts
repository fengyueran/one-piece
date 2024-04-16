import axios from 'axios';

const BASE_URL = '/track-spear-flow/api';

export type Response<T = string> = {
  data: T;
};

// Add a request interceptor
axios.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  return config;
});

// Add a response interceptor
axios.interceptors.response.use((response) => {
  return response.data;
});
