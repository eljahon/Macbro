<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('shops') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
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
        :dataSource="getAllShops"
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
          <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button id="buttonPreview" type="default" @click="showPreviewModal(row.slug)" icon="eye"></a-button>
          </a-tooltip>
          <router-link :to="`./update/${row.slug}`" >
            <a-tooltip><template slot="title">{{ $t('update') }}</template>
              <a-button id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteShops($event, row.slug)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedShop"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('shops_name')">
          {{ selectedShop.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('phone_number')">
          {{ selectedShop.phone }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('working_hours')">
          {{ selectedShop.working_hours }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('address')">
          {{ selectedShop.address + selectedShop.address2 }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('status')">
          <a-tag v-if="selectedShop.active" color="#108ee9">
            {{ $t('active') }}
          </a-tag>
          <a-tag v-else color="#f50">
            {{ $t('inactive') }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('image')">
          <img class="shops-image" :src="selectedShop.image"/>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
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
          title: this.$t('shop_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('phone_number'),
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
      previewVisible: false,
      selectedShop: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['shopsData', 'shopsPagination', 'searchQuery']),
    getPagination () {
      return this.shopsPagination
    },
    getAllShops () {
      return this.shopsData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.getShops({ page: this.shopsPagination })
      .then(() => (console.log('this.shopsData', this.shopsData)))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getShops', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getShops({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (shopsSlug) {
      this.getselectedShop(shopsSlug)
      this.previewVisible = true
    },
    getselectedShop (selectedShop) {
      request({
        url: `/shop/${selectedShop}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedShop = response.shop
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedShop = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getShops()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
      console.log('this.shopsData', this.shopsData)
    },
    deleteShops (e, slug) {
      this.loading = true
      request({
        url: `/shop/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getShops({ page: this.shopsPagination })
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
          this.getShops()
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
