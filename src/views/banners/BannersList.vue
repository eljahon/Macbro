<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('banners') }}</a-breadcrumb-item>
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

    <a-card :title="$t('banners')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button
          style="float: right"
          shape="round"
          type="primary link"
          icon="plus"
          test-attr="add-banner"
        >{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        bordered
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllBanners"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-banner"
        :customRow="customRowClick"
      >
        <template slot="description" slot-scope="desc">
          <div v-html="desc"></div>
        </template>
        <template slot="bannerPosition" slot-scope="banner">
          {{ `${banner.position.title} (${banner.position.size})` }}
        </template>
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.id)" :test-attr="`preview-banner${index}`"/> -->
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="'./update/'+row.slug">
              <edit-btn :test-attr="`edit-banner${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteBanner($event, row.slug)" :test-attr="`delete-banner${index}`"/>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedBanner"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('title')">{{ selectedBanner.title }}</a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          <div v-html="selectedBanner.description"></div>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('bannerPosition')">
          {{ `${selectedBanner.position.title} (${selectedBanner.position.size})` }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('image')">
          <img class="brand-img" :src="selectedBanner.image" />
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button key="back" @click="handleCancel" test-attr="cancel-preview-banner">{{ $t('cancel') }}</a-button>
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
          title: this.$t('title'),
          dataIndex: 'title'
        },
        {
          title: this.$t('bannerPosition'),
          key: 'bannerPosition',
          scopedSlots: { customRender: 'bannerPosition' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' }
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
      selectedBanner: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['banners', 'bannersPagination', 'searchQuery']),
    getPagination () {
      return this.bannersPagination
    },
    getAllBanners () {
      return this.banners
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
 mounted () {
      this.setSearchQuery()
    this.getBanners({ page: this.bannersPagination })
      .then((res) => console.log('BANNERS', this.banners))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getBanners', 'setSearchQuery']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`./update/${record.slug}`)
          }
        }
      }
    },
    handleTableChange (pagination) {
      console.log('pagination', pagination)
      this.loading = true
      this.getBanners({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (bannerId) {
      this.getSelectedBanner(bannerId)
      this.previewVisible = true
    },
    getSelectedBanner (selectedBanner) {
       request({
        url: '/banner/' + selectedBanner,
        method: 'get'
      }).then((response) => {
        this.selectedBanner = response.banner
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedBanner = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getBanners()
        .then(res => console.log('res', res))
        .catch(err => console.error('err', err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteBanner (e, slug) {
      this.loading = true
      request({
        url: '/banner/' + slug,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getBanners({ page: this.bannersPagination })
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
          this.getBanners()
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
p {
  margin: 0;
}
</style>
