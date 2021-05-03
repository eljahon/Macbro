<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('countries') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra" style="float: right">
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
    <a-card class="breadcrumb-row" :title="$t('countries')" :bordered="false">
      <div slot="extra">
        <router-link to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-city">{{ $t('add') }}</a-button>
        </router-link>
      </div>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        bordered
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getCountriesList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-city"
      >
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="`./update/${row.id}`" >
                <edit-btn :test-attr="`edit-city${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteCity($event, row.id)"/>
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
          dataIndex: 'name'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      selectedAgent: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['countriesList', 'countriesPagination', 'searchQuery']),
    getPagination () {
      return this.countriesPagination
    },
    getCountriesList () {
      return this.countriesList
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
      this.setSearchQuery()
    this.getCountries({ page: this.countriesPagination })
    .then(() => (console.log('companybranches')))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getCountries', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getCountries({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getCountries()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCity (e, slug) {
      this.loading = true
      request({
        url: `/country/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getCountries({ page: this.countriesPagination })
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
          this.getCountries()
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
