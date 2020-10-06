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
      <v-btn text icon><v-icon>mdi-reload</v-icon></v-btn>
    </div>
    <v-card>
      <v-card-title> Información </v-card-title>
      <v-card-text>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="2" md="2" class="align-self-start">
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              :src="item ? item.avatar_dirname + item.avatar : ''"
              class="rounded"
            ></v-img>
            <v-btn small block color="accent" class="mt-3">Editar Avatar</v-btn>
          </v-col>
          <v-col cols="12" sm="10" md="10">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="item.name"
                :rules="[(v) => !!v || 'Name is required']"
                label="Nombre"
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
              ></v-text-field>

              <v-text-field
                v-model="item.price"
                label="Precio"
                prefix="$"
                type="number"
              ></v-text-field>

              <v-checkbox v-model="item.disabled" label="Visible"></v-checkbox>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="submit"
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  components: {},
  data: () => ({
    valid: '',
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
      //
    },
  },

  async fetch() {
    const url = `api/commerce/1/products/${this.$route.params.product}`
    const res = await axios.get(url)

    if (res.status !== 200) {
      return
    }

    this.item = res.data
    this.loading = false
  },
}
</script>