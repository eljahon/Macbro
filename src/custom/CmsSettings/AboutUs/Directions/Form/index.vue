<template>
  <div>
    <a-card>
      <a-row type="flex" :gutter="16">
        <a-col :offset="2" :span="14">
          <a-divider orientation="left">
            {{ isNewForm ? 'Feature create form' : 'Edit feature form' }}
          </a-divider>
          <a-tabs type="card">
            <a-tab-pane key="1" tab="Русский">
              <a-input v-model="form.title.ru" placeholder="search something" class="my-1"></a-input>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Uzbek">
              <a-input v-model="form.title.uz" placeholder="search something" class="my-1"></a-input>
            </a-tab-pane>
            <a-tab-pane key="3" tab="English">
              <a-input v-model="form.title.en" placeholder="search something" class="my-1"></a-input>
            </a-tab-pane>
          </a-tabs>
          <a-upload
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
          <a-button block type="dashed" @click="add" class="my-1">
            Новое описание
          </a-button>
          <a-tabs v-model="activeKey" :hide-add="true" type="editable-card" @edit="onEdit">
            <a-tab-pane v-for="(pane) in form.description" :key="pane.key" :tab="`Description - ${pane.key}`" :closable="true">
              <a-row>
                <a-col :span="24" class="my-2">
                  <a-tabs hide-add>
                    <a-tab-pane :key="23411" :tab="`Русский`" closable>
                      <a-row>
                        <a-col :span="24" class="my-2">
                          <a-textarea
                            v-model="pane.ru"
                            :placeholder="$t('cms.settings.team.members.form.text.p')"
                            :auto-size="{ minRows: 10, maxRows: 15 }"
                          />
                        </a-col>
                      </a-row>
                    </a-tab-pane>
                    <a-tab-pane :key="2344" :tab="`Uzbek`" closable>
                      <a-row>
                        <a-col :span="24" class="my-2">
                          <a-textarea
                            v-model="pane.uz"
                            :placeholder="$t('cms.settings.team.members.form.text.p')"
                            :auto-size="{ minRows: 10, maxRows: 15 }"
                          />
                        </a-col>
                      </a-row>
                    </a-tab-pane>
                    <a-tab-pane :key="332" :tab="`English`" closable>
                      <a-row>
                        <a-col :span="24" class="my-2">
                          <a-textarea
                            v-model="pane.en"
                            :placeholder="$t('cms.settings.team.members.form.text.p')"
                            :auto-size="{ minRows: 10, maxRows: 15 }"
                          />
                        </a-col>
                      </a-row>
                    </a-tab-pane>
                  </a-tabs>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
          <a-row type="flex" justify="end">
            <a-col span="auto">
              <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
              <a-button @click="postFeature" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
              <a-button @click="updateFeature" v-else type="primary">{{ $t('button.save') }}</a-button>
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
        'created_at': '',
        'description': [
          {
            'en': '',
            'ru': '',
            'uz': '',
             key: '1'
          }
        ],
        'picture': {
          'url': '',
          'uuid': ''
        },
        'title': {
          'en': '',
          'ru': '',
          'uz': ''
        },
        'updated_at': ''
      }
    }
  },
  methods: {
    getStats (e) {
      console.log(e)
    },
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
    callback (key) {
      // console.log(key)
    },
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    add () {
      const unique = `t${this.newTabIndex++}`
      this.form.description.push({
            'en': '',
            'ru': '',
            'uz': '',
             key: unique
          })
      this.activeKey = unique
    },
    remove (targetKey) {
      console.log(targetKey)
      this.form.description.splice(this.form.description.findIndex(el => el.key === targetKey), 1)
    },
    postFeature () {
      this.form.picture.uuid = this.fileList[0].uid
      console.log(this.form)
      this.$store.dispatch('postFeature', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'feature', 'feature added successfully', this)
        this.$router.push('/cms-settings/about-us')
      })
    },
    getFeature (id) {
      this.$store.dispatch('getFeature', id).then(res => {
        console.log(res)
        this.form = res
        this.activeKey = 't0'
        this.newTabIndex = this.form.description.length
        this.form.description = res.description.map((el, e) => ({ ...el, key: `t${e}` }))
        this.fileList = [{ uid: res.picture.uuid, status: 'done', name: res.picture.uuid, url: res.picture.url }]
      })
    },
    updateFeature () {
      this.form.picture.uuid = this.fileList[0].uid
      this.$store.dispatch('updateFeature', this.form).then(res => {
        this.$alertMessage('success', 'feature', 'feature has updated successfully', this)
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
    } else this.getFeature(this.$route.params.id)
  }
}
</script>

<style>

</style>
