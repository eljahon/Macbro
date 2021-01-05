<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row type="flex" justify="space-between">
        <a-col span="auto">
          <a-button type="danger" v-if="!isNewForm">{{ $t('button.delete') }}</a-button>
        </a-col>
        <a-col span="auto">
          <a-row type="flex" :gutter="[8,8]" justify="end">
            <a-col span="auto">
              <a-button @click="backToPosts">{{ $t('button.cancel') }}</a-button>
            </a-col>
            <a-col span="auto" v-if="isNewForm">
              <a-button @click="postPost" type="primary">{{ $t('button.publish') }}</a-button>
            </a-col>
            <a-col span="auto" v-else>
              <a-button @click="updatePost" type="primary">{{ $t('button.edit') }}</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row :gutter="[16,16]">
        <a-col :span="16">
          <a-tabs type="card" class="my-1">
            <a-tab-pane :key="1" tab="Russian">
              <a-input v-model="form.title.ru" :placeholder="$t('input.title')" class="my-1" />
              <a-input v-model="form.preview_text.ru" :placeholder="$t('input.description')" />
              <quill-editor
                class="my-1"
                v-model="form.body.ru"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)">
              </quill-editor>
              <Preview :text="form.body.ru" />
            </a-tab-pane>
            <a-tab-pane :key="2" tab="Uzbek">
              <a-input v-model="form.title.uz" :placeholder="$t('input.title')" class="my-1" />
              <a-input v-model="form.preview_text.uz" :placeholder="$t('input.description')" />
              <quill-editor
                class="my-1"
                v-model="form.body.uz"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)">
              </quill-editor>
              <Preview :text="form.body.uz" />
            </a-tab-pane>
            <a-tab-pane :key="3" tab="English">
              <a-input v-model="form.title.en" :placeholder="$t('input.title')" class="my-1" />
              <a-input v-model="form.preview_text.en" :placeholder="$t('input.description')" />
              <quill-editor
                class="my-1"
                v-model="form.body.en"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)">
              </quill-editor>
              <Preview :text="form.body.en" />
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col :span="8">
          <a-card class="my-1">
            <a-row :gutter="[8,8]">
              <a-col :span="24">
                <a-radio-group class="mb-2" v-model="form.type" button-style="solid">
                  <a-radio-button value="news">
                    {{ $t('blogs.post.postType') }}
                  </a-radio-button>
                  <a-radio-button value="event">
                    {{ $t('blogs.post.eventType') }}
                  </a-radio-button>
                </a-radio-group>
                <a-select v-model="form.category" :placeholder="$t('blogs.post.placeholder')" style="width: 100%" @change="onSelectTypeHandler">
                  <a-select-option v-for="(item,i) in categories" :key="i" :value="item.id">
                    {{ item.title.ru }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="24" >
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">
                    <h3 class="mt-5 p-5">{{ $t('blogs.post.visible') }}</h3>
                  </a-col>
                  <a-col span="auto">
                    <a-switch v-model="form.is_active"></a-switch>
                  </a-col>
                </a-row>
              </a-col>
              <a-col v-if="false" :span="24" >
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">
                    <h3 class="">{{ $t('blogs.post.comments') }}</h3>
                  </a-col>
                  <a-col span="auto">
                    <a-switch></a-switch>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="24">
                <h3>{{ $t('blogs.post.image') }}</h3>
                <a-upload-dragger
                  v-if="!fileListThumb.length"
                  name="image"
                  :showUploadList="false"
                  :customRequest="uploadThumb"
                  @change="handleChanges"
                >
                  <p class="ant-upload-drag-icon">
                    <a-icon type="inbox" />
                  </p>
                  <p class="ant-upload-text">
                    {{ $t('blogs.post.image.title') }}
                  </p>
                  <p class="ant-upload-hint">
                    {{ $t('blogs.post.image.subtitle') }}
                  </p>
                </a-upload-dragger>
                <div v-else class="hover__img">
                  <img width="100%" :src="fileListThumb[0].url" :alt="fileListThumb[0].url">
                </div>
              </a-col>
              <a-col :span="24">
                <a-row :gutter="[8,8]" type="flex" justify="space-between">
                  <a-col>
                    <a-upload
                      :customRequest="uploadImage"
                      list-type="picture-card"
                      :file-list="fileList"
                      @preview="handlePreview"
                      @change="handleChange"
                    >
                      <div >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">
                          {{ $t('button.upload') }}
                        </div>
                      </div>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                      <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Preview from './Preview.vue'
import { quillEditor } from 'vue-quill-editor'

export default {
  data () {
   return {
      content: '',
      isNewForm: false,
      categories: [],
      editorOption: {},
      postType: 'event',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileListThumb: [],
      form: {
        'body': {
          'en': '',
          'ru': '',
          'uz': ''
        },
        'category': '',
        'created_at': 'string',
        'is_active': true,
        'meta': {
          'description': 'string',
          'tags': 'string',
          'title': 'string'
        },
        'preview_text': {
          'en': '',
          'ru': '',
          'uz': ''
        },
        'slider': [
          {
            'url': 'string',
            'uuid': 'string'
          }
        ],
        'thumbnail': {
          'url': 'string',
          'uuid': 'string'
        },
        'title': {
          'en': '',
          'ru': '',
          'uz': ''
        },
        'type': 'news',
        'updated_at': 'string',
        'view_count': 0
      }

   }
  },
   components: {
    quillEditor,
    Preview
  },
  methods: {
    async uploadThumb (data) {
      this.$uploadImage(data.file, this.fileListThumb, this)
    },
    async uploadImage (data) {
      this.$uploadImage(data.file, this.fileList, this)
    },
    getCategories () {
      this.$store.dispatch('getCategories').then(res => {
        this.categories = res
        console.log(res)
      })
    },
    getPost (id) {
      // get single post for updates
       this.$store.dispatch('getPost', id).then(res => {
         console.log(res)
         this.form = res
         this.fileList = res.slider.map(el => {
           return {
            uid: el.uuid,
            name: el.uuid,
            status: 'done',
            url: el.url || ''
           }
         })
         this.form.category = res.category.id
         this.fileListThumb = [{
            uid: res.thumbnail.uuid,
            name: res.thumbnail.uuid,
            status: 'done',
            url: res.thumbnail.url || ''
         }]
        console.log(res)
      })
    },
    postPost () {
      // post newly created post blog
      const form = {
        ...this.form,
        slider: this.fileList.map(el => ({
          url: el.url,
          uuid: el.uid
        })),
        thumbnail: { url: this.fileListThumb[0].url, uuid: this.fileListThumb[0].uid }
      }
      console.log(form)
      this.$store.dispatch('postPost', form).then(res => {
        this.$alertMessage('success', this.form.title.ru, 'Successfully created', this)
        this.$router.push('/blogs/posts')
      })
    },
    updatePost () {
      // update post blog
         const form = {
        ...this.form,
        slider: this.fileList.map(el => ({
          url: el.url,
          uuid: el.uid
        })),
        thumbnail: { url: this.fileListThumb[0].url, uuid: this.fileListThumb[0].uid }
      }
      this.$store.dispatch('updatePost', form).then(res => {
        this.$alertMessage('success', this.form.title.ru, 'Successfully updated', this)
        this.$router.push('/blogs/posts')
      })
    },
    change () {

    },
    onChanges () {

    },
    onSelectTypeHandler () {

    },
    onEditorBlur (quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange ({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.$emit('change', html)
    },
      handleChanges (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    backToPosts () {
      this.$router.push('/blogs/posts').catch(err => {
        console.log(err)
      })
    },
     handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      if (fileList.length === 0) {
        this.fileList = fileList
      }
    }
  },
  created () {
    if (Object.keys(this.$route.params).length === 0 && this.$route.params.constructor === Object) {
      this.isNewForm = true
      } else this.getPost(this.$route.params.id)
    this.getCategories()
  }

}
</script>
<style lang="less" scoped>
.hover__img{
  transition: all 0.7s ease;
  padding: 2px;
  height: 100%;
  cursor: pointer;
}
.hover__img:hover{
  background:rgba(31, 31, 31, 0.788);
  height: 100%;
}
.img_layout {
  width: 200px;
  height: 200px;
  object-fit:cover
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 2px;
  color: #666;
}
</style>
