<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
          <a-breadcrumb-item>{{ $t('brands') }}</a-breadcrumb-item>
        </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('brands')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button
          style="float: right"
          shape="round"
          type="primary link"
          icon="plus"
          test-attr="add-brand"
        >{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllBrands"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-brand"
        bordered
      >
        <template slot="description" slot-scope="desc">
          <div v-html="desc"></div>
        </template>
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
          <!-- <preview-btn @click="showPreviewModal(row.id)" :test-attr="`preview-brand${index}`"/> -->
            <router-link :to="'./update/'+row.id">
              <edit-btn :test-attr="`edit-brand${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteBrand($event, row.id)" :test-attr="`delete-brand${index}`"/>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedBrand"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="horizontal" bordered>
        <a-descriptions-item :span="3" :label="$t('brand_name')">{{ selectedBrand.name }}</a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('description')">
          <a-tag color="red" v-if="!selectedBrand.description">{{ this.$t('not_available') }}</a-tag>
          <div v-html="selectedBrand.description"></div>
        </a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('preview_text')">
          <a-tag color="red" v-if="!selectedBrand.preview_text">{{ this.$t('not_available') }}</a-tag>
          {{ selectedBrand.preview_text || '' }}
        </a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('brand_picture')">
          <a-tag color="red" v-if="!selectedBrand.image">{{ this.$t('not_available') }}</a-tag>
          <img class="brand-img" :src="selectedBrand.image" />
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-modal-brand">{{ $t('cancel') }}</a-button>
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
          title: this.$t('brand_name'),
          dataIndex: 'name'
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
      selectedBrand: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['brands', 'paginationBrands', 'searchQuery']),
    getPagination () {
      return this.paginationBrands
    },
    getAllBrands () {
      return this.brands
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
 mounted () {
    this.setSearchQuery('')
    this.getBrands({ page: this.paginationBrands })
      .then((res) => console.log('res', res))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getBrands', 'setSearchQuery']),
    handleTableChange (pagination) {
      console.log('pagination', pagination)
      this.loading = true
      this.getBrands({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (brandId) {
      this.getSelectedBrand(brandId)
      this.previewVisible = true
    },
    getSelectedBrand (selectedBrand) {
       request({
        url: '/brand/' + selectedBrand,
        method: 'get'
      }).then((response) => {
        this.selectedBrand = response.brand
      })
    },
    handleCancel () {
      this.previewVisible = false
      this.selectedBrand = null
    },
    handleCloseModal () {
      this.selectedBrand = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getBrands()
        .then(res => console.log('res', res))
        .catch(err => console.error('err', err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteBrand (e, id) {
      this.loading = true
      request({
        url: `/brand/${id}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getBrands({ page: this.paginationBrands })
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
          this.getBrands()
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
.brand-img {
  max-width: 300px !important;
}
img {
  display: block !important;
  margin: 0 auto !important;
  max-width: 600px !important;
  width: auto !important;
  height: auto !important;
}
p {
  margin-bottom: 0;
}
</style>
