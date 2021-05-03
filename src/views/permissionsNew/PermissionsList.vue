<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('permissions') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <!-- <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          :value="getSearchQuery"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input> -->
      </div>
    </breadcrumb-row>

    <a-card :title="$t('list')" :bordered="false" style="flex: 1">
      <router-link to="././create" slot="extra">
        <a-button
          style="float: right"
          shape="round"
          type="primary link"
          icon="plus"
          test-attr="add-permissions"
        >{{ $t('add') }}</a-button>
      </router-link>
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
        test-attr="list-permissions"
        bordered
      >
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="'./update/'+row.id">
              <edit-btn :test-attr="`edit-permissions${index}`"/>
            </router-link>
          </div>
          <!-- <delete-btn @confirm="deletePermission($event, row.id)"/> -->
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
// const headers = {
//   'Content-Type': 'application/json'
// }
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
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['permissionsList', 'permissionsListPagination']),
    getPagination () {
      return this.permissionsListPagination
    },
    getAllPermissions () {
      return this.permissionsList
    }
  },
 mounted () {
    this.getPermissionsNew({ page: this.permissionsListPagination })
      .then((res) => console.log('permissions', this.permissionsList))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
    // request({
    //   url: `/director/75811980-cf90-4d3e-880f-ab5d0ecb413e`,
    //   headers: headers
    // })
    // .then(res => {
    //   console.log(res)
    //   this.$message.success(this.$t('successfullyDeleted'))
    //   this.getPermissionsNew({ page: this.permissionsListPagination })
    // })
    // .catch(err => {
    //   console.error(err)
    //   this.$message.error(this.$t('error'))
    // })
  },
  methods: {
    ...mapActions(['getPermissionsNew']),
    handleTableChange (pagination) {
      console.log('pagination', pagination)
      this.loading = true
      this.getPermissionsNew({ page: pagination })
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
        this.getPermissionsNew({ page: this.permissionsListPagination })
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
