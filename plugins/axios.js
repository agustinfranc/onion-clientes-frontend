export default function ({ $axios, redirect, route, store }) {
  // Adds header: `Authorization: Bearer 123` to all requests
  $axios.setToken(store.state.token, 'Bearer')

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)

    let path

    switch (route.name) {
      case 'login':
        path = 'login'
        break
      case 'login___en':
        path = 'en/login'
        break
      case 'login___es':
        path = 'login'
        break
      default:
        path = null
    }

    const redirectPaths = {
      400: '/400',
      401: path,
    }

    redirect(redirectPaths[code])
  })
}
