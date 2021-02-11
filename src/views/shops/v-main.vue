<template>
  <div>
    <a-switch
      slot="extra"
      v-model="shop.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="shop"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
        <a-tab-pane key="1" :tab="$t('basicSettings')">
          <a-row>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('shop_name')" prop="name">
                <a-input
                  v-model="shop.name"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="area" :label="$t('area')" prop="area">
                <a-select
                  v-model="shop.area"
                  :placeholder="this.$t('area')">
                  <a-select-option
                    title="Tashkent"
                    key="tashkent"
                    value="tashkent_city">
                    Ташкент
                  </a-select-option>
                  <!-- <a-select-option
                    title="Samarkand"
                    key="samarkand"
                    value="samarkand">
                    Самарканд
                  </a-select-option> -->
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="this.shopSlug" :span="12" style="padding: 0 15px">
              <a-form-model-item ref="url" :label="$t('url')" prop="url">
                <a-input
                  disabled
                  v-model="shopSlug"
                />
              </a-form-model-item>
            </a-col>
            <!-- number -->
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="phoneNumber" :label="$t('phone_number')" prop="phoneNumber">
                <a-input
                  v-model="shop.phone"
                />
              </a-form-model-item>
            </a-col>
            <!-- work hours -->
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="workingHours" :label="$t('working_hours')" prop="workingHours">
                <a-input
                  v-model="shop.working_hours"
                />
              </a-form-model-item>
            </a-col>
            <!-- address 1 -->
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="address" :label="$t('address')" prop="address">
                <a-input
                  v-model="shop.address"
                />
              </a-form-model-item>
            </a-col>
            <!-- address 2 -->
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="address2" :label="$t('address2')" prop="address2">
                <a-input
                  v-model="shop.address2"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item :label="$t('uploadImage')">
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
                      {{ $t('uploadImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="map" :label="$t('map')" prop="map">
                <yandex-map
                  v-if="this.coords.length"
                  :coords="coords"
                  v-model="coords"
                  :zoom="18"
                  @click="onLocationChange"
                  style="width: 100%; max-width: 1000px; height: 80vh;"
                >
                  <ymap-marker
                    :coords="coords"
                    marker-id="123"
                    hint-content="point"
                  />
                </yandex-map>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="previewText" :label="$t('preview_text')" prop="previewText">
                <tinymce v-model="shop.preview_text"></tinymce>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="shop.description"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('products')">
          <a-card>
            <a-card>
              <a-row type="flex" justify="space-between">
                <a-col :span="4"><a-button type="primary" @click="createProduct" icon="plus">{{ $t('add_product') }}</a-button></a-col>
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
                          <a-button id="buttonSearch" type="default" html-type="submit" icon="search">{{ $t('search') }}</a-button>
                        </a-form-item>
                      </a-col> -->
                    </a-row>
                  </a-form>
                </a-col>
              </a-row>
            </a-card>
            <a-row>
              <a-table
                :columns="columns"
                :dataSource="getShopProducts"
                :rowKey="record => record.product.id"
                :pagination="productPagination"
                @change="shopProductChange"
                :loading="loadingTable"
              >
                <template slot="status" slot-scope="is_active">
                  <a-tag v-if="is_active" color="#108ee9">
                    {{ $t('active') }}
                  </a-tag>
                  <a-tag v-else color="#f50">
                    {{ $t('inactive') }}
                  </a-tag>
                </template>
                <template slot="action" slot-scope="item">
                  <a-tooltip><template slot="title">{{ $t('update') }}</template>
                    <a-button id="buttonUpdate" type="primary" @click="editProduct(item)" icon="edit"></a-button>
                  </a-tooltip>
                </template>
              </a-table>
            </a-row>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
    <a-modal v-model="productModal" width="50vw" :title="$t('add_product')" @ok="handleOk">
      <a-row>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('product')" prop="product">
            <a-auto-complete
              :data-source="allProd"
              v-model="edit.product"
              style="width: 100%"
              :placeholder="$t('product')"
              v-debounce="selectDebounce"
            >
            </a-auto-complete>
            <!-- <a-select
              v-model="edit.product"
              :placeholder="$t('product')"
              style="width: 100%"
              show-search
              v-debounce="selectDebounce"

            >
              <a-select-option v-for="(item, i) in allProd" :key="i" :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select> -->
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('quantity')" prop="name">
            <a-input
              v-model="edit.quantity"
              type="number"
              :placeholder="$t('quantity')"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    'a-auto-complete': AutoComplete,
    'tinymce': tinymce
  },
  props: {
  // eslint-disable-next-line
    lang: String
  },
  data () {
    return {
      coords: [41.304638, 69.3077],
      activeTabKey: '1',
      shopSlug: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      productModal: false,
      edit: {
        product: null,
        quantity: null
      },
      loadprod: false,
      // urls of images to show user
      imageUrl: '',
      shop: {
        name: '',
        description: '',
        preview_text: '',
        area: 'tashkent_city',
        // urls of images to post to API
        image: '',
        active: true,
        phone: '',
        address: '',
        address2: '',
        loc: {
            lat: 0,
            long: 0
        }
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      },
      columns: [
        {
          title: this.$t('product_name'),
          dataIndex: 'product.name'
        },
        {
          title: this.$t('category'),
          dataIndex: 'product.category.name'
        },
        {
          title: this.$t('quantity'),
          dataIndex: 'quantity'
        },
        {
          title: this.$t('status'),
          dataIndex: 'product.active',
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
  mounted () {
    if (this.shopSlug) {
      this.getShopAttrs(this.shopSlug).then(res => {
        this.loadingTable = true
        this.getProductsByShop({ id: this.shopId }).then(res => {
          this.loadingTable = false
        })
      })
      this.getAllProducts()
    }
    this.getShops()
  },
  computed: {
    ...mapGetters(['shopsData', 'shopProducts', 'shopProductPagination', 'allProducts']),
    getAllShops () {
      return this.shopsData
    },
    getShopProducts () {
      return this.shopProducts
    },
    productPagination () {
      return this.shopProductPagination
    },
    allProd () {
      if (this.allProducts) {
        return this.allProducts.map(e => {
          return {
            text: e.name,
            value: e.id
          }
        })
      } else return []
    }
  },
  // watch: {
  //   'edit.product': function (val) {
  //     console.log(val)
  //   }
  // },
  methods: {
    ...mapActions(['getShops', 'getProductsByShop', 'getAllProducts', 'updateQuantity']),
    getShopAttrs () {
      return new Promise((resolve) => {
        request({
          url: `/shop/${this.shopSlug}?lang=${this.lang}`,
          method: 'get'
        }).then((response) => {
          resolve()
          console.log('response', response)
          const { shop: { id, name, description, area, preview_text: previewText, loc, active, image, phone, address, address2, working_hours: workingHours } } = response
          this.shopId = id
          this.shop.name = name
          this.shop.description = description
          this.shop.preview_text = previewText
          this.shop.area = area
          this.shop.active = active
          this.shop.phone = phone
          this.shop.address = address
          this.shop.address2 = address2
          this.shop.working_hours = workingHours
          this.shop.loc.lat = loc.lat
          this.shop.loc.long = loc.long
          this.coords = new Array(2)
          this.coords[0] = loc.lat
          this.coords[1] = loc.long
          // image's filename to send to /upload to when editing
          this.shop.image = image.split('/')[4] || ''
          // images' urls to show images to user
          this.imageUrl = image
        })
      })
    },
    createProduct () {
      this.edit.product = null
      this.edit.quantity = undefined
      this.productModal = !this.productModal
    },
    editProduct (e) {
      console.log(e)
      this.getAllProducts(e.product.name).then(res => {
        console.log(this.allProd)
        console.log(e.product.name)
        this.edit.product = e.product.id
        this.edit.quantity = e.quantity
        this.productModal = !this.productModal
      })
    },
    handleOk () {
      if (this.edit.product != null && this.edit.quantity != null && this.edit.quantity >= 0) {
        console.log(this.edit.product)
        this.updateQuantity({
          id: this.shopSlug,
          files: {
            product_id: this.edit.product,
            quantity: parseInt(this.edit.quantity)
          }
        }).then(res => {
          this.loadingTable = true
          this.getProductsByShop({ id: this.shopId }).then(res => {
            this.loadingTable = false
          })
          this.productModal = !this.productModal
          console.log(res)
        })
      } else this.$message.error('Product or Quantity Error Value')
    },
    clearProduct () {
      this.edit.product = null
      console.log(this.edit.product)
      console.log('click')
    },
    shopProductChange (e) {
      this.loadingTable = true
      this.getProductsByShop({ id: this.shopId, page: e }).then(res => {
        this.loadingTable = false
      })
    },
    debouncedSearch (e) {
      this.loadingTable = true
      this.getProductsByShop({ id: this.shopId, search: e }).then(res => {
        this.loadingTable = false
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
        console.log('response', response)
        getBase64(e.file, imageUrl => {
            this.imageUrl = imageUrl
            this.loading = false
            })
        this.shop.image = response.filename
        })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    onLocationChange (e) {
        this.coords = e.get('coords')
        console.log('this.coords', this.coords)
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/shop'
          var method = 'post'
          if (this.shopSlug) {
            url = `/shop/${this.shopSlug}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          request({
              url: url,
              method: method,
              data: {
                ...this.shop,
                loc: {
                    lat: this.coords[0], // lat
                    long: this.coords[1] // long
                },
                lang: this.lang ?? 'ru'
              },
              headers: headers
          })
          .then(res => {
            console.log('response after submit', res)
            if (this.$route.path !== '/shops/list') {
              this.$router.replace('/shops/list')
            }
          })
          .catch(err => {
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
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    selectDebounce (e) {
      this.loadprod = true
      this.getAllProducts(e).then(res => {
        this.loadprod = false
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style>
</style>
