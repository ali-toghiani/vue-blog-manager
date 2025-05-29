import { createStore } from 'vuex'

export default createStore({
  state: () => ({
    baseApi : process.env.VUE_APP_BASE_API_URL,
  }),
  getters: {
    baseApi(state){
      return state.baseApi;
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
