<template>
  <div>
    <div class="d-flex mt-5">
      <div>
        <div class="display-1">{{ $t('products.title') }}</div>
        <v-breadcrumbs
          class="pa-0 py-2"
          :items="breadcrumbItems"
        ></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="blue" @click.stop="openNewItemDialog()">{{
        $t('products.new')
      }}</v-btn>
    </div>
    <v-card>
      <v-card-title class="headline">
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('search')"
          solo
          single-line
          hide-details
        ></v-text-field>

        <v-btn text icon class="ml-3" @click="refresh"
          ><v-icon>mdi-reload</v-icon></v-btn
        >
      </v-card-title>

      <v-card-text>
        <div>
          <v-data-table
            class="elevation-1"
            loading-text="Cargando datos..."
            :headers="headers"
            :items="body"
            :search="search"
            :loading="loading"
            :footer-props="{
              showFirstLastPage: true,
            }"
          >
            <template #item.code="{ item }"> #{{ item.code }} </template>

            <template #item.name="{ item }">
              <v-avatar rounded size="30"
                ><img
                  :src="`${item.avatar_dirname}${
                    item.avatar ? item.avatar : ''
                  }`"
                  alt=""
              /></v-avatar>
              <span class="ml-1">
                {{ item.name }}
              </span>
            </template>

            <template #item.rubro="{ item }">
              {{ item.subrubro.rubro.name }}
            </template>

            <template #item.subrubro="{ item }">
              {{ item.subrubro.name }}
            </template>

            <!-- #Edit dialog -->
            <template #item.price="props">
              <v-edit-dialog
                v-if="!props.item.product_prices.length"
                :return-value.sync="props.item.price"
                @save="savePrice(props.item)"
              >
                <v-chip> ${{ props.item.price }} </v-chip>
                <template #input>
                  <v-text-field
                    v-model="props.item.price"
                    label="Price"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
              <v-chip v-for="(item, i) in props.item.product_prices" :key="i"
                >${{ item.price }}</v-chip
              >
            </template>

            <template #item.disabled="{ item }">
              <v-icon v-if="!item.disabled" color="green darken-2">
                mdi-check-circle
              </v-icon>
              <v-icon v-else> mdi-circle-outline </v-icon>
            </template>

            <template #item.actions="{ item }">
              <v-btn
                text
                icon
                class="mr-2"
                nuxt
                :to="
                  localePath({
                    name: 'products-product',
                    params: { product: item.id },
                  })
                "
              >
                <v-icon small> mdi-pencil </v-icon>
              </v-btn>
              <v-btn text icon @click="deleteItem(item)">
                <v-icon small> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">{{
                $t('products.dialogDelete.title', { msg: item.name })
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialogDelete = false"
                  >{{ $t('products.dialogDelete.cancel') }}</v-btn
                >
                <v-btn
                  :disabled="!btnDelete"
                  color="blue darken-1"
                  @click="deleteItemConfirm"
                  >{{ $t('products.dialogDelete.confirm') }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog :key="key" v-model="newItemDialog">
      <div>
        <v-card>
          <v-card-title>{{ $t('products.new') }}</v-card-title>

          <v-card-text>
            <FormsProductForm ref="form" @saved="addItemToList" />
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>

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
      key: 0,
      title: 'Products',
      search: '',
      newItemDialog: false,
      headers: [
        { text: this.$t('products.headers.code'), value: 'code' },
        { text: this.$t('products.headers.name'), value: 'name' },
        {
          text: this.$t('products.headers.category'),
          value: 'subrubro.rubro.name',
        },
        {
          text: this.$t('products.headers.subcategory'),
          value: 'subrubro.name',
        },
        { text: this.$t('products.headers.price'), value: 'price' },
        { text: this.$t('products.headers.visible'), value: 'disabled' },
        {
          text: this.$t('products.headers.actions'),
          value: 'actions',
          sortable: false,
        },
      ],
      body: [],
      item: {
        code: '',
        name: '',
        rubro: '',
        subrubro: '',
        price: '',
        description: '',
      },
      loading: true,
      btnDelete: true,
      dialogDelete: false,
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
        },
      ],
    }
  },

  async fetch() {
    this.loading = true

    const url = `api/auth/commerces/${this.$store.state.commerce.id}/products`
    const res = await this.$nuxt.$axios.get(url)

    if (res.status !== 200) {
      this.toggleSnackbar({ text: this.$t('error'), color: 'red accent-4' })
      return
    }

    this.body = res.data
    this.loading = false
  },

  head() {
    return {
      title: this.title,
    }
  },

  watch: {
    dialogDelete(val) {
      val || (this.dialogDelete = false)
    },
  },

  methods: {
    ...mapActions(['toggleSnackbar']),
    deleteItem(item) {
      this.item = item
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.btnDelete = false

      this.$axios
        .delete(`api/auth/products/${this.item.id}`)
        .then((res) => {
          this.dialogDelete = false

          this.toggleSnackbar({ text: 'Producto eliminado correctamente' })

          this.$fetch()
        })
        .catch((error) => {
          this.toggleSnackbar({
            text: error.message ?? this.$t('error'),
            color: 'red accent-4',
          })
        })
        .finally(() => (this.btnDelete = true))
    },
    async refresh() {
      await this.$fetch()

      this.toggleSnackbar({ text: 'Datos actualizados' })
    },
    async savePrice(item) {
      try {
        await this.$axios.put(`api/auth/products/${item.id}`, item)

        this.toggleSnackbar({ text: 'Price actualizado' })
      } catch (error) {
        console.error(error.response ?? error)

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })
      }
    },
    addItemToList(item) {
      this.newItemDialog = false

      this.body.push(item)
    },

    openNewItemDialog() {
      this.newItemDialog = true
      this.key++ // forces re-render of v-dialog

      if (this.$refs.form) this.$refs.form.newItem()
    },
  },
}
</script>

<style>
.v-small-dialog__activator,
.v-menu.v-small-dialog {
  display: inline;
}

.v-chip {
  margin: 1px 0;
}
</style>
