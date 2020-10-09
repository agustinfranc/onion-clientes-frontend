<template>
  <v-snackbar v-model="snackbar" :color="snackbar.color" elevation="24">
    {{ snackbar.text }}

    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    snackbar: true,
  }),
  computed: {
    ...mapState(['snackbar'])
  },
  mounted() {
    console.log('Snackbar Mounted')
  }
}
</script>