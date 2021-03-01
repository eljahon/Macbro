<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('permissions') }}</a-breadcrumb-item>
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
      <!-- <div slot="extra">
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
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-button
                  id="buttonSearch"
                  type="default"
                  html-type="submit"
                  icon="search"
                >{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div> -->

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllPermissions"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, row">
          <router-link :to="'./update/'+row.id">
            <edit-btn/>
          </router-link>
          <delete-btn @confirm="deletePermission($event, row.id)"/>
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
          title: this.$t('key'),
          dataIndex: 'key'
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
    ...mapGetters(['permissions', 'paginationPermissions']),
    getPagination () {
      return this.paginationPermissions
    },
    getAllPermissions () {
      return this.permissions
    }
  },
 mounted () {
    this.getPermissions({ page: this.paginationPermissions })
      .then((res) => console.log('permissions', this.permissions))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getPermissions']),
    handleTableChange (pagination) {
      console.log('pagination', pagination)
      this.loading = true
      this.getPermissions({ page: pagination })
        .then((res) => console.log(res))
        .catch(err => {
          this.$message.error(this.$t('error'))
          console.error(err)
        })
        .finally(() => (this.loading = false))
    },
    deletePermission (e, id) {
      this.loading = true
      request({
        url: `/permission/${id}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getPermissions({ page: this.paginationPermissions })
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
    }
  }
}
</script>
