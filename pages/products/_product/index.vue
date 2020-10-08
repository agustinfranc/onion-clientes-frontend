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
      <v-spacer></v-spacer>
      <v-btn text icon @click="refresh"><v-icon>mdi-reload</v-icon></v-btn>
    </div>
    <v-card>
      <v-card-title> Información </v-card-title>
      <v-card-text>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="2" md="2" class="align-self-start">
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              :src="
                item && item.avatar ? item.avatar_dirname + item.avatar : ''
              "
              class="rounded"
            ></v-img>
            <v-btn small block color="accent" class="mt-3">Editar Avatar</v-btn>
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
                :rules="[
                  (v) =>
                    (v && v.length <= 255) ||
                    'La descripcion debe ser menor de 255 characteres',
                ]"
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

            <v-snackbar
              v-model="snackbar"
              timeout="3000"
              color="green accent-4"
              elevation="24"
            >
              {{ snackbarText }}

              <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar = false">
                  Cerrar
                </v-btn>
              </template>
            </v-snackbar>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <div></div>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbarError"
      timeout="3000"
      color="red accent-4"
      elevation="24"
    >
      Ocurrió un error

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbarError = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import commerceWatcher from '@/mixins/commerce-watcher'

export default {
  mixins: [commerceWatcher],

  data: () => ({
    valid: true,
    snackbar: false,
    snackbarError: false,
    snackbarText: '',
    search: '',
    item: '',
    loading: true,
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
    submit() {
      console.log('submit!')

      if (!this.$refs.form.validate()) return

      console.log(this.item)

      axios
        .put(`api/auth/products/${this.item.id}`, this.item)
        .then((res) => {
          this.snackbarText = 'Producto actualizado correctamente'
          this.snackbar = true
        })
        .catch((error) => {
          this.snackbarError = true
        })
    },
    async refresh() {
      await this.$fetch()
      this.snackbarText = 'Datos actualizados'
      this.snackbar = true
    },
  },

  async fetch() {
    const url = `api/auth/products/${this.$route.params.product}`
    const res = await axios.get(url)

    if (res.status !== 200) {
      this.snackbarError = true
      return
    }

    this.item = res.data
    this.loading = false
  },
}
</script>