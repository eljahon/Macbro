<template>
  <div>
    <div>
      <a-row>
        <a-col :span="12" style="padding-right: 15px">
          <a-form-model-item ref="name" :label="`${$t('attr_name')} (Появится на сайте):`" prop="name">
            <a-input
              test-attr="name-attribute"
              style="margin-left:0px; margin-right: 0px"
              v-model="productProperty.name"
              type="text"
              :placeholder="$t('attr_name')"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding-left: 15px">
          <a-form-model-item ref="name" :label="$t('attribute_type')">
            <a-select
              test-attr="property-type-attribute"
              show-search
              style="width: 100%"
              v-model="productProperty.type"
              :placeholder="$t('attribute_type')"
              :filter-option="filterOption"
            >
              <a-select-option v-for="type in types" :key="type.value" :value="type.value">{{
                type.name
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12" style="padding-right: 15px">
          <a-form-model-item :label="`${$t('description')} (Полное название атрибута):`">
            <a-input v-model="productProperty.description" type="text" :placeholder="$t('description')" test-attr="description-attribute" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding-left: 15px">
          <a-form-model-item :label="$t('order_no')">
            <a-input v-model="productProperty.order" type="number" :placeholder="$t('order_no')" test-attr="order-attribute"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-card
        v-if="productProperty.type"
        style="margin: 10px 0; border: 3px solid rgb(184, 182, 182)"
        :title="$t('preview')"
      >
        <h3>
          <strong>{{ productProperty.name || 'Example' }}</strong>
        </h3>
        <div v-if="productProperty.type == 'radio'">
          <a-radio-group>
            <a-radio v-for="item in productProperty.options" :key="'radio' + item.name" :value="item.name" test-attr="option-attribute">
              {{ item.name === '' ? 'Example' : item.name }}
            </a-radio>
          </a-radio-group>
        </div>
        <div v-if="productProperty.type == 'select'">
          <a-select default-value="Example" style="width: 250px">
            <a-select-option v-for="item in productProperty.options" :key="'select' + item.name" test-attr="name-attribute">
              {{ item.name === '' ? 'Example' : item.name }}
            </a-select-option>
          </a-select>
        </div>
        <div v-if="productProperty.type == 'checkbox'">
          <a-checkbox-group>
            <a-row>
              <a-col v-for="item in productProperty.options" :key="'checkbox' + item.name" :span="24">
                <a-checkbox :value="'checkbox' + item.name" test-attr="options-attribute">
                  {{ item.name === '' ? 'Example' : item.name }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <div v-if="productProperty.type == 'text'">
          <a-input default-value="Example" style="width: 250px" placeholder="Text" test-attr="type-attribute" />
        </div>
        <div v-if="productProperty.type == 'number'">
          <a-input default-value="0" style="width: 250px" type="number" placeholder="Number" test-attr="type-attribute" />
        </div>
      </a-card>
      <a-card
        v-if="productProperty.type && productProperty.type != 'text' && productProperty.type != 'number'"
        :title="$t('parameter')"
      >
        <a-row v-for="(option, i) in productProperty.options" :key="i" type="flex" class="attribute-options-item">
          <a-col :span="12" style="padding: 0 15px">
            <a-form-model-item :label="$t('option_name')">
              <div>
                <a-input v-model="option.name" type="text" :placeholder="$t('option_name')" test-attr="options-name-attribute"/>
              </div>
            </a-form-model-item>
            <a-form-model-item :label="$t('order_no')">
              <div>
                <a-input-number
                  v-model="option.order"
                  test-attr="options-order-attribute"
                  :min="1"
                  :placeholder="$t('orderno')"
                />
                <!-- <a-input v-model="option.order" type="text" :placeholder="$t('option_name')" test-attr="options-name-attribute"/> -->
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" style="padding: 0 15px">
            <a-form-model-item :label="`${$t('code')} (значение):`">
              <div>
                <a-input
                  v-model="option.value"
                  type="text"
                  :placeholder="$t('code')"
                  test-attr="options-value-attribute"
                />
              </div>
            </a-form-model-item>
            <a-form-model-item :label="`Екстра`" v-if="productPropertySlug === 'color'">
              <div class="form__input">
                <v-swatches
                  test-attr="options-value-attribute"
                  v-model="option.extra"
                  show-fallback
                  fallback-input-type="color"
                  popover-x="left"
                ></v-swatches>
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="4" style="align-items: center;display: flex;">
            <a-button
              test-attr="remove-option-attribute"
              @click="removeAttr(i)"
              type="danger"
              style="margin-left: 20px"
              shape="circle"
              icon="delete"
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-button @click="addAttr" style="width: 97%;margin: 0 1.5%" type="dashed" icon="plus" test-attr="add-option-attribute">
              {{ $t('add') }}
            </a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapActions } from 'vuex'
export default {
  props: {
    lang: {
      type: String,
      default: 'ru'
    }
  },
  data () {
    return {
      loading: false,
      productPropertySlug: this.$route.params.id,
      productProperty: {
        name: '',
        active: true,
        description: '',
        order: null,
        options: [
          {
            name: '',
            value: null
          }
        ],
        type: ''
      },
      types: [
        {
          name: 'Select',
          value: 'select'
        },
        {
          name: 'Checkbox',
          value: 'checkbox'
        },
        {
          name: 'Radio',
          value: 'radio'
        },
        {
          name: 'Number',
          value: 'number'
        },
        {
          name: 'Text',
          value: 'text'
        }
      ]
    }
  },
  mounted () {
    if (this.productPropertySlug) {
      this.getProductPropertyAttrs()
    }
  },
  methods: {
    ...mapActions(['createAttrs', 'getAllAttrs', 'updateAttrs', 'getAttrsById']),
    getProductPropertyAttrs () {
      request({
        url: `/product-property/${this.productPropertySlug}?lang=${this.lang}`,
        method: 'get'
      }).then(response => {
        console.log('response', response)
        const {
          product_property: { active, options, order, description, name, type }
        } = response
        this.productProperty.active = active
        this.productProperty.name = name
        this.productProperty.options = options
        this.productProperty.order = order
        this.productProperty.description = description
        this.productProperty.type = type
      })
    },
    addAttr () {
      this.productProperty.options.push({
        name: '',
        value: null
      })
      console.log('this.productProperty', this.productProperty)
    },
    removeAttr (i) {
      this.productProperty.options.splice(i, 1)
    },
    optionsChecking () {
      const array = this.productProperty.options
      if (this.productProperty.type === 'text' || this.productProperty.type === 'number') {
        return true
      }
      if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
          if (!array[i].name || !array[i].value) {
            this.$message.error(this.$t('attr_failed'))
            return false
          }
        }
        return true
      } else this.$message.error(this.$t('attr_empty'))
    },
    dublicatProducts (array) {
      if (array.length > 1) {
        var sortArray = []
        var havDublicate = true
        for (var i = 0; i < array.length; i++) {
          sortArray.push(Object.values(array[i])[1])
        }
        sortArray.filter((item, index) => {
          if (sortArray.indexOf(item) !== index) {
            this.$message.error(`${index + 1} - ${this.$t('attr_dublicate')}`)
            havDublicate = false
          }
        })
        return havDublicate
      } else return true
    },

    lockAttr (item) {
      console.log(item)
      this.updateAttrs(item)
        .then(res => {
          this.getAllAttrs()
        })
        .catch(err => {
          this.$message.error(err.message)
          this.loading = false
        })
    },
    save () {
      const data = this.productProperty
      if (data.name && data.type && this.optionsChecking() && this.dublicatProducts(data.options)) {
        let url = '/product-property'
        let method = 'post'
        if (this.productPropertySlug) {
          url = `/product-property/${this.productPropertySlug}`
          method = 'put'
        }
        const headers = {
          'Content-Type': 'application/json'
        }
        this.$emit('clickParent', true)
        request({
          url,
          method,
          data: {
            ...this.productProperty,
            options: this.productProperty.options.map(opt => {
              delete opt.id
              return opt
            }),
            lang: this.lang || 'ru'
          },
          headers
        })
          .then(res => {
            console.log(res)
            if (this.$route.path !== '/catalog/attribute/list') {
              this.$router.replace('/catalog/attribute/list')
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error(this.$t('error'))
          })
          .finally(() => {
            this.$emit('clickParent', false)
          })
      } else {
        this.$message.error(this.$t('failedData'))
      }
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    resetForm () {
      this.productProperty = {
        name: '',
        active: true,
        description: '',
        order: null,
        options: [
          {
            name: '',
            value: null
          }
        ],
        type: ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.colo {
  color: rgb(184, 182, 182);
}
.attribute-options-item {
  border-bottom: 1px solid #ededed;
}
.attribute-options-item:last-child {
  border-bottom: none;
}
</style>
