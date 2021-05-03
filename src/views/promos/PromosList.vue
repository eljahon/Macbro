<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('promos') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          :value="getSearchQuery"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>
    <a-card :title="$t('promos')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-promos">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllPromos"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-promos"
        bordered
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="time" slot-scope="time">
          <a-tag class="time-tag" color="blue">{{ new Date(time).toLocaleString() }}</a-tag>
        </template>
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.slug)" :test-attr="`preview-promos${index}`"/> -->
          <div style="display: flex; justify-content: space-around;">
            <router-link :to="`./update/${row.slug}`" >
                <edit-btn :test-attr="`edit-promos${index}`"/>
            </router-link>
            <delete-btn @confirm="deletePromos($event, row.slug)" :test-attr="`delete-promos${index}`"/>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedPromos"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="horizontal" bordered>
        <a-descriptions-item :span="4" :label="$t('promo_title')">
          {{ selectedPromos.title }}
        </a-descriptions-item>
        <a-descriptions-item :span="4" :label="$t('description')">
          <div v-html="selectedPromos.description"></div>
        </a-descriptions-item>
        <a-descriptions-item :span="4" :label="$t('status')">
          <status-tag
            :active="selectedPromos.active"
            default-val
          />
        </a-descriptions-item>
        <a-descriptions-item :span="4" :label="$t('preview_image')">
          <img class="preview-image" :src="selectedPromos.preview_image"/>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-prev-promos">
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
          title: this.$t('promo_title'),
          dataIndex: 'title'
        },
        {
          title: this.$t('start_time'),
          dataIndex: 'start_time',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: this.$t('end_time'),
          dataIndex: 'end_time',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedPromos: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['promosData', 'promosPagination', 'searchQuery']),
    getPagination () {
      return this.promosPagination
    },
    getAllPromos () {
      return this.promosData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.getPromos({ page: this.promosPagination })
        .then(() => (console.log('this.promosData', this.promosData)))
        .catch(error => console.error(error))
        .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getPromos', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getPromos({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (promosSlug) {
      this.getSelectedPromos(promosSlug)
      this.previewVisible = true
    },
    getSelectedPromos (selectedPromos) {
      request({
        url: `/promo/${selectedPromos}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedPromos = response.promo
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedPromos = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getPromos()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deletePromos (e, slug) {
      this.loading = true
      request({
        url: `/promo/${slug}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getPromos({ page: this.promosPagination })
      })
      .catch(err => {
        this.$message.error(err)
      })
      .finally(() => (this.loading = false))
},
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        this.loading = true
        if (!err) {
          this.filterParams = values
          this.getPromos()
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
img.preview-image {
    display: block !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
.time-tag {
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
</style>
