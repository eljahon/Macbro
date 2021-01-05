<template>
  <a-card>
    <a-row type="flex">
      <a-col :span="24">
        <h2>{{ $t('cms.settings.team') }}</h2>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false">
          <a-tabs type="card">
            <a-tab-pane key="1" tab="Русский">
              <a-row>
                <a-col :span="24">
                  <label >Краткое название центра</label>
                  <a-input
                    v-model="form.title.ru"
                    :placeholder="$t('cms.settings.team.members.form.title.p')"
                  ></a-input>
                </a-col>
                <a-col :span="24" class="my-2">
                  <a-textarea
                    v-model="form.description.ru"
                    :placeholder="$t('cms.settings.team.members.form.text.p')"
                    :auto-size="{ minRows: 10, maxRows: 15 }"
                  />
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Uzbek">
              <a-row>
                <a-col :span="24">
                  <label >Краткое название центра</label>
                  <a-input
                    v-model="form.title.uz"
                    :placeholder="$t('cms.settings.team.members.form.title.p')"
                  ></a-input>
                </a-col>
                <a-col :span="24" class="my-2">
                  <a-textarea
                    v-model="form.description.uz"
                    :placeholder="$t('cms.settings.team.members.form.text.p')"
                    :auto-size="{ minRows: 10, maxRows: 15 }"
                  />
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="3" tab="English">
              <a-row>
                <a-col :span="24">
                  <label >Краткое название центра</label>
                  <a-input
                    v-model="form.title.en"
                    :placeholder="$t('cms.settings.team.members.form.title.p')"
                  ></a-input>
                </a-col>
                <a-col :span="24" class="my-2">
                  <a-textarea
                    v-model="form.description.en"
                    :placeholder="$t('cms.settings.team.members.form.text.p')"
                    :auto-size="{ minRows: 10, maxRows: 15 }"
                  />
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card :bordered="false">
          <a-row type="flex" justify="space-between">
            <a-col span="24">
              <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit">
                <a-tab-pane v-for="pane in form.links" :key="pane.tabKey" :tab="pane.name" :closable="pane.closable">
                  <label >URL сайта</label>
                  <a-input class="mb-10" v-model="pane.url"></a-input>
                  <a-upload
                    :customRequest="uploadIcon"
                    list-type="picture-card"
                    class="my-1"
                    :file-list="pane.fileListIcon"
                    @preview="handlePreviewIcon"
                    @change="handleChangeIcon($event, pane)"
                  >
                    <div v-if="pane.fileListIcon.length < 1">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">
                        {{ $t('button.upload') }}
                      </div>
                    </div>
                  </a-upload>
                  <a-modal v-if="true" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                  </a-modal>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row type="flex" justify="end">
      <a-col span="auto">
        <a-button type="grey" style="margin-right: 6px">{{ $t('button.reset') }}</a-button>
        <a-button @click="updateAbout" type="primary">{{ $t('button.save') }}</a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      activeKey: 0,
      previewVisible: false,
      previewImage: '',
      form: {
        created_at: '',
        description: {
          en: '',
          ru: '',
          uz: ''
        },
        links: [],
        title: {
          en: '',
          ru: '',
          uz: ''
        },
        updated_at: ''
      }
    }
  },
  methods: {
    onEdit (targetkey, action) {
      // console.log(targetkey, action)
      this[action](targetkey)
    },
    add () {
      const row = {
        fileListIcon: [],
        name: 'Икона',
        tabKey: Math.random() * 200,
        url: ''
      }
      this.form.links.push(row)
      this.activeKey = row.tabKey
    },
    remove (tabKey) {
      // console.log(tabKey)
      this.form.links = this.form.links.filter(el => el.tabKey !== tabKey)
      this.activeKey = this.form.links[this.form.links.length - 1].tabKey
    },
    uploadIcon () {},
     handleChangeIcon (file, obj) {
       if (file.file.status === 'uploading') {
          this.$uploadImage(file.file.originFileObj, obj.fileListIcon, this)
          return
       }
      if (file.fileList.length === 0) { obj.fileListIcon = file.fileList }
    },
    async handlePreviewIcon (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    getAbout () {
      this.$store.dispatch('getAbouts').then((res) => {
        console.log(res)
        this.form = res[0]
        this.form.links = res[0].links.map(el => ({
          ...el,
          tabKey: Math.random() * 100,
          fileListIcon: [{ uid: el.picture.uuid, name: el.picture.uuid, url: el.picture.url, status: 'done' }]
        }))
        this.activeKey = this.form.links[0].tabKey
      })
    },
    updateAbout () {
      this.form.links = this.form.links.map(el => ({
        ...el,
        picture: { uuid: el.fileListIcon[0].uid, url: el.fileListIcon[0].url }
      }))
      this.$store.dispatch('updateAbout', this.form).then(res => {
         this.$alertMessage('success', 'Updated', 'Action has successfully proceed', this)
      })
    }
  },
  created () {
    this.getAbout()
  }
}
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
