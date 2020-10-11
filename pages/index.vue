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
          <CommerceForm />
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="8" md="6">
      <v-card min-height="510">
        <v-card-title class="headline">
          <nuxt-link to="/products" class="text-decoration-none white--text"
            >Productos</nuxt-link
          >
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

      <Snackbar />
    </v-col>
  </v-row>
</template>

<script>
import commerceWatcher from '@/mixins/commerce-watcher'
import CommerceForm from '@/components/CommerceForm'
import { mapActions } from 'vuex'

export default {
  mixins: [commerceWatcher],

  components: {
    CommerceForm,
  },

  head() {
    return {
      title: this.title,
    }
  },

  data: () => ({
    title: 'Dashboard',
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

  methods: {
    ...mapActions(['toggleSnackbar']),
  },

  async fetch() {
    try {
      const url = `api/auth/commerces/${this.$store.state.commerce.id}/products`
      const res = await this.$nuxt.$axios.$get(url)
      this.body = res
    } catch (error) {
      this.toggleSnackbar({ text: 'Ocurrió un error', color: 'red accent-4' })
    }
    finally {
      this.loading = false
    }
  },
}
</script>

<style>
.v-card__title > a:hover {
  font-size: 1.7rem !important;
}
</style>