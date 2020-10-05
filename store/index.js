import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/'

export const state = () => ({
  user: '',
})

export const getters = {}

export const mutations = {
  SET_USER(state, payload) {
    state.user = payload
  },
}

export const actions = {
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
