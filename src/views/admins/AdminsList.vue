<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('admins') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button
            style="float: right"
            shape="round"
            type="primary link"
            icon="plus"
            test-attr="addBtn-admins"
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
                  test-attr="searchList-admins"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllAdmins"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-admins"
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row">
          <router-link :to="'./update/'+row.id">
            <edit-btn/>
          </router-link>
          <delete-btn @confirm="deleteAdmin($event, row.id)"/>
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
          title: this.$t('firstName'),
          dataIndex: 'name'
        },
        {
          title: this.$t('username'),
          dataIndex: 'username'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
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
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['admins', 'adminsPagination', 'searchQuery']),
    getPagination () {
      return this.adminsPagination
    },
    getAllAdmins () {
      return this.admins
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
 mounted () {
    this.getAdmins({ page: this.adminsPagination })
      .then((res) => console.log('admins', this.admins))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getAdmins', 'setSearchQuery']),
    handleTableChange (pagination) {
      console.log('pagination', pagination)
      this.loading = true
      this.getAdmins({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getAdmins()
        .then(res => console.log('res', res))
        .catch(err => console.error('err', err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteAdmin (e, id) {
        this.loading = true
        request({
            url: `/admin/${id}`,
            method: 'delete'
        })
        .then(res => {
            console.log(res)
            this.$message.success(this.$t('successfullyDeleted'))
            this.getAdmins({ page: this.adminsPagination })
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
          this.getAdmins()
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
p {
  margin: 0;
}
</style>
