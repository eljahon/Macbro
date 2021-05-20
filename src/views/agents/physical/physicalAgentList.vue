<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('physicalAgents') }}</a-breadcrumb-item>
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
    <a-card :title="$t('physicalAgents')" class="breadcrumb-row" :bordered="false">
      <router-link slot="extra" to="./create">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-products">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getPhysicalAgentsList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-physical-agent"
        bordered
        :customRow="customRowClick"
      >
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
            <!-- <preview-btn @click="showPreviewModal(row.id)" :test-attr="`preview-physical${index}`"/> -->
            <router-link :to="`./update/${row.id}`" >
              <edit-btn :test-attr="`edit-physical${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-physical${index}`"/>
          </div>
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
        <a-descriptions-item :label="$t('address')">
          {{ selectedAgent.address }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          {{ selectedAgent.description }}
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
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '120px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedAgent: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['physicalAgents', 'physicalAgentsPagination', 'searchQuery']),
    getPagination () {
      return this.physicalAgentsPagination
    },
    getPhysicalAgentsList () {
      return this.physicalAgents
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
      this.setSearchQuery()
    this.getPhysicalAgents({ page: this.physicalAgentsPagination })
    .then(() => (console.log('companybranches')))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getPhysicalAgents', 'setSearchQuery']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`/agents/physical/update/${record.id}`)
          }
        }
      }
    },
    handleTableChange (pagination) {
      this.loading = true
      this.getPhysicalAgents({ page: pagination, search: true })
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
        url: `/physical-counter-agent/${companyId}`,
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
      this.getPhysicalAgents()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCompany (e, slug) {
      this.loading = true
      request({
        url: `/physical-counter-agent/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getPhysicalAgents({ page: this.physicalAgentsPagination })
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
          this.getPhysicalAgents()
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
