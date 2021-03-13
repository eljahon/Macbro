<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('pages') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
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
        :dataSource="getAllPages"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
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
        <template slot="action" slot-scope="text, row">
          <preview-btn @click="showPreviewModal(row.slug)"/>
          <router-link :to="`./update/${row.slug}`" >
            <edit-btn/>
          </router-link>
          <delete-btn @confirm="deletePage($event, row.slug)"/>
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
          width: '20%',
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
