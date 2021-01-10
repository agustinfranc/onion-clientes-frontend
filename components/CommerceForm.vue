<template>
  <div>
    <div class="my-2">
      <div class="text-h6">App Link</div>
      <a :href="`https://onion.ar/${commerce.name}`" target="_blank"
        >onion.ar/{{ commerce.name }}</a
      >
    </div>

    <v-row>
      <v-col cols="12" sm="4">
        <v-img
          v-if="!parseSelectedFileAvatar"
          lazy-src="https://picsum.photos/id/11/10/6"
          :src="commerce.avatar_dirname"
          class="rounded"
        ></v-img>
        <v-img
          v-else
          lazy-src="https://picsum.photos/id/11/10/6"
          :src="parseSelectedFileAvatar"
          class="rounded"
        ></v-img>
        <input
          ref="fileInputAvatar"
          class="mt-3 v-btn v-btn--block v-btn--contained theme--dark v-size--small accent"
          type="file"
          style="display: none"
          @change="changeAvatar"
        />
      </v-col>

      <v-col cols="12" sm="8">
        <v-img
          v-if="!parseSelectedFileCover"
          lazy-src="https://picsum.photos/id/11/10/6"
          :src="commerce.cover_dirname"
          class="rounded"
        ></v-img>
        <v-img
          v-else
          lazy-src="https://picsum.photos/id/11/10/6"
          :src="parseSelectedFileCover"
          class="rounded"
        ></v-img>
        <input
          ref="fileInputCover"
          class="mt-3 v-btn v-btn--block v-btn--contained theme--dark v-size--small accent"
          type="file"
          style="display: none"
          @change="changeCover"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn block color="accent" @click="$refs.fileInputAvatar.click()">{{
          $t('dashboard.commerce.editAvatar')
        }}</v-btn>
      </v-col>

      <v-col cols="12" sm="8">
        <v-btn block color="accent" @click="$refs.fileInputCover.click()">{{
          $t('dashboard.commerce.editCover')
        }}</v-btn>
      </v-col>

      <v-col cols="12">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="commerceFormData.fullname"
            :rules="nameRules"
            label="Name"
          ></v-text-field>

          <v-btn :disabled="!valid" color="success" class="mr-4" type="submit">
            {{ $t('save') }}
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// Doc: https://vuetifyjs.com/en/components/forms

import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    selectedFileAvatar: '',
    selectedFileCover: '',
    parseSelectedFileAvatar: '',
    parseSelectedFileCover: '',
    valid: true,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 20) || 'Name must be less than 20 characters',
      (v) => (v && v.length > 3) || 'Name must be more than 3 characters',
    ],
  }),

  computed: {
    ...mapState(['commerce']),

    commerceFormData() {
      // return this.$store.getters.getCommerceFormData

      return { ...this.$store.state.commerce }
    },
  },

  methods: {
    ...mapActions(['toggleSnackbar']),

    async submit() {
      if (!this.$refs.form.validate()) return

      try {
        if (this.selectedFileAvatar || this.selectedFileCover) {
          const fd = new FormData()

          if (this.selectedFileAvatar)
            fd.append(
              'avatar',
              this.selectedFileAvatar,
              this.selectedFileAvatar.name
            )

          if (this.selectedFileCover)
            fd.append(
              'cover',
              this.selectedFileCover,
              this.selectedFileCover.name
            )

          await this.$axios.post(
            `api/auth/commerces/${this.commerceFormData.id}/upload`,
            fd,
            {
              onUploadProgress: (uploadEvent) => {
                console.log(
                  'Upload Progress',
                  Math.round((uploadEvent.loaded / uploadEvent.total) * 100) +
                    '%'
                )
              },
            }
          )

          this.toggleSnackbar({ text: this.$t('submitImage') })
        }

        const res = await this.$axios.$put(
          `api/auth/commerces/${this.commerceFormData.id}`,
          this.commerceFormData
        )

        this.$store.dispatch('saveCommerce', res)

        this.toggleSnackbar({ text: this.$t('dashboard.commerce.submit') })
      } catch (error) {
        console.error(error.response ?? error)

        this.toggleSnackbar({
          text: error.response?.data?.message ?? this.$t('error'),
          color: 'red accent-4',
        })
      }
    },
    changeAvatar(event) {
      this.selectedFileAvatar = event.target.files[0]
      this.parseSelectedFileAvatar = URL.createObjectURL(
        this.selectedFileAvatar
      )
    },
    changeCover(event) {
      this.selectedFileCover = event.target.files[0]
      this.parseSelectedFileCover = URL.createObjectURL(this.selectedFileCover)
    },
  },
}
</script>
