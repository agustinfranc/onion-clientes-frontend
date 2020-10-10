<template>
  <div>
    <v-snackbar
      v-model="snackbarData.display"
      :color="snackbarData.color"
      elevation="24"
      @input="closeSnackbar"
    >
      {{ snackbarData.text }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="closeSnackbar"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  computed: {
    snackbarData: {
      get: function () {
        return { ...this.$store.state.snackbar }
      },
    },
  },
  methods: {
    closeSnackbar() {
      this.$store.dispatch('toggleSnackbar', {
        display: false,
      })
    },
  },
}
</script>