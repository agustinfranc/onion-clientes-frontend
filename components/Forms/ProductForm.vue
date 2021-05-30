<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
    <v-container>
      <v-row>
        <v-col cols="12" sm="4" md="3" class="align-self-start">
          <v-img
            v-if="!parseSelectedFile"
            lazy-src="https://picsum.photos/id/11/10/6"
            :src="
              item && item.avatar_dirname
                ? item.avatar_dirname + item.avatar
                : ''
            "
            class="rounded"
          ></v-img>
          <v-img
            v-else
            lazy-src="https://picsum.photos/id/11/10/6"
            :src="parseSelectedFile"
            class="rounded"
          ></v-img>
          <input
            ref="fileInput"
            class="mt-3 v-btn v-btn--block v-btn--contained theme--dark v-size--small accent"
            type="file"
            style="display: none"
            @change="changeAvatar"
          />
          <v-btn
            small
            block
            color="accent"
            class="mt-3"
            @click="$refs.fileInput.click()"
            >{{ $t('products.addAvatar') }}</v-btn
          >
        </v-col>

        <v-col cols="12" sm="8" md="9">
          <v-row>
            <v-col cols="12" sm="10" md="10">
              <v-text-field
                v-model="item.name"
                :rules="[(v) => !!v || 'Name is required']"
                :error-messages="errors.name"
                :counter="255"
                :label="$t('products.headers.name')"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="2" md="2">
              <v-text-field
                v-model="item.code"
                type="number"
                :error-messages="errors.code"
                :counter="4"
                :label="$t('products.headers.code')"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-textarea
                v-model="item.description"
                :error-messages="errors.description"
                :label="$t('products.headers.description')"
                rows="3"
                counter
                maxlength="255"
                clearable
                auto-grow
              ></v-textarea>
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

            <v-col cols="12">
              <v-text-field
                v-if="!getProductPrices().length"
                v-model="item.price"
                :error-messages="errors.price"
                :label="$t('products.headers.price')"
                prefix="$"
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>

              <h4 class="my-3">{{ $t('products.extraPrices') }}</h4>

              <template v-if="item.product_prices">
                <template v-for="(prices, index) in item.product_prices">
                  <v-row
                    :key="prices.id"
                    :class="{ 'd-none': prices.deleted_at }"
                  >
                    <v-col cols="10" sm="5"
                      ><v-text-field
                        :key="prices.id"
                        v-model="prices.name"
                        :label="$t('products.headers.name')"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="10" sm="5">
                      <v-text-field
                        :key="prices.id"
                        v-model="prices.price"
                        :label="$t('products.headers.price')"
                        prefix="$"
                        type="number"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="2" sm="2">
                      <v-btn small fab @click="deleteProductExtraPrice(index)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </template>
              </template>

              <v-btn small fab class="mb-3" @click="addProductExtraPrice"
                ><v-icon>mdi-plus</v-icon></v-btn
              >

              <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
              <h4 class="my-3">{{ $t('products.hashtags') }}</h4>

              <template v-if="item.product_hashtags">
                <template v-for="(hashtag, index) in item.product_hashtags">
                  <v-row
                    :key="hashtag.id"
                    :class="{ 'd-none': hashtag.deleted_at }"
                  >
                    <v-col cols="10" sm="5"
                      ><v-text-field
                        :key="hashtag.id"
                        v-model="hashtag.name"
                        :label="$t('products.headers.name')"
                        prefix="#"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="10" sm="5">
                      <v-text-field
                        :key="hashtag.id"
                        v-model="hashtag.to"
                        label="Código de producto"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="2" sm="2">
                      <v-btn small fab @click="deleteProductHashtag(index)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </template>
              </template>

              <v-btn small fab class="mb-3" @click="addProductHashtag"
                ><v-icon>mdi-plus</v-icon></v-btn
              >

              <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="item.disabled"
                :label="$t('products.headers.disabled')"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">
        {{ $t('save') }}
      </v-btn>

      <Snackbar />
    </v-container>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['productId'],

  data: () => ({
    valid: true,
    loading: true,
    item: {
      name: '',
      code: '',
      description: '',
      rubro: '',
      subrubro: '',
      price: '',
      disabled: false,
      product_prices: [],
      product_hashtags: [],
    },
    rubros: [],
    subrubros: [],
    selectedFile: '',
    parseSelectedFile: '',
    errors: {},
  }),

  async fetch() {
    if (!this.productId) return

    try {
      let url = `api/auth/products/${this.productId}`
      const res = await this.$axios.$get(url)

      this.item = {
        ...res,
        rubro: res.subrubro.rubro,
      }

      this.$emit('loaded', res)

      url = `api/auth/rubros`
      const rubros = await this.$axios.$get(url)

      this.rubros = rubros

      this.subrubros = rubros.find(
        (e) => e.id === this.item.subrubro.rubro_id
      ).subrubros

      this.loading = false
    } catch (error) {
      console.error(error.response ?? error)

      this.toggleSnackbar({
        text: error.response?.data?.message ?? 'Ocurrió un error',
        color: 'red accent-4',
      })
    }
  },

  methods: {
    ...mapActions(['toggleSnackbar']),

    Product() {
      return {
        name: '',
        code: '',
        description: '',
        rubro: '',
        subrubro: '',
        price: '',
        disabled: false,
        product_prices: [],
        product_hashtags: [],
      }
    },

    async submit() {
      if (!this.$refs.form.validate()) return

      this.valid = false

      try {
        const url = this.productId
          ? `api/auth/products/${this.productId}`
          : `api/auth/commerces/${this.$store.state.commerce.id}/products`

        const form = {
          ...this.item,
          rubro_id: this.item.rubro.id,
        }

        if (this.item.subrubro.id) form.subrubro_id = this.item.subrubro.id

        const res = this.productId
          ? await this.$axios.$put(url, form)
          : await this.$axios.$post(url, form)

        if (this.selectedFile) {
          const fd = new FormData()
          fd.append('image', this.selectedFile, this.selectedFile.name)

          await this.$axios.post(`api/auth/products/${res.id}/upload`, fd, {
            onUploadProgress: (uploadEvent) => {
              console.log(
                'Upload Progress',
                Math.round((uploadEvent.loaded / uploadEvent.total) * 100) + '%'
              )
            },
          })

          this.item.avatar = this.selectedFile.name

          this.toggleSnackbar({ text: 'Imagen subida correctamente' })
        }

        this.$emit('saved', res)

        this.$refs.form.reset()
        this.item = new this.Product()

        const text = this.productId
          ? this.$t('products.updated')
          : this.$t('products.stored')

        this.toggleSnackbar({ text })
      } catch (error) {
        this.errors = error.response.data.errors ?? {}

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })

        setTimeout(() => this.$refs.form.resetValidation(), 3000)
      } finally {
        this.valid = true
      }
    },

    async newItem() {
      try {
        const url = `api/auth/rubros`
        this.rubros = await this.$axios.$get(url)

        this.setSubrubros()

        this.loading = false
      } catch (error) {
        console.error(error.response ?? error)

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })
      }
    },

    setSubrubros() {
      if (this.item.rubro) {
        this.subrubros = this.item.rubro.subrubros
      }
    },

    changeAvatar(event) {
      if (
        !event.target.files[0] ||
        event.target.files[0].size >= 1048576 ||
        (event.target.files[0].type !== 'image/jpeg' &&
          event.target.files[0].type !== 'image/png' &&
          event.target.files[0].type !== 'image/webp' &&
          event.target.files[0].type !== 'image/gif' &&
          event.target.files[0].type !== 'image/tiff')
      ) {
        this.toggleSnackbar({
          text: this.$t('products.imageUploadError'),
          color: 'red accent-4',
        })

        return
      }

      this.selectedFile = event.target.files[0]
      this.parseSelectedFile = URL.createObjectURL(this.selectedFile)
    },

    getProductPrices() {
      return this.item.product_prices.filter((price) => !price.deleted_at)
    },

    addProductExtraPrice() {
      this.item.product_prices.push({ name: '', price: '', deleted_at: null })
    },

    deleteProductExtraPrice(index) {
      this.item.product_prices[index].deleted_at = Date.now()
    },

    addProductHashtag() {
      this.item.product_hashtags.push({ name: '', to: '', deleted_at: null })
    },

    deleteProductHashtag(index) {
      this.item.product_hashtags[index].deleted_at = Date.now()
    },

    async refresh() {
      this.selectedFile = ''
      this.parseSelectedFile = ''

      await this.$fetch()

      this.toggleSnackbar({ text: this.$t('fetched') })
    },
  },

  async mounted() {
    console.log('ProductForm Mounted')

    await this.newItem()
  },
}
</script>
