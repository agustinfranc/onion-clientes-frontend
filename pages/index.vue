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
            <a href="https://onion.com.ar/marlon" target="_blank"
              >onion.com.ar/marlon</a
            >
          </div>

          <v-row>
            <v-col cols="12" sm="4">
              <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                src="https://onion.com.ar/img/marlon/background.jpg"
                max-height="90"
              ></v-img>
            </v-col>

            <v-col cols="12" sm="8">
              <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                src="https://onion.com.ar/img/marlon/background.jpg"
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
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="commerce.fullname"
                  :rules="[(v) => !!v || 'Name is required']"
                  label="Nombre"
                  required
                ></v-text-field>

                <v-checkbox
                  v-model="commerce.withSlider"
                  label="Slider"
                ></v-checkbox>

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
export default {
  components: {},
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
    body: '',
    commerce: {
      fullname: 'Marlon Resto Bar',
      withSlider: true,
    },
  }),
  methods: {
    submit() {
      //
    },
  },
  async asyncData({ $axios }) {
    try {
      const url = `api/commerce/1/products`
      const res = await $axios.$get(url)

      return {
        body: res,
      }
    } catch (error) {
      console.log(error)
    }
  },
}
</script>