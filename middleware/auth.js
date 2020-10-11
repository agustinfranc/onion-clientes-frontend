import axios from 'axios'

export default function ({ route, redirect, $config: { baseURL } }) {
  axios.defaults.withCredentials = true
  axios.defaults.baseURL = baseURL

  if (route.name === 'login') return

  axios
    .get('api/auth/me')
    .then((res) => {
      if (res.status !== 200) redirect('/login')
    })
    .catch((error) => redirect('/login'))
}
