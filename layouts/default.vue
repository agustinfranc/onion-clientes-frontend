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
            <v-list-item-title> Contraer </v-list-item-title>
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
          <v-card-title> Ajustes </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-switch
              v-model="$vuetify.theme.dark"
              inset
              :label="$vuetify.theme.dark ? 'Modo Oscuro' : 'Modo Claro'"
            ></v-switch>
          </v-card-text>
        </v-card>
        <v-card class="my-2">
          <v-card-text>
            <v-btn block @click.stop="logout">
              Salir
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
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
      settings: [],
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-book',
          title: 'Productos',
          to: '/products',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Onion',
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['logout']),
  },
}
</script>
