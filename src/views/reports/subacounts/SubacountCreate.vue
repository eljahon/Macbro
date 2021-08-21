<template>
  <a-card>
    <div slot="title">
      <a-page-header style="width: 40%">
        <div slot="title">
          <a-button type="link" icon="arrow-left" style="color: black" @click="() => $router.go(-1)"></a-button>
          {{ $t('report') }} /
          <router-link :to="{name: 'acountListMainList'}" style="color: black">{{ $t('acount') }}</router-link> / {{ $t('add') }}
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
          <a-col :span="12" :offset="1">
            <a-form-model-item :ref="number" :prop="number" :label="$t('ИД. аккаунта')">
              <a-input size="large" v-model="order.number"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row> <br> <br>
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item :ref="number" :prop="number" :label="$t('Название')">
              <a-input size="large" order.number></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <br> <br>
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item :ref="number" :prop="number" :label="$t('Тип аккаунта')">
              <a-input size="large" order.number></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div style="float: right">
      <a-button>{{ $t('reset') }}</a-button>
      <a-button style="margin-left: 15px" type="primary">{{ $t('save') }}</a-button>
    </div>
    <div style="float:left;"><a-button icon="delete" style="color: red; margin-left: 55px">{{ $t('delete') }}</a-button></div>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data () {
    return {
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
</style>
