<template>
  <a-card>
    <div slot="title" style="font-size: 12px">
      <a-page-header style="width: 40%">
        <div slot="title">
          <a-button type="link" icon="arrow-left" style="color: black;" @click="() => $router.go(-1)"></a-button>
          <span style="font-size: 16px">{{ $t('report') }} / </span>
          <router-link :to="{name: 'subacountListMainList'}" style="color: black; font-size: 16px">{{ $t('subacounts') }}</router-link> <span style="font-size: 16px">/ {{ $t('add') }}</span>
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
            <a-form-model-item :ref="number" :prop="number" :label="$t('Название')">
              <a-input size="large" v-model="order.number"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item :ref="number" :prop="number" :label="$t('Номер аккаунта')">
              <a-input size="large" order.number></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item ref="number" prop="number" :label="$t('Категория')">
              <a-select
                size="large"
                :placeholder="$t('Категория')"
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
        <a-row>
          <a-col :span="12" :offset="1">
            <a-form-model-item ref="number" prop="number" :label="$t('Тип суб-аккаунта')">
              <a-select
                size="large"
                :placeholder="$t('Тип суб-аккаунта')"
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
    <div style="float:left;"><a-button icon="delete" style="color: red; margin-left: 40px">{{ $t('delete') }}</a-button></div>
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
