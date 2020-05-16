<template>
  <div>
    <action-menu
      :items="menuItems"
      @upload="importDialog=true"
      @download="exportDialog=true"
    />
    <base-dialog :dialog="importDialog">
      <image-upload-form
        v-if="currentProject.project_type === 'Image2seq'"
        :upload-images="createImages"
        :read-meta="insertMetaData"
        :read-images="insertImages"
        :match="matchMetaAndImages"
        @close="importDialog=false"
      />
      <document-upload-form
        v-else
        :upload-document="uploadDocument"
        :formats="getImportFormat"
        @close="importDialog=false"
      />
    </base-dialog>
    <base-dialog :dialog="exportDialog">
      <document-export-form
        :export-document="exportDocument"
        :formats="getExportFormat"
        @close="exportDialog=false"
      />
    </base-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ActionMenu from '@/components/molecules/ActionMenu'
import BaseDialog from '@/components/molecules/BaseDialog'
import DocumentUploadForm from '@/components/organisms/documents/DocumentUploadForm'
import DocumentExportForm from '@/components/organisms/documents/DocumentExportForm'
import ImageUploadForm from '@/components/organisms/documents/ImageUploadForm'

export default {
  components: {
    ActionMenu,
    BaseDialog,
    DocumentUploadForm,
    DocumentExportForm,
    ImageUploadForm
  },

  data() {
    return {
      importDialog: false,
      exportDialog: false,
      menuItems: [
        { title: 'Import Dataset', icon: 'mdi-upload', event: 'upload' },
        { title: 'Export Dataset', icon: 'mdi-download', event: 'download' }
      ]
    }
  },

  computed: {
    ...mapGetters('projects', ['getImportFormat', 'getExportFormat', 'currentProject'])
  },

  created() {
    this.setCurrentProject(this.$route.params.id)
  },

  methods: {
    ...mapActions('documents', ['uploadDocument', 'exportDocument']),
    ...mapActions('projects', ['setCurrentProject']),
    ...mapActions('images', ['insertImages', 'insertMetaData', 'createImages', 'matchMetaAndImages'])
  }
}
</script>
