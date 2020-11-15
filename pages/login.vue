<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="display-1 my-3 justify-center">
          <div class="text-center d-flex justify-center">
            <Logo />
          </div>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-text-field
              v-model.lazy="$v.email.$model"
              :error-messages="emailErrors"
              outlined
              label="Email"
              required
            ></v-text-field>

            <v-text-field
              v-model.lazy="$v.password.$model"
              :error-messages="passwordErrors"
              outlined
              label="Password"
              hint="At least 8 characters"
              required
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show = !show"
            ></v-text-field>

            <v-btn
              block
              x-large
              :disabled="!valid"
              type="submit"
              class="mr-4 my-5 blue"
            >
              ingresar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <Snackbar />
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'
import Snackbar from '@/components/Snackbar'
import Login from '@/components/Logo'

export default {
  name: 'Login',
  layout: 'login',

  components: {
    Login,
    Snackbar,
  },

  async asyncData({ store, $axios, redirect }) {
    try {
      const url = 'api/auth/me'
      const res = await $axios.$get(url)

      if (!res) return

      store.dispatch('saveUser', res)
      store.dispatch('saveCommerces', res.commerces ?? '')
      store.dispatch('saveCommerce', res.commerces[0] ?? '')

      redirect('/')

      return {
        body: res,
      }
    } catch (error) {
      console.log(error)
      console.log(error.response)
    }
  },

  data: () => ({
    title: 'Login',
    email: '',
    password: '',
    show: false,
    valid: true,
  }),

  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  },

  computed: {
    ...mapState(['user']),
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Debe ser un email valido')
      !this.$v.email.required && errors.push('El email es requerido')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      if (!this.$v.password.required)
        errors.push('La contraseña es un campo obligatorio')
      if (!this.$v.password.minLength)
        errors.push('Debe escribir una contraseña de más de 6 digitos')
      return errors
    },
  },

  methods: {
    ...mapActions([
      'saveUser',
      'saveCommerce',
      'saveCommerces',
      'toggleSnackbar',
    ]),
    async submit() {
      if (this.$v.$invalid) return

      const form = {
        email: this.$v.email.$model,
        password: this.$v.password.$model,
      }

      try {
        await this.$axios.get('sanctum/csrf-cookie')
        const res = await this.$axios.$post('login', form)

        if (res.error) {
          throw new Error(res.error)
        }

        this.saveUser(res)
        this.saveCommerces(res.commerces ?? '')
        this.saveCommerce(res.commerces[0] ?? '')

        this.$router.push('/')
      } catch (error) {
        let message

        switch (error.message) {
          case 'Request failed with status code 401':
            message = 'Usuario y/o contraseña incorrectos'
            break
          case 'Request failed with status code 500':
            message = 'Ocurrió un error inesperado'
            break
          default:
            message = error.message ?? 'Ocurrió un error'
            break
        }

        this.toggleSnackbar({
          text: message,
          color: 'red accent-4',
        })
      }
    },
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>
