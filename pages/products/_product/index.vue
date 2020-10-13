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
              <v-text-field
                v-model="item.name"
                label="Nombre"
                :rules="[(v) => !!v || 'El nombre es requerido']"
                required
              ></v-text-field>

              <v-textarea
                v-model="item.description"
                label="Descripcion"
                counter
                maxlength="255"
                full-width
                auto-grow
                clearable
                single-line
              ></v-textarea>

              <v-text-field
                v-model="item.code"
                label="Codigo"
                type="number"
                :rules="[(v) => !!v || 'El codigo es requerido']"
                required
              ></v-text-field>

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
            </v-form>
          </v-col>
        </v-row>
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

  data: () => ({
    valid: true,
    search: '',
    item: '',
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

  head() {
    return {
      title: this.item.name,
    }
  },

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

        const res = await this.$axios.put(
          `api/auth/products/${this.item.id}`,
          this.item
        )

        this.toggleSnackbar({ text: 'Producto actualizado correctamente' })
      } catch (error) {
        this.toggleSnackbar({
          text: error ?? 'Ocurrió un error',
          color: 'red accent-4',
        })
      }
    },
    changeAvatar(event) {
      this.selectedFile = event.target.files[0]
      this.parseSelectedFile = URL.createObjectURL(this.selectedFile)
    },

    async refresh() {
      this.selectedFile = ''
      this.parseSelectedFile = ''

      await this.$fetch()

      this.toggleSnackbar({ text: 'Datos actualizados' })
    },
  },

  async fetch() {
    const url = `api/auth/products/${this.$route.params.product}`
    const res = await this.$nuxt.$axios.get(url)

    if (res.status !== 200) {
      this.toggleSnackbar({ text: 'Ocurrió un error', color: 'red accent-4' })
      return
    }

    this.item = res.data
    this.loading = false
  },
}
</script>
