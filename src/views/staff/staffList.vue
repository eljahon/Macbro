<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
          <a-breadcrumb-item>{{ $t('staff') }}</a-breadcrumb-item>
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
        <router-link to="././create" slot="extra">
          <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-staff">{{ $t('add') }}</a-button>
        </router-link>

      <a-table
        bordered
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getStaffList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-staff"
      >
        <template slot="fullname" slot-scope="row">
            {{ row.name }} {{ row.last_name }}
        </template>
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="`./update/${row.id}`" >
                <edit-btn :test-attr="`edit-staff${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteStaff($event, row.id)" :test-attr="`delete-staff${index}`"/>
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
          title: this.$t('fullname'),
          scopedSlots: { customRender: 'fullname' }
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone_number'
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
    ...mapGetters(['staffList', 'staffPagination', 'searchQuery']),
    getPagination () {
      return this.staffPagination
    },
    getStaffList () {
      return this.staffList
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
      this.setSearchQuery()
    this.getStaff({ page: this.staffPagination })
    .then(() => (console.log('companybranches')))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getStaff', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getStaff({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getStaff()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteStaff (e, slug) {
      this.loading = true
      request({
        url: `/staff/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getStaff({ page: this.staffPagination })
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
          this.getStaff()
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
