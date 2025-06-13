import axios from 'axios';

const API_BASE = 'https://api.currencylayer.com/';
const ACCESS_KEY = import.meta.env.VITE_CURRENCYLAYER_API_KEY;

export const fetchCurrencyList = async () => {
  const response = await axios.get(`${API_BASE}list`, {
    params: { access_key: ACCESS_KEY },
  });
  return response.data;
};

export const fetchLiveRates = async (source: string = 'USD') => {
  const response = await axios.get(`${API_BASE}live`, {
    params: { access_key: ACCESS_KEY, source },
  });
  return response.data;
};

export const fetchHistoricalRates = async (date: string, source: string = 'USD') => {
  const response = await axios.get(`${API_BASE}historical`, {
    params: { access_key: ACCESS_KEY, date, source },
  });
  return response.data;
};
