export default function ({ $axios, redirect, route }) {
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)

    const redirectPaths = {
      400: '/400',
      401: route.name !== 'login' ? '/login' : null,
    };

    redirect(redirectPaths[code]);
  })
}
