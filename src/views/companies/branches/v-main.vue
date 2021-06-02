<template>
  <div>
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" :tab="$t('update')">
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="branch"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('name')" prop="name">
                <a-input
                  :disabled="requesting"
                  v-model="branch.name"
                  test-attr="name-branch"
                />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="company_id" :label="$t('company')" prop="company_id">
            <a-select
              style="width: 100%"
              v-model="branch.company_id"
              :placeholder="$t('company')"
              test-attr="company-branch"
            >
              <a-select-option v-for="company in companiesList" :key="company.value" :value="company.id">{{
                company.name
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col> -->
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="city_id" :label="$t('city')" prop="city_id">
                <a-select
                  style="width: 100%"
                  v-model="branch.city_id"
                  :placeholder="$t('city')"
                  test-attr="city-branch"
                >
                  <a-select-option v-for="city in cityList" :key="city.value" :value="city.id">{{
                    city.name
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="city_id" :label="$t('warehouse')" prop="city_id">
                <a-select
                  style="width: 100%"
                  v-model="branch.warehouse_id"
                  :placeholder="$t('city')"
                  test-attr="city-branch"
                >
                  <a-select-option v-for="warehouse in companyWarehouseList" :key="warehouse.value" :value="warehouse.id">{{
                    warehouse.name
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- number -->
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
                <a-input
                  :disabled="requesting"
                  v-model="branch.phone_number"
                  test-attr="phone_number-branch"
                />
              </a-form-model-item>
            </a-col>
            <!-- address 1 -->
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="address" :label="$t('address')" prop="address">
                <a-input
                  :disabled="requesting"
                  v-model="branch.address"
                  test-attr="address-branch"
                />
              </a-form-model-item>
            </a-col>
            <!-- address 2 -->
            <!--        <a-col :md="24" :lg="8" style="padding: 0 15px">-->
            <!--          <a-form-model-item ref="number_of_employees" :label="$t('number_of_employees')" prop="number_of_employees">-->
            <!--            <a-input-number-->
            <!--              style="width: 100%"-->
            <!--              :disabled="requesting"-->
            <!--              v-model="branch.number_of_employees"-->
            <!--              test-attr="number_of_employees-branch"-->
            <!--            />-->
            <!--          </a-form-model-item>-->
            <!--        </a-col>-->
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="branch_type" :label="$t('branchType')" prop="branch_type">
                <a-select
                  style="width: 100%"
                  v-model="branch.type"
                  :placeholder="$t('branchType')"
                  test-attr="branch_type-branch"
                >
                  <a-select-option value="franchise">
                    {{ $t('franchise') }}
                  </a-select-option>
                  <a-select-option value="own">
                    {{ $t('own') }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="corporate_id" :label="$t('juristicEntity')">
                <a-select
                  show-search
                  :auto-clear-search-value="false"
                  @search="onSearch"
                  v-model="branch.corporate_id"
                  :filter-option="false"
                  @popupScroll="onScrollBottom"
                  placeholder="brand"
                  :disbled="loading"
                  test-attr="branch_name-inventory"
                >
                  <a-select-option v-for="corporate in corporateList" :title="corporate.name" :key="corporate.id" :value="corporate.id">
                    {{ corporate.bank_name }}
                  </a-select-option>
                  <a-select-option key="corporateFetching" v-if="corporateParams.total > corporateList.length || corporateFetching">
                    <a-spin slot="notFoundContent" size="small" />
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="branch.description" test-attr="description-branch"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model></a-tab-pane>
      <a-tab-pane key="2" :tab="$t('staff')">
        <div style=""><a-button icon="plus" type="primary" @click="openModal">{{ $t('add') }}</a-button></div>
        <a-table
          style="margin-top: 30px"
          :columns="column"
          :dataSource="dataBranchSelectList"
          :rowKey="record => record.id"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-branch"
          bordered
        >
<!--          <template slot="action" slot-scope="text, row, index">-->
<!--            <router-link :to="`/company/user/update/${row.id}`">-->
<!--              <edit-btn :test-attr="`edit-branch${index}`"/>-->
<!--            </router-link>-->
<!--            <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-branch${index}`"/>-->
<!--          </template>-->
        </a-table>
        <a-modal
          width="80%"
          v-model="modalVisible"
          :title="$t('add')"
          centered
          @ok="handleAddFeaturedProducts"
          @cancel="() => (modalVisible = false)"
        >
          <a-table
            style="margin-top: 30px"
            :columns="columns"
            :rowKey="record => record.id"
            :dataSource="branchesList"
            :loading="loading"
            :row-selection="rowSelection"
            :expanded-row-keys.sync="expandedRowKeys"
            @change="handleTableChange"
            test-attr="list-branch"
            bordered
          >
          </a-table></a-modal>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import companyStaff from '../../../views/companies/CompanyStaff'
import { AutoComplete } from 'ant-design-vue'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  components: {
    'a-auto-complete': AutoComplete,
    'tinymce': tinymce,
    companyStaff
  },
  props: {
  // eslint-disable-next-line
    lang: String
  },
  data () {
    this.onSearch = debounce(this.onSearch, 400)
    this.corporateGetAll = debounce(this.corporateGetAll, 100)
    return {
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          this.form.staff.includes(record.id) ? this.form.staff.pop(record.id) : this.form.staff.push(record.id)
          console.log(this.form.staff)
          console.log(record, selected, selectedRows.id)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
        }
      },
      form: {
        id: this.$route.params.id,
        staff: []
      },
      expandedRowKeys: [],
      modalVisible: false,
      cityList: [],
      columns: [
        {
          title: this.$t('fistname'),
          dataIndex: 'first_name'
        },
        {
          title: this.$t('lastname'),
          dataIndex: 'last_name'
        },
        {
          title: this.$t('phone_number'),
          dataIndex: 'phone_number'
        },
        {
          title: this.$t('inn'),
          dataIndex: 'inn'
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '20%',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      column: [
        {
          title: this.$t('fistname'),
          dataIndex: 'first_name'
        },
        {
          title: this.$t('lastname'),
          dataIndex: 'last_name'
        },
        {
          title: this.$t('phone_number'),
          dataIndex: 'phone_number'
        },
        {
          title: this.$t('inn'),
          dataIndex: 'inn'
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '20%',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      addidModal: [],
      dataBranchSelectList: [],
      requesting: false,
      activeTabKey: '1',
      branchId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      branch: {
        name: '',
        staff: [],
        description: '',
        phone_number: '',
        address: '',
        city_id: '',
        company_id: this.$route.params.company_id || '',
        type: '',
        corporate_id: '',
        warehouse_id: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        type: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        corporate_id: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      },
      corporateFetching: false,
      corporateList: [],
      corporateParams: {
        limit: 10,
        page: 1,
        total: null,
        company_id: this.$route.params.company_id
      }
    }
  },
  mounted () {
    this.dataBranchSelectList = []
    this.getUsers(this.corporateParams).then(res => {
      console.log('vlue2', res)
    }).catch(err => {
      console.log(err)
    })
      .finally(() => {
        this.loading = false
      })
    this.$store.dispatch('getSelectBranchAll', this.$route.params.id)
    if (this.$route.params.company_id) {
      this.getCompanyWarehouse(this.corporateParams)
      .then(res => {
        console.log(res)
         })
        .catch(err => {
        console.log(err)
      })
      .finally(() => {
        console.log('finally')
      })
    }
    if (this.branchId) {
      this.getBranchAttrs(this.branchId).then(res => {
        this.loadingTable = true
      })
    }
    this.getCities()
    this.getCompanies()
    this.onSearch()
  },
  computed: {
    ...mapGetters(['companiesList', 'companyWarehouseList', 'branchesList', 'branchesIdList'])
  },
  methods: {
    ...mapActions(['getCompanies', 'getCompanyWarehouse', 'getUsers', 'getSelectBranch', 'getSelectBranchAll']),
    callback (value) {
      // 1
      this.$router.push({ name: this.$route.name, query: { tabid: value } })
      this.fiflterByIdRetunList(this.branchesIdList, this.branchesList)
         },
    fiflterByIdRetunList (value1, value2) {
      // eslint-disable-next-line no-unused-expressions
      this.dataBranchSelectList.length > 0 ? this.dataBranchSelectList = false : this.dataBranchSelectList
      this.dataBranchSelectList = value2.map(e => value1.includes(e.id) ? e : '')
    },
    openModal () {
      this.modalVisible = true
    },
    handleAddFeaturedProducts () {
      console.log('modal====>')
      this.$store.dispatch('getSelectBranch', this.form)
      this.modalVisible = false
    },
    getPagination () {
      return {}
    },
    handleTableChange (pagination) {
      this.loading = true
      this.getCompanyBranches({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    onSearch (value) {
      this.corporateFetching = true
      this.corporateList = []
      this.corporateParams = { search: value, lang: this.lang, limit: 10, page: 1, company_id: this.$route.params.company_id }
      console.log('Corporate params', this.corporateParams, this.$route.params.company_id)
      this.corporateGetAll()
    },
    onScrollBottom (event) {
      var target = event.target
      if (!this.corporateFetching && target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this.corporateParams.total > this.corporateList.length) {
          this.corporateParams.page += 1
          this.corporateParams.lang = this.lang || 'ru'
          target.scrollTo(0, target.scrollHeight)
          this.corporateGetAll()
        }
      }
    },
    corporateGetAll () {
      this.corporateFetching = true
      request({
        url: '/corporate',
        method: 'get',
        params: this.corporateParams
      })
      .then(response => {
        this.corporateFetching = false
        this.corporateList.push(...response.corporates)
        this.corporateParams.total = response.count
      })
      .catch(() => {
        this.corporateFetching = false
      })
    },
    getCities () {
      return new Promise((resolve) => {
        request({
          url: `/city`,
          method: 'get'
        }).then((response) => {
          resolve()
          // images' urls to show images to user
          this.cityList = response.cities
        })
        .catch(err => {
          console.log(err)
        })
      })
    },
    getBranchAttrs () {
      this.loading = true
      return new Promise((resolve) => {
        request({
          url: `/branch/${this.branchId}`,
          method: 'get'
        }).then((response) => {
          this.loading = false
          resolve()
          console.log('response', response)
          Object.keys(this.branch).forEach(key => {
            if (response[key] !== null) {
              this.branch[key] = response[key]
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
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.requesting = true
          const req = {
            url: this.branchId ? `/branch/${this.branchId}` : '/branch',
            method: this.branchId ? 'put' : 'post'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          request({
              url: req.url,
              method: req.method,
              data: this.branch,
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
