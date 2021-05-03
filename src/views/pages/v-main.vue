<template>
  <div>
    <a-switch
      slot="extra"
      v-model="page.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
      test-attr="active-pages"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="page"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" v-model="activeTabKey" @change="activeTabHandler">
        <a-tab-pane force-render key="1" :tab="$t('basicSettings')">
          <a-row>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('name')" prop="name">
                <a-input
                  size="large"
                  v-model="page.title"
                  test-attr="title-pages"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="this.pageSlug" :span="12" style="padding: 0 15px">
              <a-form-model-item ref="url" :label="$t('url')" prop="url">
                <a-input
                  size="large"
                  disabled
                  v-model="pageSlug"
                  test-attr="slug-pages"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item :label="$t('uploadPreviewImage')">
                <a-upload
                  :custom-request="uploadImage"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  test-attr="image-pages"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('uploadPreviewImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="content" :label="$t('content')" prop="content">
                <tinymce v-model="page.content" test-attr="content-pages"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane force-render key="2" :tab="$t('SEO')">
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_title" :label="$t('meta_title')" prop="meta_title">
                <a-input
                  size="large"
                  v-model="page.meta.title"
                  test-attr="meta-title-pages"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_desc" :label="$t('meta_description')" prop="meta_desc">
                <a-input
                  size="large"
                  v-model="page.meta.description"
                  test-attr="meta-description-pages"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_tags" :label="$t('meta_tags')" prop="meta_tags">
                <a-input
                  size="large"
                  v-model="page.meta.tags"
                  test-attr="meta-tags-pages"
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
      pageSlug: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      activeTabKey: '1',
      loading: false,
      // urls of images to show user
      imageUrl: '',
      page: {
        title: '',
        content: '',
        preview_image: '',
        // urls of images to post to API
        active: true,
        meta: {
            title: '',
            description: '',
            tags: ''
        }
      },
      rules: {
        title: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.pageSlug) {
      this.getPageAttrs(this.pageSlug)
        .then(res => console.log('res', res))
        .catch(err => console.error(err))
    }
  },
  computed: {},
  methods: {
    getPageAttrs (pageSlug) {
      return new Promise((resolve) => {
        console.log('this.lang', this.lang)
        request({
          url: `/page/${pageSlug}`,
          method: 'get',
          params: {
              lang: this.lang || ''
          }
        }).then((response) => {
          resolve()
          console.log('response', response)
          const { page: { title, content, preview_image: previewImage, active, slug, meta: { title: metaTitle, description, tags } } } = response
          this.page.title = title
          this.pageSlug = slug
          this.page.content = content
          this.page.active = active
          // image's filename to send to /upload to when editing
          this.page.preview_image = previewImage.split('/')[4] || ''
          // images' urls to show images to user
          this.imageUrl = previewImage
          // SEO
          this.page.meta.title = metaTitle
          this.page.meta.description = description
          this.page.meta.tags = tags
          console.log('this.page', this.page)
        })
      })
    },
    activeTabHandler (_activeTabKey) {
        this.activeTabKey = _activeTabKey
    },
    uploadImage (e) {
      this.loading = true
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      }).then(response => {
        console.log('response', response)
        getBase64(e.file, imageUrl => {
            this.imageUrl = imageUrl
            this.loading = false
            })
        this.page.preview_image = response.filename
        })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/page'
          var method = 'post'
          if (this.pageSlug) {
            url = `/page/${this.pageSlug}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          console.log('this.page', this.page)
          this.$emit('clickParent', true)
          request({
              url: url,
              method: method,
              data: {
                ...this.page,
                lang: this.lang ?? 'ru'
              },
              headers: headers
          })
          .then(res => {
            console.log('response after submit', res)
            if (this.$route.path !== '/pages/list') {
              this.$router.replace('/pages/list')
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error(this.$t('error'))
          })
          .finally(() => {
            this.$emit('clickParent', false)
          })
          console.log('valid')
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style>
</style>
