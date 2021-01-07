<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('brands') }}</a-breadcrumb-item>
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
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllBrands"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="description" slot-scope="desc">
          <div v-html="desc"></div>
        </template>
        <template slot="action" slot-scope="text, row">
          <a-tooltip>
            <template slot="title">{{ $t('read') }}</template>
            <a-button
              id="buttonPreview"
              type="default"
              @click="showPreviewModal(row.id)"
              icon="eye"
            ></a-button>
          </a-tooltip>
          <router-link :to="'./update/'+row.id">
            <a-tooltip>
              <template slot="title">{{ $t('update') }}</template>
              <a-button id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteBrand($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
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
        <a-button id="buttonCancel" key="back" @click="handleCancel">{{ $t('cancel') }}</a-button>
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
          width: '20%',
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
