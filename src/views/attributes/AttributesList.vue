<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('attributes') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          v-model="searchVal"
          :placeholder="$t('search') + '...'"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(searchVal)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('attributes')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-attribute">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-table
        bordered
        :columns="columns"
        :dataSource="allAttrs"
        :rowKey="record => record.id"
        :loading="loadAttrs"
        @change="changeAttrs"
        :pagination="paginationAttrs"
        test-attr="list-attribute"
        :customRow="customRowClick"
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, item, index">
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="`./update/${item.slug}`" :test-attr="`edit-attribute${index}`">
              <edit-btn/>
            </router-link>
            <delete-btn @confirm="deleteAttr(item)" :test-attr="`delete-attribute${index}`"/>
          </div>
          <!-- <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="item.active ? $t('blockMsg') : $t('unblockMsg')"
            @confirm="lockAttr(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ item.active ? $t('blocked') : $t('unblock') }}</template>
              <a-button
                :type="item.active ? 'danger' : 'primary'"
                :icon="item.active ? 'lock' : 'unlock'"
                ghost
              ></a-button>
            </a-tooltip>
          </a-popconfirm> -->
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      searchVal: '',
      columns: [
        {
          title: this.$t('attr_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('attribute_type'),
          dataIndex: 'type'
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' }
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '120px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ]
    }
  },
  methods: {
    ...mapActions(['getAllAttrs', 'deleteAttrs', 'updateAttrs']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`/catalog/attribute/update/${record.slug}`)
          }
        }
      }
    },
    deleteAttr (item) {
      this.deleteAttrs(item.slug)
        .then(res => {
          this.getAllAttrs()
          this.$message.success('successfullyDeleted')
        })
        .catch(err => {
          this.$message.error(err.message)
          this.loading = false
        })
      console.log(item)
    },
    debouncedSearch (e) {
      this.getAllAttrs({
        search: e
      })
    },
    changeAttrs (e) {
      this.getAllAttrs({
        page: e
      })
    }
  },
  computed: {
    ...mapGetters(['allAttrs', 'loadAttrs', 'paginationAttrs'])
  },
  created () {
    this.getAllAttrs({ page: this.paginationAttrs })
  }
}
</script>
