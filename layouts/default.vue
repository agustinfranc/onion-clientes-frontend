<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item @click.stop="miniVariant = !miniVariant">
          <v-list-item-action>
            <v-icon
              >mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon
            >
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Collapse </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title v-text="title" />

      <v-spacer />

      <div>
        <v-select
          v-model="selectedCommerce"
          :items="commerces"
          label="Comercios"
          item-text="name"
          item-value="id"
          dense
          outlined
          solo
          return-object
          single-line
          :loading="loading"
        ></v-select>
      </div>

      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-container>
        <v-card>
          <v-card-title>{{ $t('settings') }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-switch
              v-model="$vuetify.theme.dark"
              inset
              :label="$vuetify.theme.dark ? 'Dark Mode' : 'Light Mode'"
            ></v-switch>

            <v-switch
              v-model="isSpanish"
              inset
              :label="$i18n.locale === 'es' ? 'Español' : 'English'"
            ></v-switch>
          </v-card-text>
        </v-card>
        <v-card class="my-2">
          <v-card-text>
            <v-btn block @click.stop="logout">
              {{ $t('logout') }}
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-navigation-drawer>

    <v-footer :absolute="!fixed" app>
      <div class="d-flex justify-space-between">
        <div class="text-left">
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </div>
        <div class="text-center">
          <span>
            made with
            <v-icon>mdi-heart</v-icon> by
            <router-link to="/">
              <span class="white--text text-decoration-none">Onion</span>
            </router-link>
          </span>
        </div>
        <div class="text-right">
          <a
            v-for="icon in icons"
            :key="icon.to"
            :href="icon.to"
            target="_blank"
          >
            <v-icon class="mx-1" size="24px">{{ icon.name }}</v-icon>
          </a>

          <v-tooltip v-for="locale in availableLocales" :key="locale.code" top>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                nuxt
                :to="switchLocalePath(locale.code)"
                v-on="on"
              >
                <v-icon
                  class="white--text text-decoration-none"
                  color="primary"
                >
                  mdi-translate
                </v-icon>
              </v-btn>
            </template>
            <span>{{ locale.name }}</span>
          </v-tooltip>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      loading: false,
      settings: [],
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: this.localePath('/'),
        },
        {
          icon: 'mdi-book',
          title: this.$t('products.title'),
          to: this.localePath('products'),
        },
        {
          icon: 'mdi-chart-bubble',
          title: this.$t('analytics.title'),
          to: this.localePath('inspire'),
        },
      ],
      icons: [
        { name: 'mdi-web', to: 'https://onion.ar' },
        { name: 'mdi-facebook', to: 'https://www.facebook.com/onion.com.ar' },
        {
          name: 'mdi-instagram',
          to: 'https://www.instagram.com/onion.com.ar/',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Onion',
    }
  },

  computed: {
    ...mapState(['user', 'commerce', 'commerces']),
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

  methods: {
    ...mapActions(['logout', 'saveCommerce']),
  },
}
</script>

<style>
.v-app-bar .v-text-field__details {
  display: none;
}

.v-footer > div {
  width: 100%;
}
</style>
