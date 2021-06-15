<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('product_variants_list') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          v-model="params.search"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('categories')" class="breadcrumb-row" :bordered="false">
      <div slot="extra">
        {{ $t('dollarCurrency') }}: <b>{{ usd }}</b>
      </div>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <div v-for="item in sortCategoryByOrder" :key="item.id">
        <a-form-model-item>
          <span slot="label" @click="onIconClick(item)" style="cursor: pointer">
            <b>
              {{ item.name }}
            </b>
          </span>
          <a-row type="flex" v-if="item.children && item.children.length">
            <div class="custom-card-variants" @click="onIconClick(sub)" v-for="sub in item.children" :key="sub.id">
              <div
                style="width: 160px; height: 120px; display: flex; align-items: center; justify-content: center"
              >
                <img
                  alt="example"
                  style="max-width: calc(100% - 4px); max-height: 100%"
                  :src="sub.image"
                />
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-top: 1px solid #d9d9d9">
                <span style="font-weight: bold">{{ sub.name }}</span>
                <a-icon :component="$myIcons.arrowDown" style="transform: rotate(-90deg)" ></a-icon>
              </div>
            </div>
          </a-row>
        </a-form-model-item>
      </div>

      <!-- <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="this.categories"
        :pagination="getPagination"
        :loading="loading"
        :customRow="customRowClick"
        @change="handleTableChange"
        test-attr="list-category"
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row, index">
          <preview-btn @click="showPreviewModal(row.slug)" :test-attr="`preview-category${index}`"/>
          <router-link :to="'./update/'+row.slug" >
            <edit-btn :test-attr="`edit-category${index}`"/>
          </router-link>
          <delete-btn @confirm="deleteCategory($event, row.slug)" :test-attr="`delete-category${index}`"/>
        </template>
      </a-table> -->
    </a-card>
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
    params: {
      page: { current: 1, pageSize: 10, total: null },
      search: '',
        lang: 'ru'
    },
      loading: true,
      columns: [
        {
          title: this.$t('category_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCategory: {},
      parentCategory: '',
      filterParams: {},
      usd: ''
    }
  },
  computed: {
    ...mapGetters(['categories', 'paginationCategories', 'searchQuery']),
    getPagination () {
      return this.paginationCategories
    },
    getSearchQuery () {
      return this.searchQuery
    },
    sortCategoryByOrder () {
      const arr = [...this.categories]
      arr.forEach(element => {
        if (element.children && element.children.length) {
          element.children.sort((a, b) => {
            if (+a.order > +b.order) return 1
            if (+a.order < +b.order) return -1
            return 0
          })
        }
      })
      return arr.sort((a, b) => {
        if (+a.order > +b.order) return 1
        if (+a.order < +b.order) return -1
        return 0
      })
    }
  },
  mounted () {
    this.params.page = { ...this.paginationCategories }
    this.setSearchQuery('')
    console.log('this.categories', this.categories)
    this.getCategories(this.params)
      .then((res) => console.log('res', res))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
    this.getUSD()
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getCategories', 'setSearchQuery']),
    getUSD () {
      request({
        url: '/rate/usd',
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.usd = response.rate.amount
      })
    },
    customRowClick (record) {
        return {
            on: {
                click: (e) => {
                    console.log('Category id', record.id)
                    this.$router.push(`${this.$route.path}/${record.id}`)
                }
            }
        }
    },
    onIconClick (record) {
      this.$router.push(`${this.$route.path}/${record.id}`)
      console.log(record.id)
    },
    handleTableChange (pagination) {
      this.loading = true
      this.getCategories({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (categorySlug) {
      this.getSelectedCategory(categorySlug)
      this.previewVisible = true
    },
    getSelectedCategory (selectedCategory) {
      request({
        url: '/category/' + selectedCategory,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedCategory = response.category
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getCategories()
          .then(res => console.log('res', res))
          .catch(err => console.error('err', err))
          .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteCategory (e, slug) {
      this.loading = true
      request({
        url: `/category/${slug}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getCategories({ page: this.paginationCategories })
      })
      .catch(err => {
        this.$message.error('error')
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.filterParams = values
          this.getCategories()
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
.category-img {
  display: block !important;
  margin: 0 auto !important;
  max-width: 600px !important;
  width: auto !important;
  height: auto !important;
}
.custom-card-variants{
  border-radius: 4px;
  width: 160px;
  min-height: 160px;
  border: 1px solid #d9d9d9;
  margin-left: 20px;
  margin-top: 20px;
  cursor: pointer
}
</style>
