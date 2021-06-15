<template>
  <div>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="getPostavshikList"
      :pagination="getPagination"
      :loading="loading"
      @change="handleTableChange"
      test-attr="list-customer"
      bordered
      :customRow="customRowClick"
      class="pointer"
    >
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="c => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          Reset
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="action" slot-scope="text, row, index">
        <!-- <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-customer"/> -->
        <!-- <a-tooltip>
          <template slot="title">{{ $t('read') }}</template>
          <a-button
            id="buttonPreview"
            type="default"
            @click="showPreviewModal(row.id)"
            icon="eye"
          ></a-button>
        </a-tooltip> -->
        <div style="display: flex; justify-content: space-around;">
          <router-link :to="`./update/${row.id}`" style="margin-right: 10px">
            <edit-btn :test-attr="`edit-customer${index}`"/>
          </router-link>
          <delete-btn @confirm="deleteCustomer($event, row.id)" :test-attr="`delete-customer${index}`"/>
        </div>
        <!-- <a-popconfirm
          placement="topRight"
          slot="extra"
          :title="$t('deleteMsg')"
          @confirm="deleteCustomer($event, row.id)"
          :okText="$t('yes')"
          :cancelText="$t('no')"
        >
          <a-tooltip>
            <template slot="title">{{ $t('delete') }}</template>
            <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm> -->
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      data: [],
      PostavshikParams: {
        page: { current: 1, pageSize: 10, total: null },
        search: '',
        offset: 0,
        user_type: 'postavshik'
      },
      columns: [
        {
          title: this.$t('firstName'),
          dataIndex: 'first_name'
        },
        {
          title: this.$t('lastName'),
          dataIndex: 'last_name'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone_number'
        },
        {
          title: this.$t('counterpartyType')
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: 120,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      loading: false
    }
  },
  methods: {
    getPostavshikAll () {
      this.loading = true
      this.PostavshikParams.page = { ...this.postavshikPagination }
      this.$store.dispatch('getPostavshiksAllList', this.PostavshikParams)
        .then(res => {
          console.log(res)
          this.data = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    customRowClick (e) {
      return {
        on: {
          click: (event) => {
            console.log(event)
          }
        }
      }
    },
    handleTableChange (pagination) {
      this.loading = true
      // this.getCustomers({ page: pagination })
      //   .then((res) => console.log(res))
      //   .catch(err => this.requestFailed(err))
      //   .finally(() => (this.loading = false))
    }
  },
  computed: {
    ...mapGetters(['postavshikList', 'postavshikPagination']),
    getPagination () {
      return this.postavshikPagination
    },
    getPostavshikList () {
      return this.postavshikList
    }
  },
  mounted () {
  },
  created () {
    this.getPostavshikAll()
  }
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
