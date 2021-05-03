<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('bannerPositions') }}</a-breadcrumb-item>
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

    <a-card :title="$t('bannerPositions')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button
          style="float: right"
          shape="round"
          type="primary link"
          icon="plus"
          test-attr="add-banner-pos"
        >{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllBannerPositions"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-banner-pos"
        bordered
      >
        <template slot="description" slot-scope="desc">
          <div v-html="desc"></div>
        </template>
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.id)" :test-attr="`preview-banner-pos${index}`"/> -->
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="'./update/'+row.id" :test-attr="`edit-banner-pos${index}`">
              <edit-btn/>
            </router-link>
            <delete-btn @confirm="deleteBannerPosition($event, row.id)" :test-attr="`delete-banner-pos${index}`"/>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedBannerPosition"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('title')">{{ selectedBannerPosition.title }}</a-descriptions-item>
        <a-descriptions-item :label="$t('url')">
          {{ selectedBannerPosition.slug }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          <div v-html="selectedBannerPosition.description"></div>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('size')">
          {{ selectedBannerPosition.size }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-preview-banner-pos">{{ $t('cancel') }}</a-button>
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
          title: this.$t('name'),
          dataIndex: 'title'
        },
        {
          title: this.$t('size'),
          dataIndex: 'size'
        },
        {
          title: this.$t('description'),
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' }
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
      selectedBannerPosition: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['bannerPositions', 'bannerPositionsPagination', 'searchQuery']),
    getPagination () {
      return this.bannerPositionsPagination
    },
    getAllBannerPositions () {
      return this.bannerPositions
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
 mounted () {
      this.setSearchQuery()
    this.getBannerPositions({ page: this.bannerPositionsPagination })
      .then((res) => console.log('res', res))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getBannerPositions', 'setSearchQuery']),
    handleTableChange (pagination) {
      console.log('pagination', pagination)
      this.loading = true
      this.getBannerPositions({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (bannerPositionId) {
      this.getSelectedBannerPosition(bannerPositionId)
      this.previewVisible = true
    },
    getSelectedBannerPosition (selectedBannerPosition) {
       request({
        url: '/banner-position/' + selectedBannerPosition,
        method: 'get'
      }).then((response) => {
        this.selectedBannerPosition = response.position
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedBannerPosition = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getBannerPositions()
        .then(res => console.log('res', res))
        .catch(err => console.error('err', err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteBannerPosition (e, id) {
      this.loading = true
      request({
        url: '/banner-position/' + id,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getBannerPositions({ page: this.bannerPositionsPagination })
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.filterParams = values
          this.getBannerPositions()
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
.brand-img {
  display: block !important;
  margin: 0 auto !important;
  max-width: 600px !important;
  width: auto !important;
  height: auto !important;
}
</style>
