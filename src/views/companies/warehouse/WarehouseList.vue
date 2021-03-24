<template>
  <div>

    <a-card :title="$t('warehouse')" class="breadcrumb-row" :bordered="false">
      <router-link :to="{ path: `${$route.path}/warehouse/create` }" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="search-warehouse">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false">
      <div slot="extra">
        <a-form layout="horizontal" :form="form" @submit="search">
          <a-row>
            <a-col :span="24" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-input
                  id="inputSearch"
                  :placeholder="$t('search') + '...'"
                  v-decorator="['search', { initialValue: this.getSearchQuery }]"
                  v-debounce="debouncedSearch"
                  test-attr="search-warehouse"
                />
              </a-form-item>
            </a-col>
            <!-- <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-button id="buttonSearch" type="default" html-type="submit" icon="search">{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col> -->
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getCompanyBranchesList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-warehouse"
      >
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-branch"/> -->
          <!-- <router-link :to="`./${row.id}/branches/list`" >
            <a-tooltip><template slot="title">{{ $t('branches') }}</template>
              <a-button id="buttonPreview" type="default" icon="branches"></a-button>
            </a-tooltip>
          </router-link> -->
          <router-link :to="`/warehouse/update/${row.id}`" >
              <edit-btn :test-attr="`edit-warehouse${index}`"/>
          </router-link>
          <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-branch${index}`"/>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  data () {
    return {
      value: '',
      data: [],
      companyId: this.$route.params.company_id,
      loading: true,
      columns: [
        {
          title: this.$t('company_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('address'),
          dataIndex: 'address'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCompany: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['companyWarehouseList', 'companyWarehousePagination', 'searchQuery']),
    getPagination () {
      return this.companyWarehousePagination
    },
    getCompanyBranchesList () {
      return this.companyWarehouseList
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
      this.setSearchQuery()
    this.getCompanyWarehouse({ page: this.companyWarehousePagination, company_id: this.$route.params.id })
      .then(() => (console.log('companybranches')))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getCompanyWarehouse', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getCompanyWarehouse({ page: pagination, search: true, company_id: this.$route.params.id })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (companyId) {
      this.getselectedBranch(companyId)
      this.previewVisible = true
    },
    getselectedBranch (companyId) {
      request({
        url: `/branch/${companyId}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedCompany = response
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedCompany = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getCompanyWarehouse({ company_id: this.$route.params.id })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCompany (e, slug) {
      this.loading = true
      request({
        url: `/warehouse/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getCompanyWarehouse({ page: this.companyWarehousePagination, company_id: this.$route.params.id })
      })
      .catch(err => {
        this.$message.error(err)
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        this.loading = true
        if (!err) {
          this.filterParams = values
          this.getCompanyWarehouse({ company_id: this.$route.params.id })
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    }
  }
}
</script>
<style>
img.shops-image {
    display: block !important;
    margin: 0 auto !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
</style>
