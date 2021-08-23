<template>
  <a-card>
    <div slot="title">
      <a-page-header style="width: 40%">
        <div slot="title">
          <a-button type="link" icon="arrow-left" style="color: black" @click="() => $router.go(-1)"></a-button>
          <span class="fonSize">{{ $t('report') }} /</span>
          <router-link :to="{name: 'acountListMainList'}" style="color: black" class="fonSize">{{ $t('typeExpenses') }}</router-link> <span class="fonSize">/ {{ $t('add') }}</span>
        </div>
      </a-page-header>
    </div>
    <div>
      <a-card :bordered="false">
        <div slot="title">
          {{ $t('Заполните поля') }}
        </div>
      </a-card>
    </div>
    <div style="margin-top: 50px">
      <a-form-model
        @submit="onSubmit"
        :model="form"
        :rules="rules"
        ref="ruleForm"
      >
        <a-row>
          <a-col :lg="4" :md="12" :style="{ minHeight: '180px', padding: '0 15px' }">
            <a-form-item :label="$t('uploadProductImage')">
              <a-upload
                :custom-request="uploadImage"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                test-attr="image-product-vars"
                style="position: relative"
              >
                <a-icon v-if="loading" :type="loading ? 'loading' : 'plus'" class="iconloading" />
                <img v-if="imageUrl" :src="imageUrl" style="max-width: 100%;" alt="avatar" />
                <div v-else>
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    {{ $t('uploadCategoryImage') }}
                  </div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
<!--        <a-row>-->
<!--          <a-col :span="12" :offset="1">-->
<!--            <a-form-model-item ref="number" prop="number" :label="$t('ИД. аккаунта')">-->
<!--              <a-input-number style="width: 100%" size="large" v-model="order.number"></a-input-number>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--        </a-row> <br> <br>-->
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item ref="name" prop="name"  :label="$t('Название')">
              <a-input size="large" v-model="form.name" order.number></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item ref="order" prop="order"  :label="$t('orderNumber')">
              <a-input style="width: 100%" size="large" v-model="form.order"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item ref="sub_account_category_id" prop="sub_account_category_id" :label="$t('Суб-Категория')">
              <a-select
                size="large"
                :placeholder="$t('Суб-Категория')"
                style="width: 100%"
                @change="handleChangeSelectcatigory"
                allowClear
              >
                <a-select-option v-for="(catigoriya, index) in subCatigoryList" :key="index" :value="catigoriya.id">
                  {{ catigoriya.name }}
                </a-select-option>

              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div style="float: right">
      <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-permissions">
        {{ $t('reset') }}
      </a-button>
      <a-button style="margin-left: 15px" html-type="submit" @click="onSubmit" type="primary">{{ $t('save') }}</a-button>
    </div>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import request from '@/utils/request'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  data () {
    return {
      TypeAccount: [
        { id: '1', name: 'Касса', fullname: 'cashbox' },
        { id: '2', name: 'Контрагент', fullname: 'counteragent' },
        { id: '3', name: 'Клиент', fullname: 'customer' },
        { id: '4', name: 'Сотрудники', fullname: 'staff' },
        { id: '5', name: 'Компания', fullname: 'company' }
      ],
      gallery: [],
      imageUrl: '',
      loading: false,
      form: {
        icon: '',
        name: '',
        order: null,
        sub_account_category_id: '2313132sddssgdfh532543'
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        order: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
        // sub_account_category_id: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ]
      }
    }
  },
  computed: {
    ...mapGetters(['subCatigoryList'])
  },
  methods: {
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    uploadImage (e) {
      this.loading = true
      this.$store.dispatch('setButton', this.loading)
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      }).then(response => {
        getBase64(e.file, imageUrl => {
          this.imageUrl = imageUrl
        })
        setTimeout(() => {
          this.loading = false
          this.$store.dispatch('setButton', this.loading)
        }, 3000)
        this.form.icon = response.filename
      }).catch(error => {
        console.error(error)
        setTimeout(() => {
          this.loading = false
          this.$store.dispatch('setButton', this.loading)
        }, 3000)
      })
    },
    handleChangeSelectcatigory (val) {
      this.form.sub_account_category_id = val
    },
    moment,
    ...mapActions(['SubCatigoryList', 'EspenCreate', 'SubItemUpdate', 'EsenUpdate']),
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.EsenUpdate(this.form).then(res => {
              if (res) {
                this.$router.push({ name: 'expensesListMainList' })
              }
            })
          } else {
            this.EspenCreate(this.form)
              .then(res => {
                if (res) {
                  this.$router.push({ name: 'expensesListMainList' })
                }
              })
          }
        } else {
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.SubItemUpdate(this.$route.params.id)
      .then(res => {
        this.form = { ...res }
        this.imageUrl = res.icon
      })
    }
  },
  created () {
    // this.TrGetListAll()
    this.SubCatigoryList()
  }
}
</script>

<style scoped>
.fonSize {
  font-size: 16px;
}
</style>
