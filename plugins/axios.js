export default function ({ $axios, redirect }) {
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)

    const redirectPaths = {
      400: '/400',
      401: '/login',
    };

    redirect(redirectPaths[code]);
  })
}
