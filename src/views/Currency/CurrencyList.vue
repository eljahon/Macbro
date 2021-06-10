<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('Currency') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('Currency')" class="breadcrumb-row" :bordered="false">
      <router-link :to="`${$route.path}/create`" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-category">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        class="cursor"
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="currencyList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-category"
        bordered
        :customRow="customRowClick"
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
            <!-- <preview-btn @click="showPreviewModal(row.slug)" :test-attr="`preview-category${index}`"/> -->
            <router-link :to="$route.path + row.currency" >
              <edit-btn :test-attr="`edit-category${index}`"/>
            </router-link>
            <delete-btn @click.native.stop="" @confirm="deleteCategory($event, row.id)" :test-attr="`delete-category${index}`"/>
          </div>
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
          dataIndex: 'currency'
        },
        {
          title: this.$t('Currency'),
          dataIndex: 'amount'
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '120px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      filterParams: {},
      params: {
        page: { current: 1, pageSize: 10, total: null },
        search: ''
      }
    }
  },
  computed: {
    ...mapGetters(['currencyList', 'paginationCurrency', 'searchQuery']),
    getPagination () {
      return this.paginationCurrency
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.setSearchQuery('')
    console.log('this.currencyList', this.currencyList)
    this.getCurrencyList({ page: this.getPagination })
      .then((res) => console.log('res', res))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getCurrencyList', 'setSearchQuery']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`/currency/list/${record.currency}`)
          }
        }
      }
    },
    handleTableChange (pagination) {
      this.loading = true
      this.getCurrencyList({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getCurrencyList()
          .then(res => console.log('res', res))
          .catch(err => console.error('err', err))
          .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteCategory (e, slug) {
        this.loading = true
      request({
          url: `/rate/${slug}`,
        method: 'delete'
      })
      .then(res => {
          console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getCurrencyList({ page: this.paginationCurrency })
      })
      .catch(err => {
          this.$message.error('error')
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.filterParams = values
          this.getCurrencyList()
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
.category-img {
  display: block !important;
  margin: 0 auto !important;
  max-width: 600px !important;
  width: auto !important;
  height: auto !important;
}
.cursor {
  cursor: pointer;
}
</style>
