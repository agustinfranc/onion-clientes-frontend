<template>
  <div>
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
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="commerceFormData.fullname"
            :rules="nameRules"
            label="Nombre"
          ></v-text-field>

          <v-checkbox
            v-model="commerceFormData.with_slider"
            label="Slider"
          ></v-checkbox>

          <v-btn :disabled="!valid" color="success" class="mr-4" type="submit"> Guardar </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// Doc: https://vuetifyjs.com/en/components/forms

import axios from 'axios'
import { mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    valid: true,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 20) || 'Name must be less than 20 characters',
      (v) => (v && v.length > 3) || 'Name must be more than 3 characters',
    ],
  }),

  computed: {
    ...mapState(['commerce']),
    commerceFormData: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getCommerce))
      },
    },
  },

  methods: {
    submit() {
      console.log('submit!')

      if (!this.$refs.form.validate()) return

      console.log(this.commerceFormData)

      // send to axios
    },
  },
}
</script>