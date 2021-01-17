<template>
  <div>
    <div class="d-flex mt-5">
      <div>
        <div class="display-1">
          {{ $t('edit') }} {{ $t('products.product') }} -
          {{ item.name ? item.name : '' }}
        </div>
        <v-breadcrumbs
          class="pa-0 py-2"
          :items="breadcrumbItems"
        ></v-breadcrumbs>
      </div>
    </div>
    <v-card>
      <v-card-title>
        {{ $t('details') }}
        <v-spacer></v-spacer>
        <v-btn text icon @click="refresh"><v-icon>mdi-reload</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <template v-if="item">
          <v-row justify="center" align="center">
            <v-col cols="12" sm="2" md="2" class="align-self-start">
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
                >{{ $t('products.editAvatar') }}</v-btn
              >
            </v-col>

            <v-col cols="12" sm="10" md="10">
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="submit"
              >
                <v-row justify="center" align="center">
                  <v-col cols="12" sm="8" md="8">
                    <v-text-field
                      v-model="item.name"
                      :label="$t('products.headers.name')"
                      :rules="[(v) => !!v || 'El nombre es requerido']"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="2" md="2">
                    <v-text-field
                      v-model="item.code"
                      :label="$t('products.headers.code')"
                      type="number"
                      :rules="codeRules"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="10" md="10">
                    <v-textarea
                      v-model="item.description"
                      :label="$t('products.headers.description')"
                      counter
                      maxlength="255"
                      clearable
                      auto-grow
                    ></v-textarea>
                  </v-col>

                  <v-col cols="6" sm="5" md="5">
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

                  <v-col cols="6" sm="5" md="5">
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

                  <v-col cols="12" sm="10" md="10">
                    <v-text-field
                      v-if="!getProductPrices().length"
                      v-model="item.price"
                      :label="$t('products.headers.price')"
                      prefix="$"
                      type="number"
                    ></v-text-field>

                    <v-divider></v-divider>

                    <h4 class="my-3">{{ $t('products.extraPrices') }}</h4>

                    <template v-if="item.product_prices">
                      <template v-for="(prices, index) in item.product_prices">
                        <v-row
                          :key="prices.id"
                          :class="prices.deleted_at ? 'd-none' : ''"
                        >
                          <v-col cols="10" sm="5"
                            ><v-text-field
                              :key="prices.id"
                              v-model="prices.name"
                              :label="prices.name"
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
                            <v-btn
                              small
                              fab
                              @click="deleteProductExtraPrice(index)"
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

                    <v-checkbox
                      v-model="item.disabled"
                      :label="$t('products.headers.disabled')"
                    ></v-checkbox>

                    <v-btn
                      :disabled="!valid"
                      color="success"
                      class="mr-4"
                      type="submit"
                    >
                      {{ $t('save') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
      <v-card-text>
        <div></div>
      </v-card-text>
    </v-card>

    <Snackbar />
  </div>
</template>

<script>
import commerceWatcher from '@/mixins/commerce-watcher'
import Snackbar from '@/components/Snackbar'
import { mapActions } from 'vuex'

export default {
  components: {
    Snackbar,
  },
  mixins: [commerceWatcher],

  data() {
    return {
      valid: true,
      search: '',
      item: '',
      rubros: [],
      subrubros: [],
      codeRules: [
        (v) =>
          !v || (v && v.length <= 4) || 'Code must be less than 4 characters',
      ],
      errors: {},
      loading: true,
      selectedFile: '',
      parseSelectedFile: '',
      breadcrumbItems: [
        {
          text: 'Dashboard',
          disabled: false,
          to: this.localePath('index'),
          nuxt: true,
          exact: true,
        },
        {
          text: this.$t('products.title'),
          disabled: false,
          to: this.localePath('products'),
          nuxt: true,
          exact: true,
        },
        {
          text: this.$t('products.product'),
          disabled: false,
        },
      ],
    }
  },

  async fetch() {
    try {
      let url = `api/auth/products/${this.$route.params.product}`
      const res = await this.$axios.get(url)

      this.item = {
        ...res.data,
        rubro: res.data.subrubro.rubro,
      }

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

  head() {
    return {
      title: this.item.name,
    }
  },

  methods: {
    ...mapActions(['toggleSnackbar']),

    async submit() {
      if (!this.$refs.form.validate()) return

      this.valid = false

      try {
        if (this.selectedFile) {
          const fd = new FormData()
          fd.append('image', this.selectedFile, this.selectedFile.name)

          await this.$axios.post(
            `api/auth/products/${this.$route.params.product}/upload`,
            fd,
            {
              onUploadProgress: (uploadEvent) => {
                console.log(
                  'Upload Progress',
                  Math.round((uploadEvent.loaded / uploadEvent.total) * 100) +
                    '%'
                )
              },
            }
          )

          this.item.avatar = this.selectedFile.name

          this.toggleSnackbar({ text: 'Imagen subida correctamente' })
        }

        await this.$axios.put(`api/auth/products/${this.item.id}`, this.item)

        this.toggleSnackbar({ text: 'Producto actualizado correctamente' })

        this.$router.push(this.localePath('products'))
      } catch (error) {
        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })
      } finally {
        this.valid = true
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

      console.log(this.selectedFile)

      this.parseSelectedFile = URL.createObjectURL(this.selectedFile)
    },

    setSubrubros() {
      this.subrubros = this.item.rubro.subrubros
      this.item.subrubro = this.subrubros[0] ?? {}
    },

    addProductExtraPrice() {
      this.item.product_prices.push({ name: '', price: '', deleted_at: null })
    },

    deleteProductExtraPrice(index) {
      this.item.product_prices[index].deleted_at = Date.now()
    },

    getProductPrices() {
      return this.item.product_prices.filter((price) => !price.deleted_at)
    },

    async refresh() {
      this.selectedFile = ''
      this.parseSelectedFile = ''

      await this.$fetch()

      this.toggleSnackbar({ text: 'Datos actualizados' })
    },
  },
}
</script>
