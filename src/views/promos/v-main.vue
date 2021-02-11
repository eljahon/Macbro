<template>
  <div>
    <a-switch
      slot="extra"
      v-model="promo.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="promo"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
        <a-tab-pane key="1" :tab="$t('basicSettings')">
          <a-row>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input
                  v-model="promo.title"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="this.promoSlug" :span="12" style="padding: 0 15px">
              <a-form-model-item ref="url" :label="$t('url')" prop="url">
                <a-input
                  disabled
                  v-model="promoSlug"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="date" :label="$t('date')" prop="url">
                <!--  -->
                <!--  -->
                <!--  -->
                <!--  -->
                <!--  -->
                <a-range-picker
                  :locale="locale"
                  size="large"
                  showTime
                  @change="onDateChange"
                  ref="piker"
                  v-model="date"
                />
                <!--  -->
                <!--  -->
                <!--  -->
                <!--  -->
                <!--  -->
                <!--  -->
                <!--  -->
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="promo.description"></tinymce>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="fullText" :label="$t('full_text')" prop="fullText">
                <tinymce v-model="promo.preview_text"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('images')">
          <a-row>
            <a-col :span="24" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item :label="$t('uploadImage')">
                <a-upload
                  :custom-request="uploadImage"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('uploadImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="24" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item :label="$t('uploadPreviewImage')">
                <a-upload
                  :custom-request="uploadPreviewImage"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                >
                  <img v-if="previewImageUrl" :src="previewImageUrl" alt="avatar" />
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
                  v-model="promo.meta.title"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_desc" :label="$t('meta_description')" prop="meta_desc">
                <a-input
                  v-model="promo.meta.description"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_tags" :label="$t('meta_tags')" prop="meta_tags">
                <a-input
                  v-model="promo.meta.tags"
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
import locale from 'ant-design-vue/es/date-picker/locale/ru_RU'
import moment from 'moment'
import convertDate from '@/utils/convertDate'

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

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
      promoSlug: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      // urls of images to show user
      imageUrl: '',
      previewImageUrl: '',
      date: [],
      promo: {
        title: '',
        description: '',
        // urls of images to post to API
        image: '',
        preview_image: '',
        preview_text: '',
        start_time: null,
        end_time: null,
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
        ],
        order: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        resource: [
          { required: true, message: 'Please select activity resource', trigger: 'change' }
        ],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
      },
      locale
    }
  },
  created () {
    if (this.promoSlug) this.getPromoAttrs(this.promoSlug)
  },
  methods: {
    getPromoAttrs () {
      request({
        url: `/promo/${this.promoSlug}?lang=${this.lang}`,
        method: 'get'
      }).then((response) => {
        console.log('response', response)
        const { promo: { title, description, active, start_time: startTime, end_time: endTime, preview_image: previewImage, image, meta, preview_text: previewText } } = response
        this.promo.title = title
        this.promo.description = description
        this.promo.active = active
        this.promo.meta = meta
        this.promo.preview_text = previewText
        this.promo.start_time = convertDate(startTime) // Date to "YYYY-MM-DD HH:mm:ss" converter
        this.promo.end_time = convertDate(endTime)
        this.date[0] = moment(this.promo.start_time, dateFormat)
        this.date[1] = moment(this.promo.end_time, dateFormat)
        // image's filename to send to /upload to when editing
        this.promo.preview_image = previewImage.split('/')[4] || ''
        this.promo.image = image.split('/')[4] || ''
        // images' urls to show images to user
        this.imageUrl = image
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
        data: data
      }).then(response => {
        console.log('response', response)
        getBase64(e.file, imageUrl => {
            this.imageUrl = imageUrl
            this.loading = false
            })
        this.promo.image = response.filename
        })
    },
    uploadPreviewImage (e) {
      this.loading = true
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      }).then(response => {
        console.log('response', response)
        getBase64(e.file, previewImageUrl => {
            this.previewImageUrl = previewImageUrl
            this.loading = false
            })
        this.promo.preview_image = response.filename
        })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    onDateChange (date, dateString) {
        console.log('dateString', dateString)
        console.log('date', date)
        if (date.length) {
            this.promo.start_time = dateString[0] || '' // ISOString
            this.promo.end_time = dateString[1] || ''
            console.log('this.promo', this.promo)
        } else {
            console.log('cleared')
        }
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/promo'
          var method = 'post'
          if (this.promoSlug) {
            url = `/promo/${this.promoSlug}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          request({
              url,
              method,
              data: {
                ...this.promo,
                start_time: new Date(this.promo.start_time).toUTCString(),
                end_time: new Date(this.promo.end_time).toUTCString(),
                lang: this.lang ?? 'ru'
              },
              headers
          })
          .then(res => {
            console.log('response after submit', res)
            if (this.$route.path !== '/promos/list') {
              this.$router.replace('/promos/list')
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
    },
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    }
  }
}
</script>

<style scoped>
.ant-calendar-picker {
    min-width: 400px !important;
}
</style>
