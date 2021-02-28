export default function ({
  route,
  store,
  redirect,
  $axios,
  $config: { baseURL },
}) {
  //* si existe store.state.token renderizo el sitio y luego despacho el axios de me
  //* si el me falla me redirige al login

  //* si no existe el state.token no renderizo sino que muestro un loader (loadingIndicator) y espero el me
  //* si el me falla me voy al login y sino guardo el user en el store

  //! Refactorizar un poco esto para acortar codigo (usar un gran try catch)
  if (store.state.token) {
    $axios.setToken(store.state.token, 'Bearer')

    $axios
      .get('api/auth/me')
      .then((res) => {
        if (res.status !== 200) redirect(302, '/login')

        store.dispatch('saveUser', res.data ?? '')
        store.dispatch('saveCommerces', res.data.commerces ?? '')

        if (store.state.commerce) return

        store.dispatch('saveCommerce', res.data.commerces[0] ?? '')
      })
      .catch(() => {
        redirect(302, '/login')
      })
  } else {
    //* Este return lo que hace es esperar la respuesta para luego continuar el ciclo de vida de Nuxt
    return $axios
      .get('api/auth/me')
      .then((res) => {
        if (res.status !== 200) redirect(302, '/login')

        store.dispatch('saveUser', res.data ?? '')
        store.dispatch('saveCommerces', res.data.commerces ?? '')

        if (store.state.commerce) return

        store.dispatch('saveCommerce', res.data.commerces[0] ?? '')
      })
      .catch(() => {
        redirect(302, '/login')
      })
  }
}
