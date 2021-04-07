<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px">
        <a-breadcrumb-item>{{ $t('attributes') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('attributes')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-attribute">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card class="breadcrumb-row" :bordered="false">
      <a-row type="flex" align="middle">
        <a-col :span="12">
          <span>{{ $t('list') }}</span>
        </a-col>
        <a-col :span="12">
          <a-form layout="horizontal" :form="form" @submit="search" style="float: right">
            <a-form-item style="margin: 0">
              <a-input
                slot="extra"
                id="inputSearch"
                :placeholder="$t('search') + '...'"
                v-debounce="debouncedSearch"
                test-attr="search-attribute"
              />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false">
      <a-table
        bordered
        :columns="columns"
        :dataSource="allAttrs"
        :rowKey="record => record.id"
        :loading="loadAttrs"
        @change="changeAttrs"
        :pagination="paginationAttrs"
        test-attr="list-attribute"
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, item, index">
          <router-link :to="`./update/${item.slug}`" :test-attr="`edit-attribute${index}`">
            <edit-btn/>
          </router-link>
          <delete-btn @confirm="deleteAttr(item)" :test-attr="`delete-attribute${index}`"/>
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
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getAllAttrs', 'deleteAttrs', 'updateAttrs']),
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
    this.getAllAttrs()
  }
}
</script>
