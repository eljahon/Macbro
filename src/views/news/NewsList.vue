<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('news') }}</a-breadcrumb-item>
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
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-input
                  id="inputSearch"
                  :placeholder="$t('search') + '...'"
                  v-decorator="['search', { initialValue: this.getSearchQuery }]"
                  v-debounce="debouncedSearch"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-button id="buttonSearch" type="default" html-type="submit" icon="search">{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllNews"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="is_active">
          <a-tag v-if="is_active" color="#108ee9">
            {{ $t('active') }}
          </a-tag>
          <a-tag v-else color="#f50">
            {{ $t('inactive') }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="text, row">
          <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button id="buttonPreview" type="default" @click="showPreviewModal(row.slug)" icon="eye"></a-button>
          </a-tooltip>
          <router-link :to="`./update/${row.slug}`" >
            <a-tooltip><template slot="title">{{ $t('update') }}</template>
              <a-button id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteNews($event, row.slug)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedNews"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="horizontal" bordered>
        <a-descriptions-item :span="3" :label="$t('news_title')">
          {{ selectedNews.title }}
        </a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('date')">
          <div v-html="selectedNews.formatted_date"></div>
        </a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('status')">
          <a-tag v-if="selectedNews.active" color="#108ee9">
            {{ $t('active') }}
          </a-tag>
          <a-tag v-else color="#f50">
            {{ $t('inactive') }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('preview_image')">
          <a-tag color="red" v-if="!selectedNews.preview_image">{{ this.$t('not_available') }}</a-tag>
          <img class="news-preview-image" :src="selectedNews.preview_image" />
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
          title: this.$t('news_title'),
          dataIndex: 'title'
        },
        {
          title: this.$t('date'),
          dataIndex: 'formatted_date',
          width: '20%'
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
      selectedNews: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['newsData', 'newsPagination', 'searchQuery']),
    getPagination () {
      return this.newsPagination
    },
    getAllNews () {
      return this.newsData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.getNews({ page: this.newsPagination })
      .then((res) => console.log('res', res))
      .catch(err => {
        this.$message.error(this.$t('error'))
        console.error(err)
      })
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getNews', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getNews({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (newsSlug) {
      this.getSelectedNews(newsSlug)
      this.previewVisible = true
    },
    getSelectedNews (selectedNews) {
      request({
        url: `/new/${selectedNews}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedNews = response.new
      })
    },
    handleCancel () {
      this.selectedNews = null
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedNews = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getNews()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteNews (e, slug) {
      this.loading = true
      request({
        url: `/new/${slug}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getNews({ page: this.newsPagination })
      })
      .catch(err => {
        this.$message.error(this.$t('error'))
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
          this.getNews()
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
img.news-preview-image {
    display: block !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
</style>
