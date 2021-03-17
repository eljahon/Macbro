<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('bannerPositions') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button
            style="float: right"
            shape="round"
            type="primary link"
            icon="plus"
            test-attr="add-banner-pos"
          >{{ $t('add') }}</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
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
                  test-attr="search-banner-pos"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllBannerPositions"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-banner-pos"
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
        <template slot="action" slot-scope="text, row">
          <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-banner-pos"/>
          <router-link :to="'./update/'+row.id" test-attr="edit-banner-pos">
            <edit-btn/>
          </router-link>
          <delete-btn @confirm="deleteBannerPosition($event, row.id)" test-attr="delete-banner-pos"/>
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
          width: '20%',
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
