<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-img height="200" src="/onion_blue.jpg"></v-img>

        <v-card-title>{{ $t('register.title') }}</v-card-title>

        <v-card-subtitle class="mt-3">{{
          $t('register.subtitle')
        }}</v-card-subtitle>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-text-field
              v-model.lazy="form.name"
              :rules="nameRules"
              :error-messages="errors.name"
              outlined
              :label="$t('register.user.headers.name')"
              required
            ></v-text-field>

            <v-text-field
              v-model.lazy="form.email"
              :rules="emailRules"
              :error-messages="errors.email"
              outlined
              :label="$t('register.user.headers.email')"
              required
            ></v-text-field>

            <v-text-field
              v-model.lazy="form.password"
              :rules="passwordRules"
              :error-messages="errors.password"
              outlined
              :label="$t('register.user.headers.password')"
              hint="At least 6 characters"
              required
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show = !show"
            ></v-text-field>

            <v-text-field
              v-model.lazy="form.password_confirmation"
              :rules="[
                (v) =>
                  v === form.password ||
                  'Password confirmation must be equal to password',
              ]"
              :error-messages="errors.password_confirmation"
              outlined
              :label="$t('register.user.headers.passwordConfirmation')"
              hint="Confirm password"
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
              {{ $t('next') }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <Snackbar />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import Snackbar from '@/components/Snackbar'

export default {
  name: 'Register',

  components: {
    Snackbar,
  },
  layout: 'login',

  data: () => ({
    title: 'Register',
    form: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    show: false,
    valid: true,
    errors: {},
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length > 3) || 'Name must be more than 3 characters',
    ],
    emailRules: [
      (v) => !!v || 'Email is required',
      (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
    ],
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length >= 6) || 'Password must be more than 6 characters',
    ],
  }),

  head() {
    return {
      title: this.title,
    }
  },

  methods: {
    ...mapActions(['saveToken', 'saveUser', 'toggleSnackbar']),
    async submit() {
      if (!this.$refs.form.validate()) return

      this.valid = false

      try {
        const res = await this.$axios.$post('api/register', this.form)

        if (res.error) {
          throw new Error(res.error)
        }

        this.saveUser(res)
        this.saveToken(res.token)

        this.$axios.setToken(res.token, 'Bearer')

        this.$router.push(this.localePath('register-commerce'))
      } catch (error) {
        this.errors = error.response.data.errors ?? {}

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })

        setTimeout(() => {
          this.$refs.form.resetValidation()

          this.valid = true
        }, 2000)
      }
    },
  },
}
</script>
