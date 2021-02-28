import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    port: 3001, // default: 3000
    host: 'localhost', // default: localhost
  },

  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: true,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server',

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
  plugins: ['~/plugins/vuelidate', '~/plugins/axios'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // https://i18n.nuxtjs.org/es/
    'nuxt-i18n',
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
      },
      {
        code: 'es',
        name: 'Español',
        iso: 'es-ES',
      },
    ],
    defaultLocale: 'es',
    vueI18n: {
      fallbackLocale: 'es',
      messages: {
        en: {
          welcome: 'Welcome',
          settings: 'Settings',
          login: 'Login',
          logout: 'Logout',
          register: 'Register',
          save: 'Save',
          details: 'Details',
          search: 'Search',
          edit: 'Edit',
          error: 'Something went wrong',
          submitImage: 'Image updated successfully',
          dashboard: {
            title: 'Dashboard',
            sells: {
              title: 'Sells',
            },
            traffic: {
              title: 'Traffic',
            },
            commerce: {
              title: 'My Commerce',
              name: 'Name',
              editAvatar: 'Edit Avatar',
              editCover: 'Edit Cover Page',
              submit: 'Commerce data updated successfully',
            },
            products: {
              title: 'Products',
              headers: {
                avatar: '',
                name: 'Name',
                category: 'Category',
                price: 'Price',
                visible: 'Visible',
              },
            },
          },
          products: {
            title: 'Products',
            new: 'New product',
            product: 'Product',
            store: 'New product stored successfuly',
            update: 'Product updated successfuly',
            editAvatar: 'Edit avatar',
            addAvatar: 'Add avatar',
            extraPrices: 'Extra Prices',
            imageUploadError:
              'Image file size is bigger than 1mb or has no valid format (jpg, png, webp, gif, tiff)',
            headers: {
              code: 'Code',
              name: 'Name',
              category: 'Category',
              subcategory: 'Subcategory',
              price: 'Price',
              visible: 'Visible',
              disabled: 'Product disabled',
              actions: 'Actions',
              description: 'Description',
            },
            dialogDelete: {
              title: 'Are you sure you want to delete {msg}',
              cancel: 'Cancel',
              confirm: 'Confirm',
            },
          },
          analytics: {
            title: 'Analytics',
          },
        },
        es: {
          welcome: 'Bienvenido',
          settings: 'Ajustes',
          login: 'Ingresar',
          logout: 'Salir',
          register: 'Registrarse',
          save: 'Guardar',
          details: 'Detalles',
          search: 'Buscar',
          edit: 'Editar',
          error: 'Ocurrió un error',
          submitImage: 'Imagen actualizada correctamente',
          dashboard: {
            title: 'Dashboard',
            sells: {
              title: 'Ventas',
            },
            traffic: {
              title: 'Trafico',
            },
            commerce: {
              title: 'Mi Comercio',
              name: 'Nombre',
              editAvatar: 'Editar Avatar',
              editCover: 'Editar Portada',
              submit: 'Datos de comercio actualizados correctamente',
            },
            products: {
              title: 'Productos',
              headers: {
                avatar: '',
                name: 'Nombre',
                category: 'Categoria',
                price: 'Precio',
                visible: 'Visible',
              },
            },
          },
          products: {
            title: 'Productos',
            new: 'Nuevo producto',
            product: 'Producto',
            store: 'Producto nuevo cargado correctamente',
            update: 'Producto actualizado correctamente',
            editAvatar: 'Editar avatar',
            addAvatar: 'Agregar avatar',
            extraPrices: 'Precios Extra',
            imageUploadError:
              'El tamaño de la imagen es superior a 1mb o el formato no es válido (jpg, png, webp, gif, tiff)',
            headers: {
              code: 'Codigo',
              name: 'Nombre',
              category: 'Categoria',
              subcategory: 'Subcategoria',
              price: 'Precio',
              visible: 'Visible',
              disabled: 'Producto deshabilitado',
              actions: 'Acciones',
              description: 'Descripción',
            },
            dialogDelete: {
              title: 'Estás seguro que deseas eliminar {msg}',
              cancel: 'Cancelar',
              confirm: 'Aceptar',
            },
          },
          analytics: {
            title: 'Reportes',
          },
        },
      },
    },
  },

  // Router configuration
  router: {
    // middleware: ['auth'],    // moved to default layout
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
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
  build: {
    //
  },

  // https://nuxtjs.org/guides/configuration-glossary/configuration-loading-indicator
  loadingIndicator: {
    name: 'circle',
    color: '#007bff',
    background: 'white',
  },
}
