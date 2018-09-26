import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    text: 'lalalala',
    token: '',
    namelengkap: ''
  },
  mutations: {
    changeText (state, payload) {
      state.text = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
    setNameLengkap (state, payload) {
      state.namelengkap = payload
    }
  },
  actions: {
    changeText (context, payload) {
      context.commit('changeText', payload)
    },
    setToken (context, payload) {
      context.commit('getToken', payload)
    },
    setNameLengkap (context, payload) {
      context.commit('getNameLengkap', payload)
    }
  }
})
