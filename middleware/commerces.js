export default function ({ route, store, redirect, $axios }) {
  if (route.name === 'login') return

  if (store.state.commerce) return

  return $axios.$get('api/auth/commerces').then((res) => {
    console.log(res)
    store.dispatch('saveCommerces', res ?? '')
    store.dispatch('saveCommerce', res[0] ?? '')
  })
}
