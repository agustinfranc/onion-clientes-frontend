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
      <v-btn class="blue" @click.stop="newItem">Nuevo producto</v-btn>
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
            </template>

            <template v-slot:item.disabled="{ item }">
              <v-icon v-if="!item.disabled" color="green darken-2">
                mdi-check-circle
              </v-icon>
              <v-icon v-else> mdi-circle-outline </v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn text icon nuxt :to="`/products/${item.id}`">
                <v-icon small class="mr-2"> mdi-pencil </v-icon>
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

    <v-dialog v-model="newItemDialog">
      <v-card>
        <v-card-title>Nuevo Producto</v-card-title>

        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="submit"
          >
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.code"
                    type="number"
                    :rules="codeRules"
                    :error-messages="errors.code"
                    :counter="4"
                    label="Codigo"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.name"
                    :rules="[(v) => !!v || 'Name is required']"
                    :error-messages="errors.name"
                    :counter="255"
                    label="Nombre"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="item.rubro"
                    :items="rubros"
                    label="Rubro"
                    item-text="name"
                    item-value="id"
                    return-object
                    required
                    :rules="[(v) => !!v || 'Rubro is required']"
                    :error-messages="errors.rubro"
                    :loading="loading"
                    @change="setSubrubros"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-combobox
                    v-model="item.subrubro"
                    :items="subrubros"
                    label="Subrubro"
                    required
                    :rules="[(v) => !!v || 'Subrubro is required']"
                    :error-messages="errors.subrubro"
                    item-text="name"
                    item-value="id"
                    return-object
                    :loading="loading"
                  ></v-combobox>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.price"
                    :error-messages="errors.price"
                    label="Precio"
                    prefix="$"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6" align-self="start">
                  <v-textarea
                    v-model="item.description"
                    :error-messages="errors.description"
                    label="Descripcion"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="submit"
              >
                Submit
              </v-btn>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

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
    newItemDialog: false,
    valid: true,
    item: '',
    title: 'Productos',
    search: '',
    rubros: [],
    subrubros: [],
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
    errors: {},
    codeRules: [
      (v) => !!v || 'Code is required',
      (v) => (v && v.length <= 4) || 'Code must be less than 4 characters',
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
          text: error.response.data.message ?? 'Ocurrió un error',
          color: 'red accent-4',
        })
      }
    },
    async newItem() {
      this.newItemDialog = true

      try {
        const url = `api/auth/rubros`
        const rubros = await this.$axios.$get(url)

        this.rubros = rubros
      } catch (error) {
        console.error(error.response ?? error)

        this.toggleSnackbar({
          text: error.response.data.message ?? 'Ocurrió un error',
          color: 'red accent-4',
        })
      }
    },
    setSubrubros() {
      this.subrubros = this.item.rubro.subrubros
    },
    async submit() {
      if (!this.$refs.form.validate()) return

      try {
        const url = `api/auth/commerces/${this.$store.state.commerce.id}/products`

        const form = {
          ...this.item,
          rubro_id: this.item.rubro.id,
        }

        if (this.item.subrubro.id) form.subrubro_id = this.item.subrubro.id

        await this.$axios.$post(url, form)

        this.toggleSnackbar({ text: 'Producto nuevo cargado correctamente' })
      } catch (error) {
        console.error(error.response ?? error)

        this.errors = error.response.data.errors ?? {}

        this.toggleSnackbar({
          text: error.response.data.message ?? 'Ocurrió un error',
          color: 'red accent-4',
        })

        setTimeout(() => this.$refs.form.resetValidation(), 3000)
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
