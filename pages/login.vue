<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline"> Login </v-card-title>

        <v-card-text>
          <form>
            <v-text-field
              v-model.lazy="$v.email.$model"
              :error-messages="emailErrors"
              label="Email"
              required
            ></v-text-field>

            <v-text-field
              v-model.lazy="$v.password.$model"
              :error-messages="passwordErrors"
              label="Password"
              hint="At least 8 characters"
              counter
              required
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show = !show"
            ></v-text-field>
            <v-btn class="mr-4 my-2" @click="submit"> submit </v-btn>
          </form>
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

export default {
  name: 'Login',
  layout: 'login',

  components: {
    Snackbar,
  },

  async asyncData({ store, $axios, redirect }) {
    try {
      const url = 'api/auth/me'
      const res = await $axios.$get(url)

      if (!res) return

      if (!store.state.user) {
        store.dispatch('saveUser', res)
      }

      redirect('/')

      return {
        body: res,
      }
    } catch (error) {
      console.log(error)
    }
  },

  data: () => ({
    title: 'Login',
    email: '',
    password: '',
    show: false,
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
    ...mapActions(['saveUser', 'toggleSnackbar']),
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
        this.$router.push('/')
      } catch (error) {
        this.toggleSnackbar({
          text: error.message ?? 'Ocurrió un error',
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
