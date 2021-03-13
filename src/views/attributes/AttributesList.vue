<template>
  <a-card :title="$t('attributes')">
    <a-card>
      <a-row type="flex" justify="space-between">
        <a-col :span="4">
          <router-link to="././create">
            <a-button type="primary">{{ $t('attribute_create') }}</a-button>
          </router-link>
        </a-col>
        <a-col :span="5">
          <a-form layout="horizontal">
            <a-row>
              <a-col :span="24" style="padding: 5px">
                <a-form-item style="margin: 0">
                  <a-input id="inputSearch" :placeholder="$t('search') + '...'" v-debounce="debouncedSearch" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    <a-row>
      <a-table
        bordered
        :columns="columns"
        :dataSource="allAttrs"
        :rowKey="record => record.id"
        :loading="loadAttrs"
        @change="changeAttrs"
        :pagination="paginationAttrs"
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="item">
          <router-link :to="`./update/${item.slug}`">
            <edit-btn/>
          </router-link>
          <delete-btn @confirm="deleteAttr(item)"/>
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
    </a-row>
  </a-card>
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
