<template>
  <div>
    <a-switch
      slot="extra"
      v-model="news.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
      test-attr="active-news"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="news"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
        <a-tab-pane key="1" :tab="$t('basicSettings')">
          <a-row>
            <a-col v-if="this.newsSlug" :span="24" style="padding: 0 15px">
              <a-form-model-item ref="url" :label="$t('url')" prop="url">
                <a-input
                  disabled
                  size="large"
                  v-model="newsSlug"
                  test-attr="slug-news"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('news_title')" prop="title">
                <a-input
                  size="large"
                  v-model="news.title"
                  test-attr="title-news"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="news.description" test-attr="description-news"></tinymce>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="fullText" :label="$t('full_text')" prop="fullText">
                <tinymce v-model="news.full_text" test-attr="full-text-news"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('images')">
          <a-row>
            <a-col :span="12" :style="{ padding: '0 15px' }">
              <a-form-item :label="$t('uploadImage')">
                <a-upload
                  :custom-request="uploadImage"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  test-attr="image-news"
                >
                  <img class="upload-img" v-if="imageUrl" :src="imageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('uploadImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" :style="{ padding: '0 15px' }">
              <a-form-item :label="$t('uploadVideo')">
                <a-upload
                  :custom-request="uploadVideo"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUploadVideo"
                  handle
                  test-attr="video-news"
                  @change="onVideoFileChange"
                >
                  <video ref="videoPlayer" width="100%" height="240" v-if="news.video && !loading" controls>
                    <source :src="videoUrl"/>
                  </video>
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('uploadVideo') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item ref="previewImage" :label="$t('uploadNewsPreviewImage')" prop="previewImage">
                <a-upload
                  :custom-request="uploadPreviewImage"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  test-attr="prev-image-news"
                >
                  <img class="upload-img" v-if="previewImageUrl" :src="previewImageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('uploadPreviewImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('SEO')">
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_title" :label="$t('meta_title')" prop="meta_title">
                <a-input
                  size="large"
                  v-model="news.meta.title"
                  test-attr="meta-title-news"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_desc" :label="$t('meta_description')" prop="meta_desc">
                <a-input
                  size="large"
                  v-model="news.meta.description"
                  test-attr="meta-description-news"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_tags" :label="$t('meta_tags')" prop="meta_tags">
                <a-input
                  size="large"
                  v-model="news.meta.tags"
                  test-attr="meta-tags-news"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
  </div>
</template>

<script>
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    'tinymce': tinymce
  },
  props: {
  // eslint-disable-next-line
    lang: String
  },
  data () {
    return {
      activeTabKey: '1',
      newsSlug: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      // urls of images to show user
      imageUrl: '',
      previewImageUrl: '',
      news: {
        title: '',
        description: '',
        // urls of images to post to API
        imageURL: '',
        preview_image: '',
        full_text: '',
        active: true,
        video: '',
        meta: {
            title: '',
            description: '',
            tags: ''
        }
      },
      videoUrl: '',
      rules: {
        title: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        order: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        resource: [
          { required: true, message: 'Please select activity resource', trigger: 'change' }
        ],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
        previewImage: [{ required: true, message: 'Please add preview image', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    if (this.newsSlug) this.getNewsAttrs(this.newsSlug)
  },
  methods: {
    getNewsAttrs () {
      request({
        url: `/new/${this.newsSlug}?lang=${this.lang}`,
        method: 'get'
      }).then((response) => {
        console.log('response', response)
        const { new: { title, description, active, preview_image: previewImage, imageURL, meta, full_text: fullText, video } } = response
        this.news.title = title
        this.news.description = description
        this.news.active = active
        this.news.meta = meta
        this.news.full_text = fullText
        // image's filename to send to /upload to when editing
        this.news.preview_image = previewImage.split('/')[4] || ''
        this.news.imageURL = imageURL.split('/')[4] || ''
        // images' urls to show images to user
        this.imageUrl = imageURL
        this.news.video = video.split('/')[video.split('/').length - 1] || ''
        this.videoUrl = video
        this.previewImageUrl = previewImage
      })
    },
    uploadImage (e) {
      this.loading = true
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data
      }).then(response => {
        console.log('response', response)
        this.news.imageURL = response.filename
        })
    },
    onVideoFileChange (e) {
      console.log('file', e)
      this.videoUrl = URL.createObjectURL(e.file.originFileObj)
      this.news.video = ''
      this.$refs.videoPlayer.load()
    },
    uploadVideo (e) {
      this.loading = true
      var data = new FormData()
      this.videoUrl = e.file
      data.append('file', e.file)
      request({
        url: '/video-upload',
        method: 'post',
        timeout: 100000,
        data
      }).then(response => {
        console.log('response', response)
        this.news.video = response.filename
        this.loading = false
        })
    },
    beforeUploadVideo (file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('Video must smaller than 100MB!')
      }
      return isLt2M
    },
    uploadPreviewImage (e) {
      this.loading = true
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data
      }).then(response => {
        console.log('response', response)
        getBase64(e.file, previewImageUrl => {
            this.previewImageUrl = previewImageUrl
            this.loading = false
            })
        this.news.preview_image = response.filename
        })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/new'
          var method = 'post'
          if (this.newsSlug) {
            url = `/new/${this.newsSlug}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          if (!this.news.preview_image) {
            this.$message.error('Please add preview image')
            return
          }
          this.$emit('clickParent', true)
          request({
            url,
            method,
            data: {
              ...this.news,
              lang: this.lang ?? 'ru'
            },
            headers
          })
          .then(res => {
            console.log('response after submit', res)
            if (this.$route.path !== '/news/list') {
              this.$router.replace('/news/list')
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.success(this.$t('error'))
          })
          .finally(() => {
            this.$emit('clickParent', false)
          })
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    }
  }
}
</script>

<style>
</style>
