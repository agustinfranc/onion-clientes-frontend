<template>
  <v-app>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  components: {
    Footer,
  },

  data() {
    return {
      icons: [
        { name: 'mdi-web', to: 'https://onion.ar' },
        { name: 'mdi-facebook', to: 'https://www.facebook.com/onion.com.ar' },
        {
          name: 'mdi-instagram',
          to: 'https://www.instagram.com/onion.com.ar/',
        },
      ],
    }
  },

  computed: {
    selectedCommerce: {
      get() {
        return { ...this.$store.state.commerce }
      },
      set(value) {
        this.saveCommerce(value)
      },
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    isSpanish: {
      get() {
        return this.$i18n.locale === 'es'
      },
      set(switchState) {
        switchState
          ? this.$router.push(this.switchLocalePath('es'))
          : this.$router.push(this.switchLocalePath('en'))
      },
    },
  },
}
</script>
