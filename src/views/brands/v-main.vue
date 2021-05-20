<template>
  <div>
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
