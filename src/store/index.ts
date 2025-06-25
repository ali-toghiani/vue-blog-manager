import { createStore } from 'vuex';
import router from '@/router/index';
import { UserModel } from '@/models/user.model';

interface State {
  baseApi: string
  user: UserModel | null
}

export default createStore({
  state: (): State => ({
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
        const localUser: UserModel = JSON.parse(<string>localUserRaw);
        if (localUser) {
          state.user = localUser;
        }
      }
      return  (<UserModel>state.user).token;
    },
    userName(state): string {
      return (<UserModel>state.user).username;
    },
  },
  mutations: {
    setUser(context, payload) {
      localStorage.setItem('user', JSON.stringify(payload));
      context.user = payload;
    },
    clearUser(context) {
      localStorage.removeItem('user');
      context.user = null;
      router.push('/login');
    },
  },
  actions: {},
  modules: {},
});
