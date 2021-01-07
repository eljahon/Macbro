<template>
  <a-card :title="$t('attributes')">
    <a-card>
      <a-row type="flex" justify="space-between">
        <a-col :span="4">
          <a-button @click="createAttr" type="primary">{{ $t('attribute_create') }}</a-button>
        </a-col>
        <a-col :span="5">
          <a-form layout="horizontal">
            <a-row>
              <a-col :span="24" style="padding: 5px">
                <a-form-item style="margin: 0">
                  <a-input
                    id="inputSearch"
                    :placeholder="$t('search') + '...'"
                    v-debounce="debouncedSearch"
                  />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="12" style="padding: 5px">
                <a-form-item style="margin: 0">
                  <a-button
                    id="buttonSearch"
                    type="default"
                    html-type="submit"
                    icon="search"
                  >{{ $t('search') }}</a-button>
                </a-form-item>
              </a-col> -->
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    <!-- <h1>Salom Attribut</h1> -->
    <a-row>
      <a-table
        :columns="columns"
        :dataSource="allAttrs"
        :rowKey="record => record.id"
        :loading="loadAttrs"
        @change="changeAttrs"
        :pagination="paginationAttrs"
      >
        <template slot="status" slot-scope="is_active">
          <a-tag v-if="is_active" color="#108ee9">{{ $t('active') }}</a-tag>
          <a-tag v-else color="#f50">{{ $t('inactive') }}</a-tag>
        </template>
        <template slot="action" slot-scope="item">
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button id="buttonUpdate" type="primary" @click="editAttr(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteAttr(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>

          <a-popconfirm
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
                id="buttonDelete"
                :type="item.active ? 'danger': 'primary'"
                :icon="item.active? 'lock' : 'unlock'"
                ghost
              ></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-row>
    <AttrCreate ref="attrCreate" />
  </a-card>
</template>
<script>
import AttrCreate from './AttributesCreate'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    AttrCreate
  },
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
    createAttr () {
      this.$refs.attrCreate.show()
    },
    deleteAttr (item) {
      this.deleteAttrs(item.id).then((res) => {
        this.getAllAttrs()
        this.$message.success('Deleted')
      }).catch(err => {
            this.$message.error(err.message)
            this.loading = false
          })
      console.log(item)
    },
    editAttr (item) {
      const editData = this.$refs.attrCreate
      console.log(item)
      editData.create.edit = true
      editData.create.id = item.id
      editData.create.name = item.name
      editData.create.description = item.description
      editData.create.order = item.order
      editData.create.type = item.type
      editData.options = item.options ? item.options.map((e) => {
        return {
          name: e.name,
          value: e.value
        }
      }) : []
      this.$refs.attrCreate.show()
      console.log(editData.create)
    },
    lockAttr (item) {
      console.log(item)
      this.updateAttrs(item).then((res) => {
        this.getAllAttrs()
      }).catch(err => {
            this.$message.error(err.message)
            this.loading = false
          })
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
