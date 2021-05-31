<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-img height="200" src="/onion_blue.jpg"></v-img>

        <v-card-title>{{ $t('register.commerce.title') }}</v-card-title>

        <v-card-subtitle class="mt-3">{{
          $t('register.commerce.subtitle')
        }}</v-card-subtitle>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-text-field
              v-model.lazy="form.fullname"
              :rules="[(v) => !!v || 'Fullname is required']"
              :error-messages="errors.fullname"
              outlined
              :label="$t('commerces.fullname')"
              hint="At least 8 characters"
              required
            ></v-text-field>

            <v-select
              v-model="form.currency"
              :items="currencies"
              :label="$t('commerces.currency')"
              item-text="name"
              item-value="id"
              return-object
              required
              :rules="[(v) => !!v || 'Currency is required']"
              :error-messages="errors.currency"
              :loading="loading"
              outlined
            >
            </v-select>

            <v-text-field
              v-model.lazy="form.whatsapp_number"
              :rules="[
                (v) =>
                  v.length < 20 ||
                  'Whatsapp number must be less than 20 characters',
              ]"
              :error-messages="errors.whatsapp_number"
              outlined
              :label="$t('commerces.whatsappNumber.label')"
              :placeholder="$t('commerces.whatsappNumber.placeholder')"
            ></v-text-field>

            <v-text-field
              v-model.lazy="form.instagram_account"
              :rules="[
                (v) =>
                  v.length < 30 || 'Instagram must be less than 30 characters',
              ]"
              :error-messages="errors.instagram_account"
              outlined
              :label="$t('commerces.instagramAccount.label')"
              :placeholder="$t('commerces.instagramAccount.placeholder')"
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
import { mapState, mapActions } from 'vuex'
import Snackbar from '@/components/Snackbar'

export default {
  name: 'Register',

  components: {
    Snackbar,
  },
  layout: 'login',

  middleware: 'auth',

  data: () => ({
    title: 'Register',
    form: {
      fullname: '',
      whatsapp_number: '',
      instagram_account: '',
      currency: '',
    },
    show: false,
    valid: true,
    loading: true,
    errors: {},
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 100) || 'Name must be less than 100 characters',
    ],
    currencies: [],
  }),

  async fetch() {
    try {
      const url = `api/auth/combos?combos=currencies`
      const res = await this.$axios.$get(url)

      this.currencies = res.currencies

      this.loading = false
    } catch (error) {
      console.error(error.response ?? error)

      this.toggleSnackbar({
        text: error.response?.data?.message ?? this.$t('error'),
        color: 'red accent-4',
      })
    }
  },

  head() {
    return {
      title: this.title,
    }
  },

  computed: {
    ...mapState(['user']),
  },

  methods: {
    ...mapActions([
      'saveToken',
      'saveUser',
      'saveCommerce',
      'saveCommerces',
      'toggleSnackbar',
    ]),
    async submit() {
      if (!this.$refs.form.validate()) return

      this.valid = false

      try {
        let res = await this.$axios.$post('api/auth/commerces', this.form)

        if (res.error) {
          throw new Error(res.error)
        }

        res = await this.$axios.$get('api/auth/me', this.form)

        console.log(res)

        this.saveCommerces(res.commerces ?? '')
        this.saveCommerce(res.commerces[0] ?? '')

        this.$router.push(this.localePath('index'))
      } catch (error) {
        this.errors = error.response.data.errors ?? {}

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })

        this.valid = true
      }
    },
  },
}
</script>
