<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('pages') }}</a-breadcrumb-item>
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

    <a-card :title="$t('list')" :bordered="false" style="flex: 1">
      <div slot="extra">
        <router-link to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-pages">{{ $t('add') }}</a-button>
        </router-link>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllPages"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-pages"
        bordered
      >
        <template slot="image" slot-scope="page">
          <img :src="page.preview_image" alt="preview image">
        </template>
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.slug)" :test-attr="`preview-pages${index}`"/> -->
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="`./update/${row.slug}`" >
              <edit-btn :test-attr="`edit-pages${index}`"/>
            </router-link>
            <delete-btn @confirm="deletePage($event, row.slug)" :test-attr="`delete-pages${index}`"/>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedPage"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="horizontal" bordered>
        <a-descriptions-item :span="24" :label="$t('title')">
          {{ selectedPage.title }}
        </a-descriptions-item>
        <a-descriptions-item :span="24" :label="$t('status')">
          <status-tag
            :active="selectedPage.active"
            default-val
          />
        </a-descriptions-item>
        <a-descriptions-item :span="24" :label="$t('preview_image')">
          <img class="pages-image" :src="selectedPage.preview_image"/>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-prev-pages">
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
          title: this.$t('title'),
          dataIndex: 'title'
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
      selectedPage: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['pagesData', 'pagesPagination', 'searchQuery']),
    getPagination () {
      return this.pagesPagination
    },
    getAllPages () {
      return this.pagesData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.setSearchQuery()
    this.loading = true
    this.getPages({ page: this.pagesPagination })
      .then(() => {
        console.log('this.pagesData', this.pagesData)
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getPages', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getPages({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (pageId) {
      this.getSelectedPage(pageId)
      this.previewVisible = true
    },
    getSelectedPage (selectedPage) {
      request({
        url: `/page/${selectedPage}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedPage = response.page
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedPage = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getPages()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
      console.log('this.pagesData', this.pagesData)
    },
    deletePage (e, slug) {
      this.loading = true
      request({
        url: `/page/${slug}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getPages({ page: this.pagesPagination })
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
        this.loading = true
        if (!err) {
          this.filterParams = values
          this.getPages()
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
img.pages-image {
    display: block !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
</style>
