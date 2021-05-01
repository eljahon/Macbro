<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('categories') }}</a-breadcrumb-item>
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

    <a-card :title="$t('categories')" class="breadcrumb-row" :bordered="false">
      <router-link to="././create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-category">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="this.categories"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-category"
        bordered
        :customRow="customRowClick"
      >
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
          <!-- <preview-btn @click="showPreviewModal(row.slug)" :test-attr="`preview-category${index}`"/> -->
            <router-link :to="'./update/'+row.slug" >
              <edit-btn :test-attr="`edit-category${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteCategory($event, row.slug)" :test-attr="`delete-category${index}`"/>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="800px" :title="$t('previewBranch')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('category_name')">
          {{ selectedCategory.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          <div v-html="selectedCategory.description"></div>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('parentCategory')">
          {{ parentCategory ? parentCategory : 'None' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('productPicture')">
          <img class="category-img" :src="selectedCategory.image"/>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-preview-category">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
// function getCate (categories) {
//       if (categories) {
//         return categories.map((c) => {
//         if (!c.child_categories) {
//             return {
//                 ...c,
//                 children: c.child_categories
//             }
//         } else {
//               return {
//                   ...c,
//                   children: getCate(c.child_categories)
//               }
//         }
//       })
//       }
//     }
export default {
  data () {
    return {
      value: '',
      data: [],
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
      selectedCategory: {},
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['categories', 'paginationCategories', 'searchQuery']),
    getPagination () {
      return this.paginationCategories
    },
    getSearchQuery () {
      return this.searchQuery
    }
    // getAllCategories () {
    //   return getCate(this.categories)
    // }
  },
  mounted () {
    this.setSearchQuery('')
    console.log('this.categories', this.categories)
    this.getCategories({ page: this.paginationCategories })
      .then((res) => console.log('res', res))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getCategories', 'setSearchQuery']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`/catalog/categories/update/${record.slug}`)
          }
        }
      }
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
</style>
