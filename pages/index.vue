<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card min-height="180">
        <v-card-title> {{ $t('dashboard.sells.title') }} </v-card-title>
        <v-card-text> No data </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="8" md="6">
      <v-card min-height="180">
        <v-card-title class="headline">
          {{ $t('dashboard.traffic.title') }}
        </v-card-title>
        <v-card-text> No data </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="8" md="6">
      <v-card min-height="510">
        <v-card-title class="headline">
          {{ $t('dashboard.commerce.title') }}
        </v-card-title>
        <v-card-text>
          <FormsCommerceForm v-if="!$fetchState.pending" />
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="8" md="6">
      <v-card min-height="510">
        <v-card-title class="headline">
          <nuxt-link
            :to="localePath('products')"
            class="text-decoration-none white--text"
            >{{ $t('dashboard.products.title') }}</nuxt-link
          >
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('search')"
            solo
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <div>
            <v-data-table
              :headers="headers"
              :items="products"
              :items-per-page="5"
              item-key="name"
              class="elevation-1"
              :search="search"
              :loading="loading"
              loading-text="Cargando datos..."
            >
              <template #item.avatar="{ item }">
                <v-avatar rounded size="30"
                  ><img
                    :src="`${item.avatar_dirname}${
                      item.avatar ? item.avatar : ''
                    }`"
                    alt=""
                /></v-avatar>
              </template>

              <template #item.name="{ item }">
                <span class="ml-1">
                  {{ item.name }}
                </span>
              </template>

              <template #item.rubro="{ item }">
                {{ item.subrubro.rubro.name }}
              </template>

              <template #item.price="{ item }">
                <v-chip> ${{ item.price }} </v-chip>
              </template>

              <template #item.disabled="{ item }">
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
import { mapActions } from 'vuex'

export default {
  mixins: [commerceWatcher],

  data() {
    return {
      title: 'Dashboard',
      valid: false,
      search: '',
      headers: [
        {
          text: this.$t('dashboard.products.headers.avatar'),
          value: 'avatar',
          sortable: false,
        },
        { text: this.$t('dashboard.products.headers.name'), value: 'name' },
        {
          text: this.$t('dashboard.products.headers.category'),
          value: 'rubro',
        },
        { text: this.$t('dashboard.products.headers.price'), value: 'price' },
        {
          text: this.$t('dashboard.products.headers.visible'),
          value: 'disabled',
        },
      ],
      products: [],
      loading: true,
    }
  },

  async fetch() {
    try {
      let url = `api/auth/commerces/${this.$store.state.commerce.id}`
      const res = await this.$nuxt.$axios.$get(url)
      this.$store.dispatch('saveCommerce', res)

      url = `api/auth/commerces/${this.$store.state.commerce.id}/products`
      this.products = await this.$nuxt.$axios.$get(url)
    } catch (error) {
      this.toggleSnackbar({ text: 'Ocurrió un error', color: 'red accent-4' })
    } finally {
      this.loading = false
    }
  },

  head() {
    return {
      title: this.title,
    }
  },

  methods: {
    ...mapActions(['toggleSnackbar']),
  },
}
</script>

<style>
.v-card__title > a:hover {
  font-size: 1.7rem !important;
}
</style>
