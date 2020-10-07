export default function ({ route, redirect, store }) {
  if (route.name === 'index' || route.name === 'login') return

  if (!store.state.commerce) redirect('/')
}
