import axios from 'axios';

const BASE_URL = '/api';

// Add a request interceptor
axios.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  return config;
});

export const fetchEvents = (): Promise<any> => axios.get(`/events`);
