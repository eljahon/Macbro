<template>
  <div>
    <a-switch
      slot="extra"
      v-model="category.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0; height: 32px"
      test-attr="active-category"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="category"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-tabs type="card" v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('basicSettings')">
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('category_name')" prop="name">
                <a-input
                  size="large"
                  v-model="category.name"
                  test-attr="name-category"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="this.categorySlug" :span="12" style="padding: 0 15px">
              <a-form-model-item ref="url" :label="$t('category_url')" prop="url">
                <a-input
                  size="large"
                  disabled
                  v-model="categorySlug"
                  test-attr="slug-category"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('position')" prop="order">
                <a-input
                  size="large"
                  type="number"
                  v-model="category.order"
                  test-attr="order-category"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :lg="12" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item :label="$t('parentCategory')">
                <treeselect
                  size="large"
                  style="width: 100%"
                  id="selectCategory"
                  v-model="category.parent_id"
                  :multiple="false"
                  :set-fields-value="category.parent_id"
                  :options="getAllCategories"
                  :placeholder="$t('selectCategory')"
                  test-attr="parent_id-category"
                />
                <a-icon slot="suffixIcon" :component="$myIcons.arrowDown" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :style="{ minHeight: '180px', padding: '0 15px' }">
              <a-form-item :label="$t('image')">
                <a-upload
                  :custom-request="uploadImage"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  test-attr="image-category"
                >
                  <a-icon :type="loading ? 'loading' : ''" class=" iconLoading " style="color: #00A0E9"/>
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="max-width: 100%" />
                  <div v-else>
                    <!--                    <a-icon :type="loading ? 'loading' : 'plus'" />-->
                    <div class="ant-upload-text">
                      {{ $t('uploadCategoryImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="category.description" test-attr="description-category"></tinymce>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0px 15px 15px;">
              <a-form-model-item ref="seo_description" :label="$t('seo_description')" prop="seo_description">
                <tinymce v-model="category.seo_description" test-attr="seo_description-category"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-tab-pane>
          <a-tab-pane key="2" tab="SEO">
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item :label="$t('meta_title')">
                  <a-input size="large" type="text" v-model="category.meta.title" :placeholder="$t('meta_title')" test-attr="meta_title-category"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item :label="$t('meta_description')">
                  <a-input size="large" type="text" v-model="category.meta.description" :placeholder="$t('meta_description')" test-attr="meta_description-category"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item :label="$t('meta_tags')">
                  <a-input size="large" type="text" v-model="category.meta.tags" :placeholder="$t('meta_tags')" test-attr="meta-tags-category"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="$t('attributes')">
            <a-card :title="$t('attributes')">
              <a-tooltip placement="right">
                <template slot="title">
                  <span>Привязка атрибутов к категории и фильтру</span>
                </template>
                <a-button :style="{ margin: '0 0 1rem 0' }" @click="addAttr" type="primary" test-attr="add-atr-category">{{ $t('add_attr') }}</a-button>
              </a-tooltip>
              <a-row>
                <a-table
                  :columns="columns"
                  :dataSource="tableAttrData"
                  :rowKey="record => record.id"
                  test-attr="attr-list-category"
                >
                  <template slot="status" slot-scope="is_active">
                    <status-tag
                      :active="is_active"
                      default-val
                    />
                  </template>
                  <template slot="action" slot-scope="item">
                    <a-tooltip>
                      <template slot="title">{{ $t('delete') }}</template>
                      <a-button id="buttonDelete" @click="removeAttr(item)" type="danger" icon="delete" test-attr="delete-attr-category"></a-button>
                    </a-tooltip>
                  </template>
                </a-table>
              </a-row>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-row>
      <a-modal v-model="isOpenAttrAdd" :title="`${$t('add_attr')} (Привязка атрибутов к категории и фильтру):`" width="600px">
        <a-row>
          <a-col :span="24">
            <a-select
              mode="multiple"
              size="large"
              :placeholder="$t('add_attr')"
              style="width: 100%"
              v-model="attributes"
              :filter-option="filterOption"
              test-attr="attributes-category"
            >
              <a-select-option v-for="(item, i) in allAttrs" :key="i + item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <template slot="footer">
          <a-button @click="closeModal" key="back" test-attr="cancel-category">
            {{ $t('cancel') }}
          </a-button>
          <a-button key="submit" type="primary" @click="addAttributes" test-attr="add-category">
            {{ $t('add') }}
          </a-button>
        </template>
      </a-modal>
    </a-form-model>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
function getCategoriesTree (categories) {
  if (categories) {
    console.log(categories, 'categories')
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
export default {
  props: {
  // eslint-disable-next-line
    lang: String
  },
  components: {
    'tinymce': tinymce,
    Treeselect
  },
  data () {
    return {
      categorySlug: this.$route.params.id,
      activeTabKey: '1',
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      imageUrl: '',
      // tabCategories is for tabs/lang change
      tabCategories: [],
      category: {
        name: '',
        parent_id: null,
        order: 0,
        meta: {
          description: '',
          tags: '',
          title: ''
        },
        description: '',
        seo_description: '',
        image: '',
        active: true,
        product_property_groups: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        order: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
      },
      isOpenAttrAdd: false,
      attributes: [],
      tableAttrData: [],
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
  mounted () {
    this.getAllAttrs()
    if (this.categorySlug) this.getCategoryAttrs(this.categorySlug)
    this.getCategories({ page: null, lang: this.lang, search: false })
      .then(() => {
        this.tabCategories = this.categories
      })
      .catch(err => console.error(err.message))
  },
  computed: {
    ...mapGetters(['categories', 'allAttrs']),
    getAllCategories () {
      return getCategoriesTree(this.tabCategories)
    }
  },
  methods: {
    ...mapActions(['getCategories', 'getAllAttrs']),
    getCategoryAttrs () {
      request({
        url: `/category/${this.categorySlug}?lang=${this.lang}`,
        method: 'get'
      }).then((response) => {
        console.log('response', response)
        this.category.active = response.category.active
        this.category.name = response.category.name
        this.category.description = response.category.description
        this.category.seo_description = response.category.seo_description
        this.category.order = response.category.order
        this.category.parent_id = response.category.parent.id || null
        this.category.image = response.category.image.split('/')[4]
        this.imageUrl = response.category.image
        this.category.meta = response.category.meta
        this.tableAttrData = response.category.product_properties
        if (response.category.product_properties) {
          this.attributes = response.category.product_properties.map(e => {
            return e.id
          })
        }
      })
    },
    uploadImage (e) {
      this.loading = true
      this.$store.dispatch('setButton', this.loading)
      console.log(e)
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      }).then(response => {
        getBase64(e.file, imageUrl => {
          this.imageUrl = imageUrl
          setTimeout(() => {
            this.loading = false
            this.$store.dispatch('setButton', this.loading)
          }, 3000)
        })
        this.category.image = response.filename
        console.log('response', response)
        })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        console.log(this.form)
        if (valid) {
          var url = '/category'
          var method = 'post'
          if (this.categorySlug) {
            url = `/category/${this.categorySlug}`
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
                ...this.category,
                product_properties: this.attributes.toString(),
                lang: this.lang || 'ru'
              },
              headers: headers
          })
          .then(res => {
            console.log('response after submit', res)
            if (this.$route.path !== '/catalog/categories') {
              this.$router.replace('/catalog/categories')
            }
          })
          .catch(err => {
            console.log(err)
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
    removeAttr (item) {
      for (var i = 0; i < this.tableAttrData.length; i++) {
        if (item.id === this.tableAttrData[i].id) {
          this.tableAttrData.splice(i, 1)
        }
      }
      for (var j = 0; j < this.attributes.length; j++) {
        if (item.id === this.attributes[j]) {
          this.attributes.splice(j, 1)
        }
      }
    },
    addAttributes () {
      const attrs = this.allAttrs
      const chooseAttrs = this.attributes
      console.log(attrs)
      this.tableAttrData = []
      if (chooseAttrs.length > 0) {
        for (var i = 0; i < chooseAttrs.length; i++) {
          for (var j = 0; j < attrs.length; j++) {
            if (chooseAttrs[i] === attrs[j].id) {
              this.tableAttrData.push(attrs[j])
            }
          }
        }
        this.isOpenAttrAdd = false
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    addAttr () {
      this.isOpenAttrAdd = true
    },
    closeModal () {
      this.isOpenAttrAdd = false
    }
  }
}
</script>

<style>
.avatar-uploader {
  position: relative;
  cursor: pointer;
}
.iconLoading{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50% -50%);
}
</style>
