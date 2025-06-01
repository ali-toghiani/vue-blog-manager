import axios from 'axios';

import store from '@/store/index';

const apiClient = axios.create({
  baseURL: `${store.getters.baseApi}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Token ${store.getters.token}`,
  },
});

export default apiClient;
