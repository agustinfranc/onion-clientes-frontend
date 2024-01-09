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
        <FormsProductForm
          ref="form"
          :product-id="$route.params.product"
          @loaded="setItem"
          @saved="goToProductList"
        />
      </v-card-text>
    </v-card>

    <Snackbar />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import commerceWatcher from '@/mixins/commerce-watcher'

export default {
  mixins: [commerceWatcher],

  data() {
    return {
      item: '',
      loading: true,
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

  head() {
    return {
      title: this.item.name,
    }
  },

  methods: {
    ...mapActions(['toggleSnackbar']),

    setItem(item) {
      this.item = item
      this.loading = false
    },

    refresh() {
      this.$refs.form.refresh()
    },

    goToProductList() {
      this.$router.push(this.localePath('products'))
    },
  },
}
</script>
