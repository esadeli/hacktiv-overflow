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
    getToken (state, payload) {
      state.token = payload
    },
    getNameLengkap (state, payload) {
      state.namelengkap = payload
    }
  },
  actions: {
    changeText (context, payload) {
      context.commit('changeText', payload)
    },
    getToken (context, payload) {
      context.commit('getToken', payload)
    },
    getNameLengkap (context, payload) {
      context.commit('getNameLengkap', payload)
    }
  }
})
