<template>
  <div>
    <a-switch
      style="margin: 0 0 15px"
      slot="extra"
      v-model="productVariant.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="productVariant"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
        <a-tab-pane key="1" :tab="$t('basicSettings')">
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('name')" prop="name">
                <a-input
                  v-model="productVariant.name"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="this.productVariantSlug" :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="url" :label="$t('product_url')" prop="url">
                <a-input
                  disabled
                  v-model="productVariantSlug"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('position')" prop="order">
                <a-input
                  type="number"
                  v-model="productVariant.order"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('categories')">
                <treeselect
                  id="selectCategory"
                  v-model="productVariant.category_id"
                  :multiple="false"
                  :set-fields-value="productVariant.category_id"
                  :options="getAllCategories"
                  :placeholder="$t('selectCategory')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('brand')" prop="parent_id">
                <a-select
                  show-search
                  :auto-clear-search-value="false"
                  @search="onBrandSearch"
                  v-model="productVariant.brand_id"
                  :filter-option="false"
                  placeholder="brand">
                  <a-select-option v-for="brand in brandsSelect" :title="brand.name" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="external_id" :label="$t('product_external_id')" prop="external_id">
                <a-input
                  v-model="productVariant.external_id"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="code" :label="$t('product_code')" prop="code">
                <a-input
                  v-model="productVariant.code"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="preview" :label="$t('product_preview_text')" prop="preview">
                <tinymce v-model="productVariant.preview_text"></tinymce>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="productVariant.description"></tinymce>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="characteristics" :label="$t('characteristics')" prop="characteristics">
                <tinymce v-model="productVariant.characteristics"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('images')">
          <a-row>
            <a-col :span="4" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item :label="$t('uploadProductImage')">
                <a-upload
                  :custom-request="uploadImage"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('uploadCategoryImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-form-item :label="$t('uploadProductGallery')">
              <a-upload
                :custom-request="uploadGalleryImage"
                list-type="picture-card"
                :file-list="gallery"
                @preview="handlePreview"
                @change="handleChange"
                :before-upload="beforeUpload"
              >
                <div v-if="gallery.length < 8">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" :src="previewImage" />
              </a-modal>
            </a-form-item>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="3" tab="SEO">
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_title" :label="$t('product_meta_title')" prop="meta_title">
                <a-input
                  v-model="productVariant.meta.title"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_desc" :label="$t('product_meta_description')" prop="meta_desc">
                <a-input
                  v-model="productVariant.meta.description"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_tags" :label="$t('product_meta_tags')" prop="meta_tags">
                <a-input
                  v-model="productVariant.meta.tags"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane v-if="priceUpdatable" key="4" :tab="$t('price')">
          <a-row>
            <a-col :md="24" :lg="12" style="padding: 0 15px">
              <a-form-model-item ref="price" :label="$t('product_price')" prop="price">
                <a-input
                  v-model="price.price"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="12" style="padding: 0 15px">
              <a-form-model-item ref="old_price" :label="$t('product_old_price')" prop="old_price">
                <a-input
                  v-model="price.old_price"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="5" v-if="productVariantSlug" :tab="$t('reviews')">
          <a-modal
            v-if="selectedReview"
            v-model="reviewsModalStatus"
            :title="$t('review_edit')"
            @ok="handleReviewEdit"
            @cancel="closeReviewsModal"
          >
            <a-row>
              <p>{{ this.selectedReview.customer_name }}</p>
              <a-switch
                style="margin: 0 0 15px"
                v-model="selectedReview.active"
                :checked-children="$t('active')"
                :un-checked-children="$t('inactive')"
              />
              <a-col :span="24">
                <label style="margin-bottom: 5px" for="reviewEdit">{{ $t('comment') }}</label>
                <a-textarea
                  id="reviewEdit"
                  v-model="selectedReview.comment"
                  :auto-size="{ minRows: 2, maxRows: 6 }"
                />
              </a-col>
            </a-row>
          </a-modal>
          <a-table
            @change="handleReviewTableChange"
            :rowKey="review => review.id"
            :row-selection="rowSelection"
            :columns="reviewColumns"
            :data-source="getReviewsData"
            :pagination="getReviewsPagination"
            :loading="loadTable"
          >
            <template slot="status" slot-scope="review">
              <a-tag v-if="review.active" color="#108ee9">
                {{ $t('active') }}
              </a-tag>
              <a-tag v-else color="#f50">
                {{ $t('inactive') }}
              </a-tag>
            </template>
            <template slot="action" slot-scope="review">
              <edit-btn @click="openReviewsModal(review)"/>
              <!-- <a-tooltip><template slot="title">{{ $t('update') }}</template>
                <a-button
                  type="primary"
                  icon="edit"
                  @click="openReviewsModal(review)"
                />
              </a-tooltip> -->
              <delete-btn @confirm="removeReview(review.id)"/>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
  </div>
</template>

<script>
//  WHOEVER READING THIS CODE BIIIIG SORRY xD
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapActions, mapGetters } from 'vuex'
// import { ISO_8601 } from 'moment'

function getCategoriesTree (categories) {
  if (categories) {
    // console.log(categories, 'categories')
    return categories.map(category => {
      if (category.children === null) {
        return {
          ...category,
          label: category.name
        }
      } else {
        return {
          ...category,
          label: category.name,
          children: getCategoriesTree(category.children)
          }
      }
    })
  }
}
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function getBase64Gallery (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  components: {
    'tinymce': tinymce,
    Treeselect
  },
  data () {
    return {
      selectedRowKeys: [],
      galleryList: [],
      checkedAttList: {},
      productVariantId: null,
      activeTabKey: '1',
      priceUpdatable: false,
      createdProductVariantSlug: null,
      brandsSelect: [],
      productVariantSlug: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadTable: false,
      imageUrl: '',
      gallery: [],
      price: {
        old_price: 0,
        price: 0,
        price_type_id: ''
      },
      productVariant: {
        name: '',
        active: true,
        brand_id: '',
        category_id: null,
        order: 0,
        description: '',
        image: '',
        gallery: [],
        preview_text: '',
        meta: {
          title: '',
          tags: '',
          description: ''
        },
        external_id: null,
        code: ''
      },
      previewVisible: false,
      previewImage: '',
      modalVisible: false,
      updatePriceOnly: false,
      // reviews
      reviewsModalStatus: false,
      selectedReview: null,
      customerComment: null,
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        order: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        external_id: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      columns: [
        {
          title: this.$t('product_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('brand'),
          dataIndex: 'brand.name'
        },
        {
          title: this.$t('category'),
          dataIndex: 'category.name'
        },
        {
          title: this.$t('price'),
          dataIndex: 'price.price'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      reviewColumns: [
        {
          title: this.$t('customer_name'),
          dataIndex: 'customer_name'
        },
        {
          title: this.$t('rating'),
          dataIndex: 'rate',
          width: '10%'
        },
        {
          title: this.$t('comment'),
          dataIndex: 'comment'
        },
        {
          title: this.$t('status'),
          key: 'status',
          width: '20%',
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
  props: {
  // eslint-disable-next-line
    lang: String
  },
  computed: {
    ...mapGetters(['productVariantsData', 'productVariantsPagination', 'reviewsData', 'reviewsPagination', 'categories', 'brands']),
    getAllCategories () {
      return getCategoriesTree(this.categories)
    },
    getAllBrands () {
      return this.brandsSelect
    },
    getPagination () {
      return this.productsPagination
    },
    getReviewsPagination () {
      return this.reviewsPagination
    },
    // table
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'all-data',
            text: 'Select All Data',
            onSelect: () => {
              // this.selectedRowKeys = this.productsData
              console.log('onSelect')
            }
          }
          // {
          //   key: 'odd',
          //   text: 'Select Odd Row',
          //   onSelect: changableRowKeys => {
          //     let newSelectedRowKeys = []
          //     newSelectedRowKeys = changableRowKeys.filter((key, index) => {
          //       if (index % 2 !== 0) {
          //         return false
          //       }
          //       return true
          //     })
          //     this.selectedRowKeys = newSelectedRowKeys
          //   }
          // },
          // {
          //   key: 'even',
          //   text: 'Select Even Row',
          //   onSelect: changableRowKeys => {
          //     let newSelectedRowKeys = []
          //     newSelectedRowKeys = changableRowKeys.filter((key, index) => {
          //       if (index % 2 !== 0) {
          //         return true
          //       }
          //       return false
          //     })
          //     this.selectedRowKeys = newSelectedRowKeys
          //   }
          // }
        ],
        onSelection: this.onSelection
      }
    },
    getReviewsData () {
      return this.reviewsData
    }
  },
  mounted () {
      console.log('this.productVariantSlug', this.productVariantSlug)
    this.getCategories({ page: null, lang: this.lang, search: false }).then(() => {
      // console.log(getCategoriesTree(this.categories), 'getCate  ')
    })
    this.getBrands({ page: null, search: false }).then(() => {
      this.brandsSelect = this.brands
    })
    this.getProductVariants({ page: this.productVariantsPagination, search: false })
    this.getReviews({ page: null, productSlug: this.productVariantSlug })
    if (this.productVariantSlug) {
      this.getProductVariantData()
      this.priceUpdatable = true
    } else {
      console.warn('WTF')
    }
  },
  methods: {
    ...mapActions(['getCategories', 'getBrands', 'getProductVariants', 'getReviews', 'setSearchQuery']),
    getProductVariantData () {
      request({
        url: `/product-variant/${this.productVariantSlug}`,
        method: 'get',
        params: {
          lang: this.lang,
          onlyRelatedProducts: true
        }
      }).then((response) => {
        const { product_variant: productVariant } = response
        console.log('response', response)
        this.productVariantId = productVariant.id
        this.productVariant.name = productVariant.name
        this.productVariant.description = productVariant.description
        this.productVariant.preview_text = productVariant.preview_text
        this.productVariant.characteristics = productVariant.characteristics
        this.productVariant.order = productVariant.order
        this.productVariant.category_id = productVariant.category.id
        this.productVariant.brand_id = productVariant.brand.id
        this.productVariant.external_id = productVariant.external_id
        this.productVariant.code = productVariant.code
        this.productVariant.order = productVariant.order || 1
        this.imageUrl = productVariant.image
        this.productVariant.image = productVariant.image.split('/')[4]
        this.price.price = productVariant.price.price || 0
        this.price.old_price = productVariant.price.old_price || 0
        this.productVariant.active = productVariant.active
        var isInBrands = false
        this.brands.map(brand => {
          if (brand.id === productVariant.brand.id) {
            isInBrands = true
          }
        })
        if (!isInBrands) {
          this.brands.push({
            name: productVariant.brand.name,
            id: productVariant.brand.id
          })
        }
        this.productVariant.meta.title = productVariant.meta.title
        this.productVariant.meta.description = productVariant.meta.description
        this.productVariant.meta.tags = productVariant.meta.tags
        this.productVariant.gallery = productVariant.gallery ? productVariant.gallery.map((img, idx) => {
          const filename = img.split('/')[4]
          return {
            filename,
            uid: idx
          }
        }) : []
        this.gallery = productVariant.gallery ? productVariant.gallery.map((img, idx) => ({
          type: 'image/jpg',
          status: 'done',
          uid: idx,
          url: img
        })) : []
        this.galleryList = JSON.parse(JSON.stringify(this.gallery))
        console.log('response', response)
        return response
      }).then((data) => {
          console.log('data', data)
      }).catch((err) => console.error(err))
    },
    onBrandSearch (value) {
      // console.log(value, 'value')
      request({
        url: '/brand',
        method: 'get',
        params: {
          search: value
        }
      })
      .then(response => {
        this.brandsSelect = []
        response.brands.map(brand => {
          this.brandsSelect.push({
            name: brand.name,
            id: brand.id
          })
        })
        console.log(this.brandsSelect, 'after')
      })
    },
    // image upload
    uploadGalleryImage (e) {
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      })
      .then(response => {
        this.productVariant.gallery.push({
          filename: response.filename,
          uid: e.file.uid
        })
        console.log('this.productVariant.gallery', this.productVariant.gallery)
      })
      .catch(error => {
        console.error(error)
      })
    },
    uploadImage (e) {
      this.loading = true
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      }).then(response => {
        getBase64(e.file, imageUrl => {
          this.imageUrl = imageUrl
        })
        this.loading = false
        this.productVariant.image = response.filename
      }).catch(error => {
        console.error(error)
        this.loading = false
      })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    // reviews
    handleReviewTableChange (pagination) {
      this.loadTable = true
       console.log('pagination', pagination)
       this.getReviews({ page: pagination, productSlug: this.productVariantSlug })
        .then((res) => console.log(res))
        .catch(err => this.$message.error(err))
        .finally(() => (this.loadTable = false))
    },
    openReviewsModal (review) {
      console.log('review', review)
      console.log('customerId', review.customer_id)
      this.reviewsModalStatus = true
      this.selectedReview = review
    },
    closeReviewsModal () {
      this.reviewsModalStatus = false
    },
    handleReviewEdit () {
      const { id, active, comment, customer_id: customerId, customer_name: customerName, rate } = this.selectedReview
      console.log('customerId', customerId)
      request({
        url: `/feedback/${id}`,
        method: 'put',
        data: {
          active,
          comment,
          customer_id: customerId,
          customer_name: customerName,
          rate
        }
      })
      .then((res) => {
        console.log('res', res)
        this.$message.success(this.$t('successfullyUpdated'))
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.reviewsModalStatus = false))
    },
    removeReview (reviewId) {
      this.loadTable = true
      request({
        url: `/feedback/${reviewId}`,
        method: 'delete'
      })
      .then((res) => {
        console.log('res', res)
        this.getReviews({ page: this.reviewsPagination, productVariantSlug: this.productVariantSlug })
        this.$message.success(this.$t('successfullyDeleted'))
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loadTable = false))
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // submit form
    onSubmit () {
      // console.log('submit')
      const headers = {
        'Content-Type': 'application/json'
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = `/product-variant`
          var method = 'post'
          // request for editing product_variant by slug
          if (this.productVariantSlug) {
            url = `/product-variant/${this.productVariantSlug}`
            method = 'put'
            // update product_variant data
            this.$emit('clickParent', true)
            request({
              url,
              method,
              data: {
                ...this.productVariant,
                gallery: this.productVariant.gallery.map(item => item.filename).join(','),
                lang: this.lang || ''
              },
              headers
            })
            .then(res => {
              console.log('res', res)
            })
            .catch(err => {
              console.error(err)
              this.$message.error(this.$t('error'))
            })
            //
            const slug = this.productVariantSlug
            // update product_variant simple price
            request({
              url: `/product-variant/${slug}/update-price`,
              method: 'put',
              data: this.price,
              headers: headers
            })
            .then(res => {
              console.log('res', res)
              if (this.$route.path !== '/catalog/product-variants') {
                this.$router.replace('/catalog/product-variants')
              }
            })
            .catch(error => console.log('error', error))
            .finally(() => {
              this.$emit('clickParent', false)
            })
            return
          }
           // Updating Price of created productVariant, only works when creating productVariant
          if (this.priceUpdatable) {
            const slug = this.createdProductVariantSlug || this.productVariantSlug
            console.log('this.createdProductVariantSlug', this.createdProductVariantSlug)
            if (this.updatePriceOnly) {
            this.$emit('clickParent', true)
            request({
              url: `/product-variant/${slug}/update-price`,
              method: 'put',
              data: this.price,
              headers: headers
            })
            .then(res => {
              console.log('res', res)
              if (this.$route.path !== '/catalog/product-variants') {
                this.$router.replace('/catalog/product-variants')
              }
            })
            .catch(error => console.error('error', error))
            .finally(() => {
              this.$emit('clickParent', false)
            })
            return
            }
          }
          this.$emit('clickParent', true)
          request({
              url,
              method,
              data: {
                ...this.productVariant,
                gallery: this.productVariant.gallery.map(item => item.filename).join(','),
                lang: this.lang || ''
              },
              headers
          }).then(res => {
            // console.log('res', res)
            this.createdProductVariantSlug = res.product_variant.slug
            this.priceUpdatable = true
            this.activeTabKey = '4'
            this.updatePriceOnly = true
          }).catch(err => {
              console.error(err)
              this.$message.error(this.$t('error'))
          })
          .finally(() => {
            this.$emit('clickParent', false)
          })
          console.log('valid')
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64Gallery(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange (e) {
      const { fileList } = e
      this.gallery = fileList.map(file => ({ ...file, status: 'done' }))
      if (e.file.status === 'removed') {
        this.productVariant.gallery = this.productVariant.gallery.reduce((acc, item) => {
          const uids = fileList.map(item => item.uid)
          if (uids.includes(item.uid)) acc.push(item)
          return acc
        }, [])
        console.log('this.productVariant.gallery', this.productVariant.gallery)
      }
    },
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    }
  }
}
</script>
<style>
</style>
