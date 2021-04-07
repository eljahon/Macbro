<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px">
        <a-breadcrumb-item>{{ $t('featuredProducts') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('featuredProducts')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
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
              />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false">

      <a-table
        bordered
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllFeaturedProducts"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
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
          <router-link :to="'./update/' + row.slug">
            <a-tooltip>
              <template slot="title">{{ $t('update') }}</template>
              <a-button id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteFeaturedProduct($event, row.slug)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
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
      loading: true,
      columns: [
        {
          title: this.$t('name'),
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
      selectedWidgetPosition: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['featuredProducts', 'featuredProductsPagination', 'searchQuery']),
    getPagination () {
      return this.featuredProductsPagination
    },
    getAllFeaturedProducts () {
      return this.featuredProducts
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.setSearchQuery('')
    this.getFeaturedProducts({ page: this.featuredProductsPagination })
      .then(res => console.log('res', res))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getFeaturedProducts', 'setSearchQuery']),
    handleTableChange (pagination) {
      console.log('pagination', pagination)
      this.loading = true
      this.getFeaturedProducts({ page: pagination, search: true })
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getFeaturedProducts()
        .then(res => console.log('res', res))
        .catch(err => console.error('err', err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteFeaturedProduct (e, id) {
      this.loading = true
      request({
        url: `/featured-list/${id}`,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getFeaturedProducts({ page: this.featuredProductsPagination })
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
          this.getFeaturedProducts()
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    }
  }
}
</script>
<style></style>
