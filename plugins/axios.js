export default function ({ $axios, redirect, route, store }) {
  // Adds header: `Authorization: Bearer 123` to all requests
  $axios.setToken(store.state.token, 'Bearer')

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)

    const redirectPaths = {
      400: '/400',
      401: route.name !== 'login' ? '/login' : null,
    }

    redirect(redirectPaths[code])
  })
}
