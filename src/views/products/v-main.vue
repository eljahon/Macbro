<template>
  <div>
    <a-switch
      style="margin: 0 0 15px"
      slot="extra"
      v-model="product.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="product"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
        <a-tab-pane key="1" :tab="$t('basicSettings')">
          <a-row>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('product_name')" prop="name">
                <a-input
                  v-model="product.name"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="this.productSlug" :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="url" :label="$t('product_url')" prop="url">
                <a-input
                  disabled
                  v-model="productSlug"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('position')" prop="order">
                <a-input
                  type="number"
                  v-model="product.order"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('categories')">
                <treeselect
                  id="selectCategory"
                  v-model="product.category_id"
                  :multiple="false"
                  :set-fields-value="product.category_id"
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
                  v-model="product.brand_id"
                  :filter-option="false"
                  placeholder="brand">
                  <a-select-option v-for="brand in brandsSelect" :title="brand.name" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('additional_categories')">
                <treeselect
                  id="selectCategory"
                  v-model="product.additional_categories"
                  :multiple="true"
                  :set-fields-value="product.additional_categories"
                  :options="getAllCategories"
                  :placeholder="$t('selectCategory')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="external_id" :label="$t('product_external_id')" prop="external_id">
                <a-input
                  v-model="product.external_id"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="code" :label="$t('product_code')" prop="code">
                <a-input
                  v-model="product.code"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="preview" :label="$t('product_preview_text')" prop="preview">
                <tinymce v-model="product.preview_text"></tinymce>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="product.description"></tinymce>
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
                  v-model="product.meta.title"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_desc" :label="$t('product_meta_description')" prop="meta_desc">
                <a-input
                  v-model="product.meta.description"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="8" style="padding: 0 15px">
              <a-form-model-item ref="meta_tags" :label="$t('product_meta_tags')" prop="meta_tags">
                <a-input
                  v-model="product.meta.tags"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="4" tab="Related Products">
          <a-button type="primary" @click="fetchTableData" style="margin: 0 0 15px">
            {{ $t('add') }}
          </a-button>
          <a-button v-if="relatedProductsRow.length > 0" type="danger" style="margin: 0 15px">
            {{ $t('delete') }} {{ relatedProductsRow.length }}
          </a-button>
          <a-modal
            width="80%"
            v-model="modalVisible"
            :title="$t('add')"
            centered
            @ok="handleAddRelatedProducts"
            @cancel="() => (modalVisible = false)"
          >
            <!--  -->
            <!--  -->
            <!--  -->
            <a-row>
              <a-col :span="8"></a-col>
              <a-col :span="8"></a-col>
              <a-col :span="8">
                <a-input v-debounce="searchProd" :placeholder="$t('search')" />
              </a-col>
            </a-row>
            <a-table
              @change="handleTableChange"
              :rowKey="record => record.id"
              :row-selection="rowSelection"
              :columns="columnsModal"
              :data-source="productsData"
              :pagination="getPagination"
              :loading="loadTable"
            />
          <!--  -->
          <!--  -->
          <!--  -->
          </a-modal>
          <a-table
            :rowKey="record => record.id"
            :row-selection="relatedProductsRowSelection"
            :columns="columns"
            :data-source="product.related_products"
          >
            <template slot="action" slot-scope="text, item">
              <a-popconfirm
                placement="topRight"
                slot="extra"
                :title="$t('deleteMsg')"
                @confirm="removeProd(item)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
              <!-- <a-tooltip><template slot="title">{{ $t('delete') }}</template>
                <a-button type="danger" @click="removeProd(item)" icon="delete"></a-button>
              </a-tooltip> -->
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane v-if="priceUpdatable" key="5" :tab="$t('price')">
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
            <a-col :md="24" :lg="12" style="padding: 0 15px">
              <a-form-model-item ref="unired_price" :label="$t('unired_price')" prop="unired_price">
                <a-input
                  v-model="unired.price"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="12" style="padding: 0 15px">
              <a-form-model-item ref="unired_old_price" :label="$t('unired_old_price')" prop="unired_old_price">
                <a-input
                  v-model="unired.old_price"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane v-if="priceUpdatable" key="6" :tab="$t('attributes')">
          <a-row>
            <a-col
              class="attributes"
              :md="24"
              v-for="property in productProperties"
              :key="property.id"
            >
              <div v-if="property.type === 'text' || property.type === 'number'">
                <label class="propertyLabel">{{ property.name }}</label>
                <a-input
                  v-debounce="() => debouncedRequest(value, property.id)"
                  :default-value="setDefaultProperty(property.id)"
                />
              </div>
              <div v-if="property.type === 'select'">
                <label class="propertyLabel">{{ property.name }}</label>
                <a-select
                  @change="handleProperty($event, property.type, property.id)"
                  placeholder="Select an option"
                  :default-value="setDefaultProperty(property.id)"
                >
                  <a-select-option
                    v-for="option in property.options"
                    :title="option.name"
                    :key="option.value"
                    :value="option.value">
                    {{ option.name }}
                  </a-select-option>
                </a-select>
              </div>
              <div v-if="property.type === 'checkbox'">
                <label class="propertyLabel">{{ property.name }}</label>
                <a-checkbox-group
                  name="checkboxgroup"
                  @change="handleProperty($event, property.type, property.id)"
                  :default-value="setDefaultProperty(property.id)"
                >
                  <a-checkbox v-for="option in property.options" :value="option.value" :key="option.value">
                    {{ option.name }}
                  </a-checkbox>
                </a-checkbox-group>
              </div>
              <div v-if="property.type === 'radio'">
                <label class="propertyLabel">{{ property.name }}</label>
                <a-radio-group
                  button-style="solid"
                  @change="handleProperty($event, property.type, property.id)"
                  :default-value="setDefaultProperty(property.id)"
                >
                  <a-radio-button v-for="option in property.options" :value="option.value" :key="option.value">
                    {{ option.name }}
                  </a-radio-button>
                </a-radio-group>
              </div>
            </a-col>
            <div>
              <a-button type="primary" @click="openAddAttrs">{{ $t('add_attr') }}</a-button>
              <a-modal v-model="addAttrProductModal" :title="$t('add_attr')" @ok="addProductProperty">
                <a-row>
                  <a-col :span="24">
                    <label style="margin-bottom: 5px" for="attrSelect">{{ $t('attributes') }}</label>
                    <a-select id="attrSelect" style="width: 100%" v-model="attrs_id">
                      <a-select-option v-for="attr in allProductProperties" :key="attr.id" :value="attr.id">
                        {{ attr.name }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
              </a-modal>
            </div>
          </a-row>
        </a-tab-pane>
        <a-tab-pane v-if="priceUpdatable" key="7" :tab="$t('variants')">
          <div class="product-variants">
            <div class="product-variants__item" v-for="(item, index) in product.variants" :key="index">
              <a-row type="flex" align="middle">
                <a-col :md="24" :lg="10" style="padding: 0 15px">
                  <a-form-model-item ref="variant_name" :label="$t('name')">
                    <!-- <a-input
                      v-model="item.name"
                    /> -->
                    <a-select
                      show-search
                      :auto-clear-search-value="false"
                      v-model="item.name"
                      @search="onAttributeVariantSeach"
                      :filter-option="false"
                      placeholder="brand">
                      <a-select-option v-for="variant in generatedVariants" :title="variant" :key="variant" :value="variant">
                        {{ variant }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="10" style="padding: 0 15px">
                  <a-form-model-item ref="variant_name" :label="$t('product_variant')">
                    <a-select
                      show-search
                      :auto-clear-search-value="false"
                      @search="onVariatSearch"
                      v-model="item.value"
                      :filter-option="false"
                      placeholder="brand">
                      <a-select-option v-for="variant in variantList" :title="variant.name" :key="variant.id" :value="variant.id">
                        {{ variant.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="4" style="padding: 0 15px">
                  <a-popconfirm
                    placement="topRight"
                    style="float: right"
                    :title="$t('deleteMsg')"
                    @confirm="deleteVariant(index)"
                    :okText="$t('yes')"
                    :cancelText="$t('no')"
                  >
                    <a-button type="danger" icon="delete"></a-button>
                  </a-popconfirm>
                </a-col>
              </a-row>
            </div>
          </div>
          <!-- <pre>
            {{generatedVariants}}
          </pre> -->
          <div>
            <a-button type="primary" @click="onAddVariant" icon="plus" style="width: 50%; margin: 0 auto; display: block">
              {{ $t('add') }}
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="8" v-if="productSlug" :tab="$t('reviews')">
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
            :data-source="reviewsData"
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
              <a-tooltip><template slot="title">{{ $t('update') }}</template>
                <a-button
                  type="primary"
                  icon="edit"
                  @click="openReviewsModal(review)"
                />
              </a-tooltip>
              <a-popconfirm
                placement="topRight"
                slot="extra"
                :title="$t('deleteMsg')"
                @confirm="removeReview(review.id)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip><template slot="title">{{ $t('delete') }}</template>
                  <a-button type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
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
import debounce from 'lodash/debounce'
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
    this.onVariatSearch = debounce(this.onVariatSearch, 800)
    this.onAttributeVariantSeach = debounce(this.onAttributeVariantSeach, 800)
    return {
      attrVarSearchText: '',
      attVariantsList: [],
      checkedAttList: [],
      variantList: [],
      productId: null,
      activeTabKey: '1',
      priceUpdatable: false,
      createdProductSlug: null,
      brandsSelect: [],
      productSlug: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadTable: false,
      imageUrl: '',
      attrs_id: '',
      gallery: [],
      unired: {
        old_price: 0,
        price: 0,
        price_type_id: '1'
      },
      price: {
        old_price: 0,
        price: 0,
        price_type_id: ''
      },
      product: {
        name: '',
        active: true,
        brand_id: '',
        category_id: null,
        order: 0,
        description: '',
        image: '',
        gallery: [],
        preview_text: '',
        related_products: [],
        variants: [],
        additional_categories: [],
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
      addAttrProductModal: false,
      relatedProductsRow: [],
      updatePriceOnly: false,
      // product properties
      allProductProperties: null,
      productProperties: [],
      productDefaultProperties: null,
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
        ],
        desc: [{ required: true, message: this.$t('required'), trigger: 'blur' }]
      },
      // table
      selectedRowKeys: [],
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
      columnsModal: [
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
    ...mapGetters(['productsData', 'productsPagination', 'reviewsData', 'reviewsPagination', 'categories', 'brands', 'allAttrs']),
    generatedVariants () {
      if (this.attrVarSearchText) {
        return this.attVariantsList.filter(item => item.includes(this.attrVarSearchText))
      }
      if (this.checkedAttList.length) {
        this.checkedAttList[0].properties.forEach(item => {
          this.variantsLoop(`${item.value}`, this.checkedAttList.slice(1))
        })
        return this.attVariantsList
      }
      return []
    },
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
    relatedProductsRowSelection () {
        const { relatedProductsRow } = this
      return {
        selectedRowKeys: relatedProductsRow,
        onChange: this.onRelatedProductsSelectChange,
        hideDefaultSelections: true,
        selections: [
          // {
          //   key: 'all-data',
          //   text: 'Select All Data',
          //   onSelect: () => {getProductAttributes
          //     // this.selectedRowKeys = this.productsData
          //     console.log('onSelect')
          //   }
          // }
        ],
        onSelection: this.onSelection
      }
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
    }
  },
  mounted () {
    this.getCategories({ page: null, lang: this.lang, search: false }).then(() => {
      // console.log(getCategoriesTree(this.categories), 'getCate  ')
    })
    this.getBrands({ page: null, search: false }).then(() => {
      this.brandsSelect = this.brands
    })
    this.getProducts({ page: this.productsPagination, search: false })
    this.getReviews({ page: null, productSlug: this.productSlug })
    if (this.productSlug) {
      this.getProductData()
      // console.log('this.product', this.product)
      this.priceUpdatable = true
    } else {
      console.warn('WTF')
    }
    this.onVariatSearch()
  },
  methods: {
    ...mapActions(['getCategories', 'getBrands', 'getProducts', 'getReviews', 'setSearchQuery', 'getAllAttrs']),
    onAttributeVariantSeach (text) {
      if (text) {
        this.attrVarSearchText = text
      } else {
        this.attVariantsList = []
        this.attrVarSearchText = ''
      }
    },
    variantsLoop (text, list) {
      if (!list.length) {
        this.attVariantsList.push(`${text}`.toLowerCase())
      } else if (list.length > 1) {
        list[0].properties.forEach(item => {
          this.variantsLoop(`${text}-${item.value}`, list.slice(1))
        })
      } else {
        list[0].properties.forEach(item => {
          this.attVariantsList.push(`${text}-${item.value}`.toLowerCase())
        })
      }
    },
    deleteVariant (index) {
      this.product.variants.splice(index, 1)
    },
    onAddVariant () {
      this.product.variants.push({
          name: '',
          value: ''
        }
      )
    },
    onVariatSearch (value) {
      // console.log(value, 'value')
      const params = { search: value, lang: this.lang, limit: 1000 }
      request({
        url: '/product-variant',
        method: 'get',
        params: params
      })
      .then(response => {
        this.variantList = []
        this.variantList = response.product_variants
        console.log(this.variantList, 'after')
      })
    },
    removeProd (item) {
      // console.log(item)
      for (var i = 0; i < this.product.related_products.length; i++) {
        if (this.product.related_products[i] === item) {
          this.product.related_products.splice(i, 1)
        }
      }
      // console.log(this.product.related_products)
    },
    searchProd (val) {
      this.loadTable = true
      this.setSearchQuery(val)
      this.getProducts({
        page: this.productsPagination,
        search: val
      }).then(res => {
        this.loadTable = false
      })
      // console.log(val)
    },
    getProductData () {
      request({
        url: `/product/${this.productSlug}`,
        method: 'get',
        params: {
          lang: this.lang,
          onlyRelatedProducts: true
        }
      }).then((response) => {
        const { product } = response
        console.log('response', response)
        this.productId = product.id
        this.product.name = product.name
        this.product.description = product.description
        this.product.preview_text = product.preview_text
        this.product.order = product.order
        this.product.category_id = product.category.id
        this.product.brand_id = product.brand.id
        this.product.external_id = product.external_id
        this.product.code = product.code
        this.product.order = product.order || 1
        this.product.variants = product.variants && product.variants.map(item => {
          return { name: item.name, value: item.value.id }
        }) || []
        this.imageUrl = product.image
        this.product.image = product.image.split('/')[4]
        // console.log('this.price.price', this.price.price)
        this.price.price = product.price.price || 0
        this.price.old_price = product.price.old_price || 0
        this.unired.price = product.prices && product.prices[0].price || 0
        this.unired.old_price = product.prices && product.prices[0].old_price || 0
        this.product.active = product.active
        var isInBrands = false
        this.brands.map(brand => {
          if (brand.id === product.brand.id) {
            isInBrands = true
          }
        })
        if (!isInBrands) {
          this.brands.push({
            name: product.brand.name,
            id: product.brand.id
          })
        }
        this.product.meta.title = product.meta.title
        this.product.meta.description = product.meta.description
        this.product.meta.tags = product.meta.tags
        this.product.related_products = product.related_products
        this.product.additional_categories = product.additional_categories ? product.additional_categories.map(ac => ac.id) : []
        this.product.gallery = product.gallery ? product.gallery.map((img, idx) => {
          const filename = img.split('/')[4]
          return {
            filename,
            uid: idx
          }
        }) : []
        this.gallery = product.gallery ? product.gallery.map((img, idx) => ({
          type: 'image/jpg',
          status: 'done',
          uid: idx,
          url: img
        })) : []
        console.log('Properties', product.properties)
        this.productDefaultProperties = product.properties && product.properties.map(prop => {
          if (prop.property.type === 'checkbox') {
            console.log('prop.value', prop.value.map(item => item.value))
            return {
              ...prop,
              value: prop.value.map(item => item.value)
            }
          } else {
            return {
              ...prop,
              value: prop.value
            }
          }
        })

        this.productDefaultProperties.forEach(item => {
          this.checkedAttList.push({
            values: item.value,
            id: item.property.id,
            properties: item.property && item.property.options.filter(option => {
              console.log('Options', (option.value in item.value), option.value)
              if (item.value.includes(option.value)) {
                return option
              }
            })
          })
        })
        // console.log('response', response)
        return response
      }).then((data) => {
          console.log('data', data)
          const { product: { category: { slug: productCategorySlug }, properties: attrs } } = data
          this.getProductAttributes(productCategorySlug, attrs)
      }).catch((err) => console.error(err))
    },
    getProductAttributes (productCategorySlug, attrs) {
      request({
        url: `/category/${productCategorySlug}?lang=${this.lang}`,
        method: 'get'
      }).then(res => {
        console.log('res', res)
        console.log('res.category.product_properties', res.category.product_properties)
        const categoryProperties = res.category.product_properties || []
        this.productDefaultProperties && this.productDefaultProperties.map(prop => prop.property).forEach((prop) => {
          const a = categoryProperties.filter((cprop, i) => {
            return cprop.id === prop.id
          })
          if (!a.length) {
            categoryProperties.push(prop)
          }
        })
        this.productProperties = categoryProperties
        console.log('this.productProperties', this.productProperties)
      })
    },
    addProductProperty () {
      console.log('this.attrs_id', this.attrs_id)
      const selectedProductProperty = this.allProductProperties.find(prop => prop.id === this.attrs_id)
      console.log('selectedProductProperty', selectedProductProperty)
      this.productProperties = [...this.productProperties, selectedProductProperty]
      this.addAttrProductModal = false
    },
    openAddAttrs () {
      this.getAllAttrs({
        page: 1
      }).then(res => {
        this.addAttrProductModal = true
        this.allProductProperties = res.product_properties
      })
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
        this.product.gallery.push({
          filename: response.filename,
          uid: e.file.uid
        })
        console.log('this.product.gallery', this.product.gallery)
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
        this.product.image = response.filename
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
    // table
    fetchTableData () {
      this.modalVisible = true
      this.getProducts({ page: this.productsPagination, search: false }).then(res => console.log('res', res))
    },
    handleTableChange (pagination) {
       console.log('pagination', pagination)
       this.getProducts({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.$message.error(err))
    },
    // reviews
    handleReviewTableChange (pagination) {
      this.loadTable = true
       console.log('pagination', pagination)
       this.getReviews({ page: pagination, productSlug: this.productSlug })
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
        this.getReviews({ page: this.reviewsPagination, productSlug: this.productSlug })
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
    onRelatedProductsSelectChange (selectedRelatedProducts) {
      this.relatedProductsRow = selectedRelatedProducts
      // console.log(this.relatedProductsRow)
    },
    handleAddRelatedProducts () {
      // console.log('productsData', this.productsData)
      this.product.related_products = this.productsData.filter(product => {
        return this.selectedRowKeys.includes(product.id)
      })
      // console.log('this.product.related_products', this.product.related_products)
      this.modalVisible = false
    },
    getRelatedProductIds (relatedProducts) {
      // console.log('relatedProducts', relatedProducts)
      return relatedProducts ? relatedProducts.map(product => product.id).join(',') : ''
    },
    convertArrayToString (arr) {
      return arr ? arr.join(',') : ''
    },
    // submit form
    onSubmit () {
      // console.log('submit')
      const headers = {
        'Content-Type': 'application/json'
      }
      this.$refs.ruleForm.validate(valid => {
        // console.log('product', this.product)
        if (valid) {
          var url = `/product`
          var method = 'post'
          const variants = []
          this.product.variants.forEach(item => {
            if (item.value && item.name) {
              variants.push(item)
            }
          })
          // request for editing product by slug
          if (this.productSlug) {
            url = `/product/${this.productSlug}`
            method = 'put'
            // update product data
            this.$emit('clickParent', true)
            request({
              url,
              method,
              data: {
                ...this.product,
                additional_categories: this.convertArrayToString(this.product.additional_categories),
                gallery: this.product.gallery.map(item => item.filename).join(','),
                related_products: this.getRelatedProductIds(this.product.related_products),
                lang: this.lang || '',
                variants: variants
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
            const slug = this.productSlug
            // update product simple price
            request({
              url: `/product/${slug}/update-price`,
              method: 'put',
              data: this.price,
              headers: headers
            })
            .then(res => {
              console.log('res', res)
            })
            .catch(error => console.log('error', error))
            // update product unired price
            request({
              url: `/product/${slug}/update-price`,
              method: 'put',
              data: this.unired,
              headers: headers
            })
            .then(res => {
              console.log('res', res)
              if (this.$route.path !== '/catalog/products') {
                this.$router.replace('/catalog/products')
              }
            })
            .catch(error => console.error('error', error))
            .finally(() => {
              this.$emit('clickParent', false)
            })
            return
          }
           // Updating Price of created Product, only works when creating product
          if (this.priceUpdatable) {
            const slug = this.createdProductSlug || this.productSlug
            if (this.updatePriceOnly) {
            this.$emit('clickParent', true)
            request({
              url: `/product/${slug}/update-price`,
              method: 'put',
              data: this.price,
              headers: headers
            })
            .then(res => {
              console.log('res', res)
            })
            .catch(error => console.error('error', error))
            request({
              url: `/product/${slug}/update-price`,
              method: 'put',
              data: this.unired,
              headers: headers
            })
            .then(res => {
              console.log('res', res)
              if (this.$route.path !== '/catalog/products') {
                this.$router.replace('/catalog/products')
              }
            })
            .catch(error => console.error('error', error))
            .finally(() => {
              this.$emit('clickParent', false)
            })
            return
            }
          }
          // console.log(this.product, ' on submit')
          // request for creating or editing product
          this.$emit('clickParent', true)
          request({
              url: url,
              method: method,
              data: {
                ...this.product,
                additional_categories: this.convertArrayToString(this.product.additional_categories),
                gallery: this.product.gallery.map(item => item.filename).join(','),
                related_products: this.getRelatedProductIds(this.product.related_products),
                lang: this.lang || '',
                variants: variants
              },
              headers: headers
          }).then(res => {
            // console.log('res', res)
            this.createdProductSlug = res.product.slug
            this.priceUpdatable = true
            this.activeTabKey = '5'
            this.updatePriceOnly = true
            this.productId = res.product.id
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
        this.product.gallery = this.product.gallery.reduce((acc, item) => {
          const uids = fileList.map(item => item.uid)
          if (uids.includes(item.uid)) acc.push(item)
          return acc
        }, [])
        console.log('this.product.gallery', this.product.gallery)
      }
    },
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    // product attributes
    debouncedRequest (value, id) {
      this.loading = true
      // console.log('id', id)
      const headers = {
            'Content-Type': 'application/json'
      }
      request({
              url: `/product/${this.productId}/update-property`,
              method: 'put',
              data: {
                property_id: id,
                value
              },
              headers: headers
          })
          .then(res => console.log('res', res))
          .catch(err => console.error(err))
          .finally(() => (this.loading = false))
    },
    handleProperty (e, type, id) {
      this.attVariantsList = []
      this.loading = true
      let value
      if (type === 'radio') {
        value = e.target.value
      } else {
        value = e
      }
      // console.log('value', value)
      // console.log('id', id, this.checkedAttList.indexOf(this.checkedAttList.find(item => item.id === id)))
      const indexOfProperty = this.checkedAttList.indexOf(this.checkedAttList.find(item => item.id === id))
      if (indexOfProperty >= 0) {
        this.checkedAttList[indexOfProperty].values = value
        const prodProp = this.productProperties.find(item => item.id === id)
        this.checkedAttList[indexOfProperty].properties = prodProp.options.filter(option => {
          if (value.includes(option.value)) {
            return option
          }
        })
      } else {
        const prodProp = this.productProperties.find(item => item.id === id)
        this.checkedAttList.push({
          values: value,
          id: id,
          properties: prodProp.options.filter(option => {
            if (value.includes(option.value)) {
              return option
            }
          })
        })
      }
      const properties = this.checkedAttList.find(item => item.id === id)
      const headers = {
        'Content-Type': 'application/json'
      }
      request({
              url: `/product/${this.productId}/update-property`,
              method: 'put',
              data: {
                property_id: id,
                value: properties.properties
              },
              headers: headers
          })
          .then(res => console.log('res', res))
          .catch(err => console.error(err))
          .finally(() => (this.loading = false))
    },
    setDefaultProperty (propId) {
      var result = []
      if (this.productDefaultProperties && this.productDefaultProperties.length) {
        for (let i = 0; i < this.productDefaultProperties.length; i++) {
          if (this.productDefaultProperties[i] && this.productDefaultProperties[i].property.id === propId) {
            result = this.productDefaultProperties[i].value
          }
        }
      }
      return result
    }
  }
}
</script>
<style lang="less" scoped>
  .attributes > * {
    margin-bottom: 25px;
    width: 100%;
  }

  .propertyLabel {
    display: block;
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
  }

  .product-variants {
    &__item {
      padding: 10px 0;
      border-bottom: 1px solid #d9d9d9;
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
    }
  }
</style>
