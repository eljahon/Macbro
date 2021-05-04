<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('warehouse') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('warehouse')" class="breadcrumb-row" :bordered="false">
      <router-link :to="`${ $route.path }/create`" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="search-warehouse">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getCompanyBranchesList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-warehouse"
        bordered
        :customRow="customRowClick"
      >
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-branch"/> -->
          <!-- <router-link :to="`./${row.id}/branches/list`" >
            <a-tooltip><template slot="title">{{ $t('branches') }}</template>
              <a-button id="buttonPreview" type="default" icon="branches"></a-button>
            </a-tooltip>
          </router-link> -->
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="`${$route.path}/update/${row.id}`">
                <edit-btn :test-attr="`edit-warehouse${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-branch${index}`"/>
          </div>
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
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '120',
        //   scopedSlots: { customRender: 'action' }
        // }
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
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`${this.$route.path}/update/${record.id}`)
          }
        }
      }
    },
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
