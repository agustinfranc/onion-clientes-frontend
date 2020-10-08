<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card min-height="180">
        <v-card-title> Ventas </v-card-title>
        <v-card-text> No hay datos </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="8" md="6">
      <v-card min-height="180">
        <v-card-title class="headline"> Trafico </v-card-title>
        <v-card-text> No hay datos </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="8" md="6">
      <v-card min-height="510">
        <v-card-title class="headline"> Mi comercio </v-card-title>
        <v-card-text>
          <div class="my-2">
            <div class="text-h6">App Link</div>
            <a :href="`https://onion.com.ar/${commerce.name}`" target="_blank"
              >onion.com.ar/{{ commerce.name }}</a
            >
          </div>

          <v-row>
            <v-col cols="12" sm="4">
              <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                :src="`${commerce.assets_dirname}background.jpg`"
                max-height="90"
              ></v-img>
            </v-col>

            <v-col cols="12" sm="8">
              <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                :src="`${commerce.assets_dirname}background.jpg`"
                max-height="90"
              ></v-img>
            </v-col>

            <v-col cols="12" sm="4">
              <v-btn block color="accent">Editar Avatar</v-btn>
            </v-col>

            <v-col cols="12" sm="8">
              <v-btn block color="accent">Editar Portada</v-btn>
            </v-col>

            <v-col cols="12">
              <v-form ref="form" @submit.prevent="saveCommerce" v-model="valid">
                <v-text-field
                  :value="commerce.fullname"
                  label="Nombre"
                  @input="setFullname($event)"
                ></v-text-field>

                <v-checkbox
                  :value="commerce.with_slider"
                  label="Slider"
                  @change="setWithSlider($event)"
                ></v-checkbox>

                <p>
                  {{ $v.commerceFormData }}
                </p>

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
      </v-card>
    </v-col>

    <v-col cols="12" sm="8" md="6">
      <v-card min-height="510">
        <v-card-title class="headline">
          Productos
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            solo
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <div>
            <v-data-table
              :headers="headers"
              :items="body"
              :items-per-page="5"
              item-key="name"
              class="elevation-1"
              :search="search"
              :loading="loading"
              loading-text="Cargando datos..."
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar rounded size="30"
                  ><img :src="item.avatar_dirname + item.avatar" alt=""
                /></v-avatar>
              </template>

              <template v-slot:item.name="{ item }">
                <span class="ml-1">
                  {{ item.name }}
                </span>
              </template>

              <template v-slot:item.rubro="{ item }">
                {{ item.subrubro.rubro.name }}
              </template>

              <template v-slot:item.price="{ item }">
                <v-chip> ${{ item.price }} </v-chip>
              </template>

              <template v-slot:item.disabled="{ item }">
                <v-icon v-if="!item.disabled" color="green darken-2">
                  mdi-check-circle
                </v-icon>
                <v-icon v-else> mdi-circle-outline </v-icon>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import commerceWatcher from '@/mixins/commerce-watcher'
import { mapState, mapGetters } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  mixins: [commerceWatcher],

  data: () => ({
    valid: false,
    search: '',
    headers: [
      { text: '', value: 'avatar', sortable: false },
      { text: 'Nombre', value: 'name' },
      { text: 'Rubro', value: 'rubro' },
      { text: 'Precio', value: 'price' },
      { text: 'Visible', value: 'disabled' },
    ],
    body: [],
    loading: true,
  }),

  validations: {
    commerceFormData: {
      fullname: { required, minLength: minLength(6) },
      with_slider: { required },
    },
  },

  computed: {
    commerceFormData: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getCommerce))
      },
    },
  },

  methods: {
    setFullname(value) {
      this.commerceFormData.fullname = value
      this.$v.commerceFormData.fullname.$touch()
    },
    setWithSlider(value) {
      this.commerceFormData.with_slider = value
      this.$v.commerceFormData.with_slider.$touch()
    },
    saveCommerce() {
      console.log(this.$v.commerceFormData.$model)
    },
  },

  async fetch() {
    let url

    if (!this.$store.state.commerce) {
      url = `api/auth/commerces/first/products`
    } else {
      url = `api/auth/commerces/${this.$store.state.commerce.id}/products`
    }

    const res = await axios.get(url)

    if (res.status !== 200) {
      return
    }

    this.body = res.data
    this.loading = false
  },
}
</script>