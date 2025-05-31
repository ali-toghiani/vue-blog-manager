import { createApp } from 'vue';
import Vue3Toastify from 'vue3-toastify';

import App from './App.vue';
import router from './router';
import store from './store';

// Styles Imports
import './assets/tailwind.css';
import './assets/fonts.css';
import 'vue3-toastify/dist/index.css';

createApp(App)
  .use(store)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-center',
    hideProgressBar: true,
    icon: false,
    closeButton: false,
  })
  .mount('#app');
