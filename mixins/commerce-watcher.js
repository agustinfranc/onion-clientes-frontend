import { mapState } from 'vuex'

export default {
  mounted() {
    console.log('CommerceWatcher Mounted')
  },

  computed: {
    ...mapState(['commerce']),
  },

  watch: {
    commerce(newValue) {
      this.$fetch()
    },
  },
}
