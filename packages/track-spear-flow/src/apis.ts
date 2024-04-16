import axios from 'axios';

const BASE_URL = '/track-spear-flow/api';

// Add a request interceptor
axios.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  return config;
});

export const createEvent = (data: {}): Promise<any> => axios.post(`/events`, {});
