<template>
  <a-card>
    <a-row>
      <a-col :span="24">
        <a-list :grid="{ gutter: 2}">
          <a-list-item>
            <h2>{{ $t('cms.settings.about.gallery') }}</h2>
          </a-list-item>
          <a-list-item>{{ $t('cms.settings.about.gallery.subtitle') }}</a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <div class="clearfix">
      <a-upload
        :customRequest="uploadImage"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < 16">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            {{ $t('button.upload') }}
          </div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%; padding:0px" :src="previewImage" />
      </a-modal>
    </div>
  </a-card>
</template>

<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: []
    }
  },
  methods: {
    async uploadImage (data) {
      const formData = new FormData()
      formData.append('file', data.file)
      const imageUrl = await getBase64(data.file)
      this.$store.dispatch('uploadFile', formData).then(res => {
        const formImage = {
          'created_at': '',
          'updated_at': '',
          'picture': {
            'url': 'string',
            'uuid': res.filename
          }
        }
        this.$store.dispatch('postGallery', formImage).then(rs => {
          this.fileList.push({
          uid: rs.gallery_id,
          name: res.filename,
          status: 'done',
          url: imageUrl
        })
        })
      }).catch(err => console.log(err))
    },
    getGalleries () {
      this.$store.dispatch('getGalleries').then(res => {
        this.fileList = res.map(el => ({
          ...el,
          uid: el.id,
          name: el.id,
          status: 'done',
          url: el.picture.url
          }))
      })
    },
    deleteGallery (id) {
      this.$store.dispatch('deleteGallery', id).then(res => {
        alert(res + 'deleted successfully')
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange (data) {
      console.log(data)
      if (data.file.status === 'removed') {
        this.deleteGallery(data.file.id)
        this.fileList = data.fileList
      }
    }
  },
  created () {
    this.getGalleries()
  }
}
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
