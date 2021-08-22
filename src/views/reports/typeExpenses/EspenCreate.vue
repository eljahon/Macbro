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
        :model="order"
        :rules="rules"
        :ref="ruleForm"
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
            <a-form-model-item ref="number" prop="number"  :label="$t('Название')">
              <a-input size="large" order.number></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item ref="number" prop="number" :label="$t('Суб-Категория')">
              <a-select
                size="large"
                :placeholder="$t('Суб-Категория')"
                style="width: 100%"
                @change="handleChangeSelectcatigory"
                allowClear
              >
                <a-select-option v-for="(catigoriya, index) in TypeAccount" :key="index" :value="catigoriya.id">
                  {{ catigoriya.name }}
                </a-select-option>

              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div style="float: right">
      <a-button>{{ $t('reset') }}</a-button>
      <a-button style="margin-left: 15px" type="primary">{{ $t('save') }}</a-button>
    </div>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
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
      order: {
        number: ''
      },
      rules: {
        number: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['transactionList', 'TrPagination'])
  },
  methods: {
    handleChangeSelectcatigory (val) {
      this.params.category_id = val
      this.SubAcountGetListAll()
    },
    moment,
    ...mapActions(['GetTrListAll']),
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(valid)
        } else {
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  },
  mounted () {
  },
  created () {
    // this.TrGetListAll()
  }
}
</script>

<style scoped>
.fonSize {
  font-size: 16px;
}
</style>
