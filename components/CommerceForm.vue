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

          <v-btn :disabled="!valid" color="success" class="mr-4" type="submit">
            Guardar
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapGetters } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    valid: false,
    loading: true,
  }),

  validations: {
    commerceFormData: {
      fullname: { required, minLength: minLength(6) },
      with_slider: { required },
    },
  },

  computed: {
    ...mapState(['commerce']),
    commerceFormData: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getCommerce))
      },
    },
  },

  methods: {
    setFullname(value) {
      console.log(value)
      this.commerceFormData.fullname = value
      this.$v.commerceFormData.fullname.$touch()
    },
    setWithSlider(value) {
      this.commerceFormData.with_slider = value
      this.$v.commerceFormData.with_slider.$touch()
    },
    saveCommerce() {
      console.log(this.$v.commerceFormData.$model)

      // send to axios
    },
  },
}
</script>