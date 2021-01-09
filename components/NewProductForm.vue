<template>
  <div>
    <v-dialog v-model="newItemDialog">
      <v-card>
        <v-card-title>{{ $t('products.new') }}</v-card-title>

        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="submit"
          >
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.code"
                    type="number"
                    :rules="codeRules"
                    :error-messages="errors.code"
                    :counter="4"
                    :label="$t('products.headers.code')"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.name"
                    :rules="[(v) => !!v || 'Name is required']"
                    :error-messages="errors.name"
                    :counter="255"
                    :label="$t('products.headers.name')"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="item.rubro"
                    :items="rubros"
                    :label="$t('products.headers.category')"
                    item-text="name"
                    item-value="id"
                    return-object
                    required
                    :rules="[(v) => !!v || 'Category is required']"
                    :error-messages="errors.rubro"
                    :loading="loading"
                    @change="setSubrubros"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-combobox
                    v-model="item.subrubro"
                    :items="subrubros"
                    :label="$t('products.headers.subcategory')"
                    required
                    :rules="[(v) => !!v || 'Subcategory is required']"
                    :error-messages="errors.subrubro"
                    item-text="name"
                    item-value="id"
                    return-object
                    :loading="loading"
                  ></v-combobox>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.price"
                    :error-messages="errors.price"
                    :label="$t('products.headers.price')"
                    prefix="$"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6" align-self="start">
                  <v-textarea
                    v-model="item.description"
                    :error-messages="errors.description"
                    :label="$t('products.headers.description')"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="submit"
              >
                {{ $t('save') }}
              </v-btn>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    newItemDialog: false,
    valid: true,
    loading: true,
    item: {
      code: '',
      name: '',
      rubro: '',
      subrubro: '',
      price: '',
      description: '',
    },
    rubros: [],
    subrubros: [],
    errors: {},
    codeRules: [
      (v) => !!v || 'Code is required',
      (v) => (v && v.length <= 4) || 'Code must be less than 4 characters',
    ],
  }),

  methods: {
    ...mapActions(['toggleSnackbar']),
    async submit() {
      if (!this.$refs.form.validate()) return

      try {
        const url = `api/auth/commerces/${this.$store.state.commerce.id}/products`

        const form = {
          ...this.item,
          rubro_id: this.item.rubro.id,
        }

        if (this.item.subrubro.id) form.subrubro_id = this.item.subrubro.id

        const res = await this.$axios.$post(url, form)

        this.$emit('product', res)

        this.newItemDialog = false

        this.toggleSnackbar({ text: this.$t('products.store') })
      } catch (error) {
        this.errors = error.response.data.errors ?? {}

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })

        setTimeout(() => this.$refs.form.resetValidation(), 3000)
      }
    },
    async newItem() {
      this.newItemDialog = true

      try {
        const url = `api/auth/rubros`
        const rubros = await this.$axios.$get(url)

        this.loading = false

        this.rubros = rubros
      } catch (error) {
        console.error(error.response ?? error)

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })
      }
    },
    setSubrubros() {
      this.subrubros = this.item.rubro.subrubros
    },
  },
}
</script>
