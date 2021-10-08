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
              <a-form-model-item ref="warehouse_id" :label="$t('warehouse')" prop="warehouse_id">
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
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="type" :label="$t('branchType')" prop="type">
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
              <a-form-model-item ref="corporate_id" :label="$t('juristicEntity')" prop="corporate_id">
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
        <div style="">
          <a-button icon="plus" type="primary" @click="openModal">{{ $t('add') }}</a-button></div>
        <a-table
          style="margin-top: 30px"
          :columns="column"
          :dataSource="staffSelectsAdd"
          :rowKey="record => record.id"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-branch"
          bordered
        >
          <template slot="action" slot-scope="text, row">
            <a-tooltip>
              <span slot="title">{{$t('delete')}}</span>
              <a-button @click="DeleteBranchUserItem(row.id)" type="danger"><a-icon type="delete"></a-icon></a-button>
            </a-tooltip>
          </template>
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
            :dataSource="userList"
            :rowKey="record => record.id"
            :loading="loading"
            :rowSelection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectedChange,
            }"
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
  watch: {
    // 'staffSelectsAdd': (value) => {
    //   // eslint-disable-next-line no-unused-expressions
    //   this.staffAddBranch.includes(value) ? true : this.staffAddBranch.push(value)
    //   console.log(value)
    // }
  },
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
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    this.onSearch = debounce(this.onSearch, 400)
    this.corporateGetAll = debounce(this.corporateGetAll, 100)
    return {
      selectedRowKeys: [],
      rowSelection: {},
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
          title: this.$t('userType'),
          dataIndex: 'user_type'
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
          dataIndex: 'first_name',
          align: 'center'
        },
        {
          title: this.$t('lastname'),
          dataIndex: 'last_name',
          align: 'center'
        },
        {
          title: this.$t('phone_number'),
          dataIndex: 'phone_number',
          align: 'center'
        },
        {
          title: this.$t('userType'),
          dataIndex: 'user_type',
          align: 'center'
        },
        {
          title: this.$t('inn'),
          dataIndex: 'inn',
          align: 'center'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      addidModal: [],
      staffAddBranch: [],
      requesting: false,
      activeTabKey: '1',
      company_id: this.$route.params.company_id,
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
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }],
        type: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        corporate_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        city_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        warehouse_id: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      },
      corporateFetching: false,
      corporateList: [],
      paramsbranch: {
        filter_by_comp_and_branch: true,
        company_id: this.$route.params.company_id,
        branch_id: this.$route.params.id,
        page: { page: 1, limit: 10, total: null }
      },
      corporateParams: {
        limit: 10,
        page: 1,
        total: null,
        company_id: this.$route.params.company_id
      }
    }
  },
  mounted () {
    if (this.branchId) {
      this.GetBranchUserList(this.paramsbranch)
      .then(res => {
        // console.log('res =>', res)
        this.selectedRowKeys = res.map(e => e.id)
      })
    }
    // this.selectedRowKeys = this.branchesIdList
    this.getUsers(this.corporateParams)
    // this.getSelectBranchAll(this.$route.params.id)
    // .then(res => {
    //   this.selectedRowKeys = res.staff
    // })
    // this.$store.dispatch('getSelectBranchAll', this.$route.params.id)
    // .then(res => {
    //   this.selectedRowKeys = res.staff
    // })
    if (this.$route.params.company_id) {
      this.getCompanyWarehouse(this.corporateParams)
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
    ...mapGetters(['companiesList', 'staffSelectsAdd', 'companyWarehouseList', 'branchesList', 'branchesIdList']),
    userList () {
      return this.branchesList
    }
  },
  methods: {
    DeleteBranchUserItem (id) {
      const params = {
        company_id: this.company_id,
        list_of_user_ids: [id]
      }
      this.loading = true
      this.$store.dispatch('deleteBranchUserItem', params)
        .then(res => {
          this.GetBranchUserList(this.paramsbranch)
            .then(res => {
              this.selectedRowKeys = res.map(e => e.id)
            })
        })
      .finally(() => {
        this.loading = false
      })
    },
    ...mapActions(['GetBranchUserList', 'getCompanies', 'getCompanyWarehouse', 'getUsers', 'getSelectBranch', 'getSelectBranchAll']),
    onSelectedChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      console.log(selectedRowKeys)
      // this.form.staff.includes(selectedRowKeys) ? this.form.staff.pop(selectedRowKeys) : this.form.staff.push(selectedRowKeys)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    callback (value) {
      // 1
      console.log(value)
      this.$store.dispatch('setbutton', value)
         },
    openModal () {
      this.modalVisible = true
    },
    handleAddFeaturedProducts () {
      this.loading = true
      const form =
        {
          branch_id: this.$route.params.id,
          company_id: this.$route.params.company_id,
          list_of_user_ids: this.selectedRowKeys
        }
      this.$store.dispatch('getSelectBranch', form)
      .then(res => {
        console.log(res)
        this.GetBranchUserList(this.paramsbranch)
        .then(res => {
          this.selectedRowKeys = res.map(e => e.id)
        })
        // this.$store.dispatch('setLastTab', 5)
        // this.$router.push({ name: 'CompaniesEdit', params: { id: localStorage.getItem('company_id') } })
      })
      .catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
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
            this.$store.dispatch('setLastTab', 5)
            this.$router.push({ name: 'CompaniesEdit', params: { id: localStorage.getItem('company_id') } })
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
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
    // eslint-disable-next-line vue/no-dupe-keys
  }
}
</script>

<style>
</style>
