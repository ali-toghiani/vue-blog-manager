import { createStore } from 'vuex';
import router from '@/router/index';

export default createStore({
  state: () => ({
    baseApi: process.env.VUE_APP_BASE_API_URL,
    user: null,
  }),
  getters: {
    baseApi(state) {
      return state.baseApi;
    },
    token(state) {
      if (!state.user) {
        const localUserRaw = localStorage.getItem('user');
        const localUser = JSON.parse(localUserRaw);
        if (localUser) {
          state.user = localUser;
        }
      }
      return state.user?.token;
    },
    userName(state) {
      return state.user?.username;
    },
  },
  mutations: {
    setUser(context, payload) {
      localStorage.setItem('user', JSON.stringify(payload));
      context.user = payload;
    },
    clearUser(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      context.user = null;
      router.push('/login');
    },
  },
  actions: {},
  modules: {},
});
