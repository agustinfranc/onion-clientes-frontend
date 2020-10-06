import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/'

export const state = () => ({
  user: '',
  commerce: '',
})

export const getters = {}

export const mutations = {
  SET_COMMERCE(state, payload) {
    state.commerce = payload
  },
  SET_USER(state, payload) {
    state.user = payload
  },
}

export const actions = {
  saveCommerce({ commit }, payload) {
    commit('SET_COMMERCE', payload)
  },
  saveUser({ commit }, payload) {
    commit('SET_USER', payload)
  },
  logout({ commit }, payload) {
    axios.post('logout').then((res) => {
      console.log(res.data)

      if (res.status === 200) {
        commit('SET_USER', '')

        location.href = '/login'
      }
    })
  },
}
