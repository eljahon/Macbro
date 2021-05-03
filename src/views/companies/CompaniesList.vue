<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('companies') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          :value="getSearchQuery"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('companies')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-company">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        bordered
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getCompaniesList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-company"
      >
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-company"/> -->
          <!-- <router-link :to="`./${row.id}/branches/list`" >
            <a-tooltip><template slot="title">{{ $t('branches') }}</template>
              <a-button id="buttonPreview" type="default" icon="branches" test-attr="branches-company"></a-button>
            </a-tooltip>
          </router-link> -->
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="`./update/${row.id}`" :test-attr="`edit-company${index}`" >
                <edit-btn/>
            </router-link>
            <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-company${index}`"/>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedCompany"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewCompany')"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('shops_name')">
          {{ selectedCompany.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('phone_number')">
          {{ selectedCompany.phone_number }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          {{ selectedCompany.description }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('address')">
          {{ selectedCompany.address }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('email')">
          {{ selectedCompany.email }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('inn')">
          {{ selectedCompany.inn }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-preview-company">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
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
      loading: true,
      columns: [
        {
          title: this.$t('company_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('phone_number'),
          dataIndex: 'phone_number'
        },
        {
          title: this.$t('address'),
          dataIndex: 'address'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '120px',
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
    ...mapGetters(['companiesList', 'companiesPagination', 'searchQuery']),
    getPagination () {
      return this.companiesPagination
    },
    getCompaniesList () {
      return this.companiesList
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.setSearchQuery()
    this.getCompanies({ page: this.companiesPagination })
      .then(() => (console.log('companies')))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getCompanies', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getCompanies({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (companyId) {
      this.getselectedShop(companyId)
      this.previewVisible = true
    },
    getselectedShop (companyId) {
      request({
        url: `/company/${companyId}`,
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
      this.getCompanies()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCompany (e, slug) {
      this.loading = true
      request({
        url: `/company/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getCompanies({ page: this.companiesPagination })
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
          this.getCompanies()
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
