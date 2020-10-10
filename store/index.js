import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/'

export const state = () => ({
  user: '',
  commerce: '',
  snackbar: {
    display: false,
    text: '',
    color: '',
    timeout: 4000,
  },
})

/* export const getters = {
  getCommerceFormData: (state) => {
    return JSON.parse(JSON.stringify(state.commerce))
  },
} */

export const mutations = {
  SET_COMMERCE(state, payload) {
    state.commerce = payload
  },
  SET_SNACKBAR(state, payload) {
    state.snackbar = payload
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
  toggleSnackbar({ commit }, { display, text, color, timeout }) {
    display = display ?? true
    text = text ?? 'Operacion exitosa'
    color = color ?? 'success'
    timeout = timeout ?? 3000

    commit('SET_SNACKBAR', { display, text, color, timeout })
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
