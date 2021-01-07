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
          <router-link :to="'./update/'+row.id">
            <a-tooltip>
              <template slot="title">{{ $t('update') }}</template>
              <a-button id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteAdmin($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
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
