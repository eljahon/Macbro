<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
            <a-breadcrumb-item>{{ $t('staff') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-staff">{{ $t('add') }}</a-button>
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
                  test-attr="search-staff"
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
        :dataSource="getStaffList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-staff"
      >
        <template slot="fullname" slot-scope="row">
            {{ row.name }} {{ row.last_name }}
        </template>
        <template slot="action" slot-scope="text, row">
          <router-link :to="`./update/${row.id}`" >
              <edit-btn test-attr="edit-staff"/>
          </router-link>
          <delete-btn @confirm="deleteStaff($event, row.id)" test-attr="delete-staff"/>
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
          width: '20%',
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
