<template>
  <div>
    <a-card>
      <a-row type="flex" :gutter="16">
        <a-col :offset="2" :span="14">
          <a-divider orientation="left">
            {{ isNewForm ? 'Advantage create form' : 'Edit advantage form' }}
          </a-divider>
          <a-tabs type="card">
            <a-tab-pane key="1" tab="Русский">
              <a-input v-model="form.title.ru" placeholder="search something" class="my-1"></a-input>
              <a-textarea
                v-model="form.description.ru"
                :placeholder="$t('cms.settings.team.members.form.text.p')"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
            <a-tab-pane key="2" tab="Uzbek">
              <a-input v-model="form.title.uz" placeholder="search something" class="my-1"></a-input>
              <a-textarea
                v-model="form.description.uz"
                :placeholder="$t('cms.settings.team.members.form.text.p')"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
            <a-tab-pane key="3" tab="English">
              <a-input v-model="form.title.en" placeholder="search something" class="my-1"></a-input>
              <a-textarea
                v-model="form.description.en"
                :placeholder="$t('cms.settings.team.members.form.text.p')"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
          </a-tabs>
          <a-upload
            class="my-1"
            :customRequest="uploadImage"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                {{ $t('button.upload') }}
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          <a-row type="flex" justify="end">
            <a-col span="auto">
              <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
              <a-button @click="postAdvantage" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
              <a-button @click="updateAdvantage" v-else type="primary">{{ $t('button.save') }}</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      isNewForm: null,
      activeKey: '1',
      newTabIndex: 0,
      form: {
        'created_at': 'string',
        'description': {
          'en': 'string',
          'ru': 'string',
          'uz': 'string'
        },
        'picture': {
          'url': 'string',
          'uuid': 'string'
        },
        'title': {
          'en': 'string',
          'ru': 'string',
          'uz': 'string'
        },
        'updated_at': 'string'
      }
    }
  },
  methods: {

    uploadImage (data) {
      this.$uploadImage(data.file, this.fileList, this)
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      if (fileList.length === 0) { this.fileList = fileList }
    },
    postAdvantage () {
      this.form.picture = {
        url: '',
        uuid: this.fileList[0].uid
      }
      console.log(this.form)
      this.$store.dispatch('postAdvantage', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'Advantage', 'Advantage added successfully', this)
        this.$router.push('/cms-settings/about-us')
      })
    },
    getAdvantage (id) {
      this.$store.dispatch('getAdvantage', id).then(res => {
        console.log(res)
        this.form = res
        this.fileList = [{ uid: res.picture.uuid, status: 'done', name: res.picture.uuid, url: res.picture.url }]
      })
    },
    updateAdvantage () {
      this.form.picture.uuid = this.fileList[0].uid
      this.$store.dispatch('updateAdvantage', this.form).then(res => {
        this.$alertMessage('success', 'Advantage', 'Advantage has updated successfully', this)
        this.$router.push('/cms-settings/about-us')
      })
    },
    cancelPost () {
      this.$router.replace('/cms-settings/about-us')
    }
  },
  created () {
     if (this.$isNewForm(this.$route.params)) {
      this.isNewForm = true
    } else this.getAdvantage(this.$route.params.id)
  }
}
</script>

<style>

</style>
