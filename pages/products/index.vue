<template>
  <div>
    <div class="d-flex mt-5">
      <div>
        <div class="display-1">Productos</div>
        <v-breadcrumbs
          class="pa-0 py-2"
          :items="breadcrumbItems"
        ></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="blue" @click.stop="$refs.foo.newItem()">Nuevo producto</v-btn>
    </div>
    <v-card>
      <v-card-title class="headline">
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
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
            :headers="headers"
            :items="body"
            item-key="name"
            class="elevation-1"
            :search="search"
            :loading="loading"
            loading-text="Cargando datos..."
            :footer-props="{
              showFirstLastPage: true,
            }"
          >
            <template v-slot:item.code="{ item }"> #{{ item.code }} </template>

            <template v-slot:item.name="{ item }">
              <v-avatar rounded size="30"
                ><img :src="item.avatar_dirname + item.avatar" alt=""
              /></v-avatar>
              <span class="ml-1">
                {{ item.name }}
              </span>
            </template>

            <template v-slot:item.rubro="{ item }">
              {{ item.subrubro.rubro.name }}
            </template>

            <template v-slot:item.subrubro="{ item }">
              {{ item.subrubro.name }}
            </template>

            <!-- #Edit dialog -->
            <template v-slot:item.price="props">
              <v-edit-dialog
                :return-value.sync="props.item.price"
                @save="savePrice(props.item)"
              >
                <v-chip> ${{ props.item.price }} </v-chip>
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.price"
                    label="Precio"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
              <v-chip v-for="(item, i) in props.item.product_prices" :key="i"
                >${{ item.price }}</v-chip
              >
            </template>

            <template v-slot:item.disabled="{ item }">
              <v-icon v-if="!item.disabled" color="green darken-2">
                mdi-check-circle
              </v-icon>
              <v-icon v-else> mdi-circle-outline </v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn text icon class="mr-2" nuxt :to="`/products/${item.id}`">
                <v-icon small> mdi-pencil </v-icon>
              </v-btn>
              <v-btn text icon @click="deleteItem(item)">
                <v-icon small> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Estás seguro que deseas eliminar {{ item.name }}?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = false"
                  >Cancelar</v-btn
                >
                <v-btn
                  :disabled="!btnDelete"
                  color="blue darken-1"
                  @click="deleteItemConfirm"
                  >Aceptar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-text>
    </v-card>

    <NewProductForm ref="foo" />

    <Snackbar />
  </div>
</template>

<script>
import commerceWatcher from '@/mixins/commerce-watcher'
import Snackbar from '@/components/Snackbar'
import NewProductForm from '@/components/NewProductForm'
import { mapActions } from 'vuex'

export default {
  components: {
    Snackbar,
    NewProductForm,
  },
  mixins: [commerceWatcher],

  async fetch() {
    this.loading = true

    const url = `api/auth/commerces/${this.$store.state.commerce.id}/products`
    const res = await this.$nuxt.$axios.get(url)

    if (res.status !== 200) {
      this.toggleSnackbar({ text: 'Ocurrió un error', color: 'red accent-4' })
      return
    }

    this.body = res.data
    this.loading = false
  },

  data: () => ({
    item: '',
    title: 'Productos',
    search: '',
    headers: [
      { text: 'Codigo', value: 'code' },
      { text: 'Nombre', value: 'name' },
      { text: 'Rubro', value: 'rubro' },
      { text: 'Subrubro', value: 'subrubro' },
      { text: 'Precio', value: 'price' },
      { text: 'Visible', value: 'disabled' },
      { text: 'Acciones', value: 'actions', sortable: false },
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
        to: '/',
        nuxt: true,
        exact: true,
      },
      {
        text: 'Productos',
        disabled: false,
      },
    ],
  }),

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
            text: error.message ?? 'Ocurrió un error',
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

        this.toggleSnackbar({ text: 'Precio actualizado' })
      } catch (error) {
        console.error(error.response ?? error)

        this.toggleSnackbar({
          text: error.response?.data?.message ?? 'Ocurrió un error',
          color: 'red accent-4',
        })
      }
    },
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style>
  .v-small-dialog__activator,
  .v-menu.v-small-dialog {
    display: inline;
  }
</style>