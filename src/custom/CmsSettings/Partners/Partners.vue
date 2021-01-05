<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row :gutter="[24, 24]">
        <h2>{{ $t('cms.settings.partners') }}</h2>
        <a-col :span="8">
          <a-tabs type="card">
            <a-tab-pane key="1" tab="Русский">
              <a-input v-model="partner.title.ru" :placeholder="$t('cms.settings.partners.title')"></a-input>
              <a-textarea
                class="my-1"
                v-model="partner.description.ru"
                :placeholder="$t('cms.settings.partners.text')"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
            <a-tab-pane key="2" tab="Uzbek">
              <a-input v-model="partner.title.uz" :placeholder="$t('cms.settings.partners.title')"></a-input>
              <a-textarea
                v-model="partner.description.uz"
                class="my-1"
                :placeholder="$t('cms.settings.partners.text')"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
            <a-tab-pane key="3" tab="English">
              <a-input v-model="partner.title.en" :placeholder="$t('cms.settings.partners.title')"></a-input>
              <a-textarea
                class="my-1"
                v-model="partner.description.en"
                :placeholder="$t('cms.settings.partners.text')"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col :span="16">
          <h2>{{ $t('cms.settings.partners.logo') }}</h2>
          <div class="clearfix">
            <a-upload
              :customRequest="uploadImage"
              list-type="picture-card"
              :file-list="partner.picture"
              @preview="handlePreview"
              @change="handleChange($event, partner.picture)"
            >
              <div>
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
        </a-col>
      </a-row>
      <a-row type="flex" justify="end">
        <a-col span="auto">
          <a-button type="grey" style="margin-right:6px">{{ $t('button.reset') }}</a-button>
          <a-button type="primary" @click="updatePartner">{{ $t('button.save') }}</a-button>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
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
      partner: {
        'description': {
          'en': '',
          'ru': '',
          'uz': ''
        },
        'id': '',
        'picture': [],
        'title': {
          'en': '',
          'ru': '',
          'uz': ''
        }
      }
    }
  },
  methods: {
       async uploadImage (data) {
        const formData = new FormData()
        formData.append('file', data.file)
        const url = await getBase64(data.file)
        this.$store.dispatch('uploadFile', formData).then(res => {
          console.log(res)
          this.partner.picture.push({
            uid: res.filename,
            name: res.filename,
            status: 'done',
            url: url
          })
        }).catch(err => console.log(err))
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
    handleChange (ev, fileList) {
      console.log(fileList)
      if (ev.file.status === 'removed') {
        alert('sda')
        this.partner.picture.splice(fileList.findIndex(er => er.name === ev.file.name), 1)
      }
    },
    getPartners () {
      this.$store.dispatch('getPartners').then(res => {
        this.partner = res[0]
        this.partner.picture = res[0].picture.map(el => (
          {
          uid: el.uuid,
          name: el.url,
          status: 'done',
          url: el.url
          }
        ))
      })
    },
    updatePartner () {
      const picture = this.partner.picture.map(el => ({ url: el.name, uuid: el.uid }))
      const form = { ...this.partner, picture: picture }
      this.$store.dispatch('updatePartner', form).then(res => {
        alert('updated successfully')
      })
    }
  },
  created () {
    this.getPartners()
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
