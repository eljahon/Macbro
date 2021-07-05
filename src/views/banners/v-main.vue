<template>
  <div>
    <a-switch
      slot="extra"
      v-model="banner.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px"
      test-attr="active-banner"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="banner"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="title" :label="$t('title')" prop="title">
            <a-input
              size="large"
              v-model="banner.title"
              test-attr="title-banner"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="url" :label="$t('url')" prop="url">
            <a-input
              size="large"
              v-model="banner.url"
              test-attr="url-banner"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="slug" :label="$t('bannerPosition')" prop="slug">
            <a-select
              size="large"
              show-search
              :auto-clear-search-value="false"
              @search="onBannerPositionSearch"
              @change="handleBannerPositionChange"
              v-model="banner.position"
              :filter-option="false"
              placeholder="Banner"
              test-attr="position-banner"
            >
              <a-icon slot="suffixIcon" :component="$myIcons.arrowDown" />
              <a-select-option
                v-for="option in bannerPos"
                :title="option.title"
                :key="option.id"
                :value="option.id"
                test-attr="options-banner">
                {{ `${option.title} (${option.size})` }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="24" :style="{ minHeight: '180px', padding: '0 15px' }">
          <a-form-item :label="$t('uploadImage')">
            <a-upload
              :custom-request="uploadImage"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              test-attr="image-banner"
            >
              <a-icon :type="loading ? 'loading' : ''" class="iconLoading" style="color: #00A0E9" />
              <img class="uploaded-image" v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                <div class="ant-upload-text">
                  {{ $t('uploadImage') }}
                </div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="description" :label="$t('description')" prop="description">
            <tinymce v-model="banner.description" test-attr="description-banner"></tinymce>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import { mapGetters, mapActions } from 'vuex'
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
      bannerSlug: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      bannerPos: [],
      banner: {
        active: true,
        title: '',
        description: '',
        position: '',
        image: '',
        url: ''
      },
      imageUrl: '',
      rules: {
        title: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.bannerSlug) this.getBannerAttrs()
    this.getBannerPositions({ page: null, search: false })
    .then((res) => {
        this.bannerPos = this.bannerPositions
    })
    .catch((err) => console.error(err))
  },
  computed: {
    ...mapGetters(['bannerPositions'])
  },
  methods: {
    ...mapActions(['getBannerPositions']),
    getBannerAttrs () {
      request({
        url: `/banner/${this.bannerSlug}?lang=${this.lang}`,
        method: 'get'
      }).then((response) => {
        console.log('response', response)
        const { banner: { active, title, image, url, position, description } } = response
        this.banner.active = active
        this.banner.title = title
        this.banner.description = description
        this.banner.position = position.id
        this.banner.image = image.split('/')[4]
        this.imageUrl = image
        this.banner.url = url
        console.log('this.banner', this.banner)
       })
    },
    // banner position
    handleBannerPositionChange (value) {
        console.log('value', value)
        console.log('this.banner', this.banner)
    },
    onBannerPositionSearch (value) {
      // console.log(value, 'value')
      request({
        url: '/banner-position',
        method: 'get',
        params: {
          search: value
        }
      })
      .then(response => {
          console.log('response', response)
        this.bannerPos = []
        response.positions.map(position => {
          this.bannerPos.push({
            title: position.title,
            id: position.id
          })
        })
        console.log(this.bannerPos, 'after')
      })
    },
    onSubmit (e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = '/banner'
            var method = 'post'
          if (this.bannerSlug) {
            url = `/banner/${this.bannerSlug}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url,
              method,
              data: {
                ...this.banner,
                lang: this.lang ?? 'ru'
              },
              headers
          }).then(res => {
            console.log(res)
            this.$router.replace('/banners/list')
          }).catch(err => {
            console.log(err)
            this.$message.error(this.$t('error'))
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
    onReady (editor) {
        // Insert the toolbar before the editable area.
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        )
    },
    // upload image
    uploadImage (e) {
      this.loading = true
      this.$store.dispatch('setButton', this.loading)
      console.log(e)
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      }).then(response => {
        getBase64(e.file, imageUrl => {
          this.imageUrl = imageUrl
         setTimeout(() => {
           this.loading = false
           this.$store.dispatch('setButton', this.loading)
         }, 2000)
        })
        this.banner.image = response.filename
      }).catch(error => console.error(error))
    }
    // beforeUpload (file) {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
    //   if (!isJpgOrPng) {
    //     this.$message.error('You can only upload JPG, PNG file!')
    //   }
    //   return isJpgOrPng
    // }
  }
}
</script>

<style>
.iconLoading{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-70% -70%);
}
.avatar-uploader {
  position: relative;
  cursor: pointer;
  width: 400px;
}
  .ck-editor .ck-editor__main .ck-content {
    min-height: 300px;
  }
  .ck .ck-reset .ck-editor .ck-rounded-corners {
    min-height: 300px !important;
  }
  .ck-editor__editable {
      min-height: 300px !important;
  }

  .ck-editor__editable_inline {
    min-height: 300px !important;
  }

  :host ::ng-deep .ck-editor__editable_inline {
    min-height: 300px !important;
  }
  .avatar-uploader > .ant-upload.ant-upload-select-picture-card {
    width: 100%;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .uploaded-image {
    max-width: 100%;
  }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

/* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>
