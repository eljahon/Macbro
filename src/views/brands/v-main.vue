<template>
  <div>
    <a-switch
      slot="extra"
      v-model="brand.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="brand"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('brand_name')" prop="name">
            <a-input
              v-model="brand.name"
            />
          </a-form-model-item>
        </a-col>
        <a-col v-if="this.brandId" :span="12" style="padding: 0 15px">
          <a-form-model-item ref="url" :label="$t('brand_url')" prop="url">
            <a-input
              disabled
              v-model="brandSlug"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="order" :label="$t('position')" prop="order">
            <a-input
              type="number"
              v-model="brand.order"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="preview_text" :label="$t('preview_text')" prop="preview_text">
            <a-input
              v-model="brand.preview_text"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="4" :style="{ minHeight: '180px', padding: '0 15px' }">
          <a-form-item :label="$t('uploadProductImage')">
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
                  {{ $t('uploadCategoryImage') }}
                </div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="description" :label="$t('description')" prop="description">
            <tinymce v-model="brand.description"></tinymce>
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item>
            <a-button type="primary" html-type="submit" @click="onSubmit">
              {{ $t('save') }}
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm">
              {{ $t('reset') }}
            </a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    'tinymce': tinymce
  },
  data () {
    return {
      brandId: this.$route.params.id,
      brandSlug: '',
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      imageUrl: '',
      brand: {
        name: '',
        preview_text: '',
        order: 0,
        description: '',
        image: '',
        active: true
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        order: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.brandId) this.getBrandAttrs(this.brandId)
    console.log(this.brandId)
  },
  methods: {
    getBrandAttrs () {
      request({
        url: `/brand/${this.brandId}`,
        method: 'get'
      }).then((response) => {
        console.log('response', response)
        this.brand.active = response.brand.active
        this.brand.name = response.brand.name
        this.brand.description = response.brand.description
        this.brand.order = response.brand.order ? response.brand.order : 0
        this.brandSlug = response.brand.slug
        this.imageUrl = response.brand.image
        this.brand.image = response.brand.image.split('/')[4]
        // console.log('SOMETHING', response.brand.image.slice(this.$route.path.lastIndexOf('/') + 1))
        this.brand.preview_text = response.brand.preview_text
        console.log('response', response)
      })
    },
    uploadImage (e) {
      this.loading = true
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
          this.loading = false
        })
        this.brand.image = response.filename
        console.log('this.brand', this.brand)
      }).catch(error => console.error(error))
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = '/brand'
            var method = 'post'
          if (this.brandId) {
            url = `/brand/${this.brandId}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url: url,
              method: method,
              data: {
                ...this.brand,
                image: this.brand.image
              },
              headers: headers
          }).then(res => {
            console.log(res)
            this.$router.replace('/catalog/brands')
          }).catch(err => {
              console.log(err)
              this.$message.success(this.$t('error'))
          })
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
  .avatar-uploader > .ant-upload.ant-upload-select-picture-card {
    width: 150px;
    height: 150px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
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
