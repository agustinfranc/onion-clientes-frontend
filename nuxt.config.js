import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  /*
   ** Environment Variables
   ** See https://nuxtjs.org/api/configuration-env/
   */
  env: {
    baseURL: process.env.BASE_URL || 'http://localhost:8000/',
    apiURL: process.env.API_URL || 'http://localhost:8000/api/',
  },

  // https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config/
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'http://localhost:8000/',
    apiURL: process.env.API_URL || 'http://localhost:8000/api/',
    axios: {
      baseURL: process.env.BASE_URL || 'http://localhost:8000/',
    },
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Onion Gestor',
    title: 'Onion', // title page by deafult
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vuelidate',
    '~/plugins/axios'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],

  // Router configuration
  router: {
    middleware: ['auth', 'commerces', 'store'],
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    credentials: true,
    baseURL: process.env.BASE_URL || 'http://localhost:8000/',
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
    icons: {
      iconfont: 'mdi',
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
