import { mapState } from 'vuex'

export default {
  mounted() {
    console.log('with-mixin')
  },

  computed: {
    ...mapState(['commerce']),
  },

  watch: {
    commerce: function (newValue) {
      console.log('commerce', newValue)

      this.$fetch()
    },
  },
}
