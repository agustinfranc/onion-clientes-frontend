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
      <v-btn>Nuevo producto</v-btn>
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
      </v-card-title>
      <v-card-text>
        <div>
          <v-data-table
            :headers="headers"
            :loading="!body"
            :items="body"
            item-key="name"
            class="elevation-1"
            :search="search"
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

            <template v-slot:item.price="{ item }">
              <v-chip> ${{ item.price }} </v-chip>
            </template>

            <template v-slot:item.disabled="{ item }">
              <v-icon v-if="!item.disabled" color="green darken-2">
                mdi-check-circle
              </v-icon>
              <v-icon v-else> mdi-circle-outline </v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn text icon nuxt :to="`products/${item.id}`">
                <v-icon small class="mr-2"> mdi-pencil </v-icon>
              </v-btn>
              <v-btn text icon>
                <v-icon small> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},

  data: () => ({
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
    body: '',
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