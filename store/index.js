export const state = () => ({
  user: '',
  token: null,
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
  SET_TOKEN(state, payload) {
    state.token = payload
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
  saveToken({ commit }, payload) {
    commit('SET_TOKEN', payload)
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
  logout({ commit, dispatch }, payload) {
    const i18n = this.app.i18n
    const locale = i18n.locale
    const defaultLocale = i18n.defaultLocale

    this.$axios
      .post('api/auth/logout')
      .then(function (res) {
        console.log(res)
      })
      .catch(function (error) {
        console.error(error.response ?? error)
      })
      .finally(function () {
        commit('SET_USER', '')

        dispatch(
          'redirect',
          locale === defaultLocale ? '/login' : `${locale}/login`
        )
      })
  },
  redirect({ commit }, payload) {
    this.$router.push(payload)
  },
}
