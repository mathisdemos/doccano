<template>
  <base-card
    :disabled="!valid"
    @agree="create"
    @cancel="cancel"
    title="Upload Data"
    agree-text="Upload"
    cancel-text="Cancel"
  >
    <template #content>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-alert
          v-show="showError"
          v-model="showError"
          type="error"
          dismissible
        >
          The file could not be uploaded. Maybe invalid format.
          Please check available formats carefully.
        </v-alert>
        <h2>Select images that you would like to upload</h2>
        <v-file-input
          :accept="acceptedImageTypes"
          :multiple="true"
          @change="images"
          :rules="uploadImageRules"
          label="Image input"
        />
        <h2>Select a file containing metadata for your uploaded images</h2>
        <p>
          You can upload a json file to add meta-info or labels to your images here. Specify the filename that you would like
          to add information to inside your json-file and fill out the fields for meta and labels. Omit this step if you just
          want to upload images without any meta-info.
        </p>
        <code class="mb-10 pa-5 highlight">
          [
          { "fileName": "img.jpg", "meta": {...}, "labels": ["label1"] },
          { "fileName": "img2.jpg", "meta": {...}, "labels": ["label2"] }
          ]
        </code>
        <v-file-input
          :disabled="!imagesUploaded"
          @change="meta"
          :accept="acceptedMetaType"
          label="Metadata input"
        />
      </v-form>
    </template>
  </base-card>
</template>

<script>
import BaseCard from '@/components/molecules/BaseCard'
import { uploadImageRules } from '@/rules/index'

export default {
  components: {
    BaseCard
  },
  props: {
    match: {
      type: Function,
      required: true
    },
    readMeta: {
      type: Function,
      required: true
    },
    readImages: {
      type: Function,
      required: true
    },
    uploadImages: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      valid: false,
      uploadImageRules,
      showError: false,
      imagesUploaded: false,
      acceptedImageTypes: '.png,.jpg',
      acceptedMetaType: '.json'
    }
  },

  methods: {
    cancel() {
      this.$emit('close')
    },
    validate() {
      return this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    create() {
      if (this.validate()) {
        this.uploadImages(this.$route.params.id)
      }
    },
    images(e) {
      this.readImages(e).then(() => {
        this.imagesUploaded = true
      })
    },
    meta(e) {
      this.readMeta(e).then(() => {
        this.match().then((errors) => {
          console.log(errors) // TODO: handle errors
        })
      })
    }
  }
}
</script>

<style scoped>
  .highlight {
    font-size: 100%;
    width: 100%;
  }
  .highlight:before {
    content: ''
  }
</style>
