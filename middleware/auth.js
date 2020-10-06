import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/'

export default function ({ route, redirect }) {
  if (route.name === 'login') return

  axios
    .get('api/auth/me')
    .then((res) => {
      if (res.status !== 200) redirect('/login')
    })
    .catch((error) => redirect('/login'))
}
