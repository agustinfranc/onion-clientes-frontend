<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Login
        </v-card-title>

        <v-card-text>
          <p>{{ user }}</p>

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
              required
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
import { required, email, minLength } from 'vuelidate/lib/validators'
import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/'

export default {
  data: () => ({
    user: '',
    email: 'treva29@example.net',
    password: 'password',
  }),
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Debe ser un email valido')
      !this.$v.email.required && errors.push('El email es requerido')
      return errors
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required)
        errors.push("La contraseña es un campo obligatorio");
      if (!this.$v.password.minLength)
        errors.push("Debe escribir una contraseña de más de 6 digitos");
      return errors;
    }
  },
  methods: {
    async submit() {
      if (this.$v.$invalid) return;

      let form = {
        email: this.$v.email.$model,
        password: this.$v.password.$model,
      };

      axios.get('sanctum/csrf-cookie').then(() => {
        axios.post('login', form).then((res) => {
          console.log(res.data);
          if (res.status === 200) this.$router.push('/');
        })
      })
    },
    async me() {
      axios.get('api/auth/me').then((res) => {
        console.log(res.data);
      })
    }
  },
}
</script>
