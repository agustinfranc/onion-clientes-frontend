<template>
  <v-footer :absolute="!fixed" app>
    <div class="d-flex justify-space-between align-center">
      <div class="text-left">
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </div>
      <div class="text-center">
        <span>
          made with
          <v-icon>mdi-heart</v-icon> by
          <a href="https://onion.ar" target="_blank">
            <span class="white--text text-decoration-none">Onion</span>
          </a>
        </span>
      </div>
      <div class="text-right">
        <v-btn v-for="icon in icons" :key="icon.to" icon :href="icon.to">
          <v-icon class="white--text text-decoration-none" color="primary">
            {{ icon.name }}
          </v-icon>
        </v-btn>

        <v-tooltip v-for="locale in availableLocales" :key="locale.code" top>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              icon
              nuxt
              :to="switchLocalePath(locale.code)"
              v-on="on"
            >
              <v-icon class="white--text text-decoration-none" color="primary">
                mdi-translate
              </v-icon>
            </v-btn>
          </template>
          <span>{{ locale.name }}</span>
        </v-tooltip>
      </div>
    </div>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
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
