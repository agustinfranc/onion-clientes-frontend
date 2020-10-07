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

          <v-btn class="mr-4 my-2" @click="me"> me </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  name: 'login',
  layout: 'login',
  data: () => ({
    email: '',
    password: 'password',
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
    ...mapActions(['saveUser']),
    async submit() {
      if (this.$v.$invalid) return

      let form = {
        email: this.$v.email.$model,
        password: this.$v.password.$model,
      }

      axios.get('sanctum/csrf-cookie').then(() => {
        axios.post('login', form).then((res) => {
          if (res.status === 200) {
            this.saveUser(res.data)

            this.$router.push('/')
          }
        })
      })
    },
    async me() {
      axios.get('api/auth/me').then((res) => {
        console.log(res.data)
      })
    },
  },
  async asyncData({ store, $axios, redirect }) {
    if (!store.state.user) {
      return
    }

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
}
</script>
