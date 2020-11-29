<template>
  <div>
    <div class="d-flex mt-5">
      <div>
        <div class="display-1">
          Editar Producto - {{ item.name ? item.name : '' }}
        </div>
        <v-breadcrumbs
          class="pa-0 py-2"
          :items="breadcrumbItems"
        ></v-breadcrumbs>
      </div>
    </div>
    <v-card>
      <v-card-title>
        Información
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
                >Editar Avatar</v-btn
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
                      label="Nombre"
                      :rules="[(v) => !!v || 'El nombre es requerido']"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="2" md="2">
                    <v-text-field
                      v-model="item.code"
                      label="Código"
                      type="number"
                      :rules="[(v) => !!v || 'El codigo es requerido']"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="10" md="10">
                    <v-textarea
                      v-model="item.description"
                      label="Descripción"
                      counter
                      maxlength="255"
                      clearable
                      auto-grow
                    ></v-textarea>
                  </v-col>

                  <v-col cols="6" sm="5" md="5">
                    <v-select
                      v-model="item.subrubro.rubro"
                      :items="rubros"
                      label="Rubro"
                      item-text="name"
                      item-value="id"
                      return-object
                      required
                      :rules="[(v) => !!v || 'Rubro is required']"
                      :error-messages="errors.rubro"
                      :loading="loading"
                      @change="setSubrubros"
                    ></v-select>
                  </v-col>

                  <v-col cols="6" sm="5" md="5">
                    <v-combobox
                      v-model="item.subrubro"
                      :items="subrubros"
                      label="Subrubro"
                      required
                      :rules="[(v) => !!v || 'Subrubro is required']"
                      :error-messages="errors.subrubro"
                      item-text="name"
                      item-value="id"
                      return-object
                      :loading="loading"
                    ></v-combobox>
                  </v-col>

                  <v-col cols="12" sm="10" md="10">
                    <v-text-field
                      v-model="item.price"
                      label="Precio"
                      prefix="$"
                      type="number"
                    ></v-text-field>

                    <v-checkbox
                      v-model="item.disabled"
                      label="Deshabilitado"
                    ></v-checkbox>

                    <v-btn
                      :disabled="!valid"
                      color="success"
                      class="mr-4"
                      type="submit"
                    >
                      Guardar
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

  async fetch() {
    try {
      let url = `api/auth/products/${this.$route.params.product}`
      const res = await this.$axios.get(url)

      this.item = res.data

      url = `api/auth/rubros`
      const rubros = await this.$axios.$get(url)

      this.rubros = rubros

      this.subrubros = rubros.find(e => e.id === this.item.subrubro.rubro_id).subrubros

      this.loading = false
    } catch (error) {
      console.error(error.response ?? error)

      this.toggleSnackbar({
        text: error.response?.data?.message ?? 'Ocurrió un error',
        color: 'red accent-4',
      })
    }
  },

  data: () => ({
    valid: true,
    search: '',
    item: '',
    rubros: [],
    subrubros: [],
    errors: {},
    loading: true,
    selectedFile: '',
    parseSelectedFile: '',
    breadcrumbItems: [
      {
        text: 'Dashboard',
        disabled: false,
        to: '/',
        nuxt: true,
        exact: true,
      },
      {
        text: 'Productos',
        disabled: false,
        to: '/products',
        nuxt: true,
        exact: true,
      },
      {
        text: 'Producto',
        disabled: false,
      },
    ],
  }),

  methods: {
    ...mapActions(['toggleSnackbar']),
    async submit() {
      if (!this.$refs.form.validate()) return

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
      } catch (error) {
        this.toggleSnackbar({
          text: error.response?.data?.message ?? 'Ocurrió un error',
          color: 'red accent-4',
        })
      }
    },
    changeAvatar(event) {
      this.selectedFile = event.target.files[0]
      this.parseSelectedFile = URL.createObjectURL(this.selectedFile)
    },

    setSubrubros() {
      console.log(this.item.subrubro)
      this.subrubros = this.item.subrubro.rubro.subrubros
      this.item.subrubro = this.subrubros[0] ?? {}
    },

    async refresh() {
      this.selectedFile = ''
      this.parseSelectedFile = ''

      await this.$fetch()

      this.toggleSnackbar({ text: 'Datos actualizados' })
    },
  },

  head() {
    return {
      title: this.item.name,
    }
  },
}
</script>
