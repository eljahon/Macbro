<template>
  <a-card :bordered="false" >

    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="warehouse"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :md="24" :lg="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('name')" prop="name">
            <a-input
              size="large"
              :disabled="requesting"
              v-model="warehouse.name"
              test-attr="name-warehouse"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :lg="12" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              size="large"
              :disabled="requesting"
              v-model="warehouse.address"
              test-attr="address-warehouse"
            />
          </a-form-model-item>
        </a-col>
        <!--        <a-col :span="12" style="padding: 0 15px">-->
        <!--          <a-form-model-item ref="branch_name" :label="$t('branchName')" prop="branch_name">-->
        <!--            <a-select-->
        <!--              size="large"-->
        <!--              show-search-->
        <!--              :auto-clear-search-value="false"-->
        <!--              @search="onSearch($event, 'branch')"-->
        <!--              :value="warehouse.branch_id"-->
        <!--              :filter-option="false"-->
        <!--              @popupScroll="onScrollBottom($event, 'branch')"-->
        <!--              placeholder="branch"-->
        <!--              @change="handleChange($event, 'branch')"-->
        <!--              :disbled="loading"-->
        <!--              test-attr="branch_name-inventory"-->
        <!--            >-->
        <!--              <a-select-option v-for="branch in branchList" :title="branch.name" :key="branch.id" :value="branch.id">-->
        <!--                {{ branch.name }}-->
        <!--              </a-select-option>-->
        <!--              <a-select-option key="productFetching" v-if="branchParams.total > branchList.length || branchFetching">-->
        <!--                <a-spin slot="notFoundContent" size="small" />-->
        <!--              </a-select-option>-->
        <!--            </a-select>-->
        <!--          </a-form-model-item>-->
        <!--        </a-col>-->
      </a-row>
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="map" :label="$t('map')" prop="map">
            <yandex-map
              :coords="coords"
              v-model="coords"
              :zoom="18"
              @click="onLocationChange"
              searchControlProvider="yandex#search"
              style="width: 100%; max-width: 1000px; height: 50vh;"
              test-attr="coords-order"
            >
              <ymap-marker
                :coords="coords"
                marker-id="123"
                hint-content="point"
              />
            </yandex-map>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
import { pointSearch } from '@/utils/yandexMap'
import debounce from 'lodash/debounce'

export default {
  components: {
    'a-auto-complete': AutoComplete,
    'tinymce': tinymce
  },
  props: {
  // eslint-disable-next-line
    lang: String
  },
  data () {
    this.onSearch = debounce(this.onSearch, 400)
    this.branchGetAll = debounce(this.branchGetAll, 100)

    return {
      cityList: [],
      coords: [41.31, 69.28],
      requesting: false,
      activeTabKey: '1',
      warehouseId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      warehouse: {
        name: '',
        address: '',
        company_id: this.$route.params.company_id || ''
        // branch_id: '',
        // branch_name: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      },
      branchList: [],
      branchFetching: false,
      branchParams: {
        company_id: this.$route.params.company_id || '',
        limit: 10,
        page: 1,
        total: null
      }
    }
  },
  mounted () {
    if (this.warehouseId) {
      this.getBranchAttrs(this.warehouseId).then(res => {
        this.loadingTable = true
      })
    }

    this.branchParams = { search: '', lang: this.lang, limit: 10, page: 1, company_id: this.$route.params.company_id }
    this.branchGetAll()
  },
  methods: {
    onLocationChange (e) {
      // var eMap = e.get('target')
      this.coords = e.get('coords')
      // console.log('MAP', e)
      const searchCoord = [this.coords[0], this.coords[1]]
      // console.log(searchCoord)
      pointSearch(searchCoord.toString()).then(result => {
        this.warehouse.address = this.arrangeAddress(result)
      })
    },
    arrangeAddress (addressArray) {
      if (addressArray.length === 1) {
        return addressArray[0].name
      }
      return `${this.arrangeAddress(addressArray.slice(1, addressArray.length))}, ${addressArray[0].name}`
    },
    handleChange (value, type) {
        if (type === 'branch') {
            const branch = this.branchList.find(item => item.id === value)
            this.warehouse.branch_id = branch.id
            this.warehouse.branch_name = branch.name
        }
    },
    onSearch (value, type) {
      this[`${type}Fetching`] = true
      this[`${type}List`] = []
      this[`${type}Params`] = { search: value, lang: this.lang, limit: 10, page: 1 }
      this[`${type}GetAll`]()
    },
    onScrollBottom (event, type) {
      var target = event.target

      if (!this[`${type}Fetching`] && target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this[`${type}Params`].total > this[`${type}List`].length) {
          this[`${type}Params`].page += 1
          this[`${type}Params`].lang = this.lang || 'ru'
          target.scrollTo(0, target.scrollHeight)
          this[`${type}GetAll`]()
        }
      }
    },
    getBranchAttrs () {
      this.loading = true
      return new Promise((resolve) => {
        request({
          url: `/warehouse/${this.warehouseId}`,
          method: 'get'
        }).then((response) => {
          this.loading = false
          resolve()
          console.log('response', response)
            this.coords = response.longlat && response.longlat.length > 2 ? [Number(response.longlat.split(',')[0]), Number(response.longlat.split(',')[1])] : this.coords
          Object.keys(this.warehouse).forEach(key => {
            if (response[key] !== null) {
              this.warehouse[key] = response[key]
            }
          })
          // images' urls to show images to user
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      })
    },
    branchGetAll () {
      this.branchFetching = true
      request({
        url: '/branch',
        method: 'get',
        params: this.branchParams
      }).then(response => {
        this.branchFetching = false
        this.branchList.push(...response.branches)
        this.branchParams.total = response.count
      }).catch(() => {
        this.branchFetching = false
      })
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.requesting = true
          const req = {
            url: this.warehouseId ? `/warehouse/${this.warehouseId}` : '/warehouse',
            method: this.warehouseId ? 'put' : 'post'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          request({
              url: req.url,
              method: req.method,
              data: {
                  ...this.warehouse,
                    longlat: `${this.coords[0]},${this.coords[1]}`
                },
              headers: headers
          })
          .then(res => {
            this.requesting = false
            console.log('response after submit', res)
            if (this.$route.path !== '/company/list') {
              this.$router.go(-1)
            }
          })
          .catch(err => {
            this.requesting = false
            console.error(err)
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
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style>
</style>
