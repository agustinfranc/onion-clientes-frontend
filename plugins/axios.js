export default function ({ $axios, redirect, route, store, app: { i18n } }) {
  // Adds header: `Authorization: Bearer 123` to all requests
  $axios.setToken(store.state.token, 'Bearer')

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)

    const defaultLocale = i18n.defaultLocale
    const locale = i18n.locale

    const redirectPaths = {
      400: '/400',
      401:
        route.name === 'login' ||
        route.name === 'login___en' ||
        route.name === 'login___es'
          ? null
          : locale === defaultLocale
          ? '/login'
          : `/${locale}/login`,
    }

    redirect(redirectPaths[code])
  })
}
