export const state = () => ({
  user: '',
  commerce: '',
  commerces: [],
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
  SET_COMMERCES(state, payload) {
    state.commerces = payload
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
  saveCommerces({ commit }, payload) {
    commit('SET_COMMERCES', payload)
  },
  saveUser({ commit }, payload) {
    commit('SET_USER', payload)
  },
  toggleSnackbar({ commit }, { display, text, color, timeout }) {
    display = display ?? true
    text = text ?? 'Operacion exitosa'
    color = color ?? 'success'
    timeout = timeout ?? 4000

    commit('SET_SNACKBAR', { display, text, color, timeout })
  },
  logout({ commit }, payload) {
    this.$axios.post('logout').then((res) => {
      commit('SET_USER', '')
      location.href = '/login'
    })
  },
}
