<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
          <a-breadcrumb-item>{{ $t('legalAgents') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card :title="$t('legalAgents')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-legal-agent">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card class="breadcrumb-row" :bordered="false">
      <a-row type="flex" align="middle">
        <a-col :span="12">
          <span>{{ $t('list') }}</span>
        </a-col>
        <a-col :span="12">
          <a-form layout="horizontal" :form="form" @submit="search" style="float: right">
            <a-form-item style="margin: 0">
              <a-input
                id="inputSearch"
                :placeholder="$t('search') + '...'"
                v-decorator="['search', { initialValue: this.getSearchQuery }]"
                v-debounce="debouncedSearch"
                test-attr="search-legal-agent"
              />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getLegalAgentsList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-legal-agent"
      >
        <template slot="action" slot-scope="text, row, index">
          <preview-btn @click="showPreviewModal(row.id)" :test-attr="`preview-legal${index}`"/>
          <router-link :to="`./update/${row.id}`" >
            <edit-btn :test-attr="`edit-legal${index}`"/>
          </router-link>
          <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-legal${index}`"/>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedAgent"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewAgent')"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('firstName')">
          {{ selectedAgent.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('phone_number')">
          {{ selectedAgent.phone_number }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          {{ selectedAgent.description }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('address')">
          {{ selectedAgent.address }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
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
          title: this.$t('firstName'),
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
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedAgent: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['legalAgents', 'legalAgentsPagination', 'searchQuery']),
    getPagination () {
      return this.legalAgentsPagination
    },
    getLegalAgentsList () {
      return this.legalAgents
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
      this.setSearchQuery()
    this.getLegalAgents({ page: this.legalAgentsPagination })
    .then(() => (console.log('companybranches')))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getLegalAgents', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getLegalAgents({ page: pagination, search: true })
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
        url: `/legal-counter-agent/${companyId}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedAgent = response
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedAgent = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getLegalAgents()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCompany (e, slug) {
      this.loading = true
      request({
        url: `/legal-counter-agent/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getLegalAgents({ page: this.legalAgentsPagination })
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
          this.getLegalAgents()
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
