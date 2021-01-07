<template>
  <a-modal width="800px" v-model="isOpen" @cancel="hide" :title="$t('attribute_create')">
    <div style="height:400px; overflow-y: scroll">
      <a-row>
        <a-col :span="12" style="padding-right: 15px">
          <a-form-model-item ref="name" :label="`${$t('attr_name')} (Появится на сайте):`" prop="name">
            <a-input style="margin-left:0px; margin-right: 0px" v-model="create.name" type="text" :placeholder="$t('attr_name')" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding-left: 15px">
          <a-form-model-item ref="name" :label="$t('attribute_type')">
            <a-select
              show-search
              style="width: 100%"
              v-model="create.type"
              :placeholder="$t('attribute_type')"
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="type in types"
                :key="type.value"
                :value="type.value"
              >{{ type.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12" style="padding-right: 15px">
          <a-form-model-item :label="`${$t('description')} (Полное название атрибута):`">
            <a-input v-model="create.description" type="text" :placeholder="$t('description')" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding-left: 15px">
          <a-form-model-item :label="$t('order_no')">
            <a-input v-model="create.order" type="number" :placeholder="$t('order_no')" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-card v-if="create.type" style="margin: 10px 0; border: 3px solid rgb(184, 182, 182)" :title="$t('preview')">
        <h3><strong>{{ create.name ? create.name : 'Example' }}</strong></h3>
        <div v-if="create.type == 'radio'">
          <a-radio-group>
            <a-radio v-for="item in options" :key="'radio' + item.name" :value="item.name">
              {{ item.name === '' ? 'Example' : item.name }}
            </a-radio>
          </a-radio-group>
        </div>
        <div v-if="create.type == 'select'">
          <a-select default-value="Example" style="width: 250px">
            <a-select-option v-for="item in options" :key="'select' + item.name">
              {{ item.name === '' ? 'Example' : item.name }}
            </a-select-option>
          </a-select>
        </div>
        <div v-if="create.type == 'checkbox'">
          <a-checkbox-group>
            <a-row>
              <a-col v-for="item in options" :key="'checkbox' + item.name" :span="24">
                <a-checkbox :value="'checkbox' + item.name">
                  {{ item.name === '' ? 'Example' : item.name }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <div v-if="create.type == 'text'">
          <a-input default-value="Example" style="width: 250px" placeholder="Text" />
        </div>
        <div v-if="create.type == 'number'">
          <a-input default-value="0" style="width: 250px" type="number" placeholder="Number" />
        </div>
      </a-card>
      <a-card v-if="create.type && create.type != 'text' && create.type != 'number'" :title="$t('parameter')">
        <a-row v-for="(option,i) in options" :key="i">
          <a-col :span="12" style="padding: 0 15px">
            <a-form-model-item :label="$t('option_name')">
              <a-input v-model="option.name" type="text" :placeholder="$t('option_name')" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="padding: 0 15px">
            <a-form-model-item :label="`${$t('code')} (значение):`">
              <a-row>
                <a-col :span="20">
                  <a-input v-model="option.value" type="text" :placeholder="$t('code')" />
                </a-col>
                <a-col :span="4">
                  <a-button @click="removeAttr(i)" type="danger" style="margin-left: 20px" shape="circle" icon="delete"/>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-button @click="addAttr" style="width: 97%;margin: 0 1.5%" type="dashed" icon="plus">
              {{ $t('add') }}
            </a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <template slot="footer">
      <a-button key="back" @click="hide">
        {{ $t('cancel') }}
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="save">
        {{ !create.edit ? $t('save') : $t('update') }}
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      isOpen: false,
      create: {
        type: null
      },
      loading: false,
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
      ],
      options: [
        {
          name: '',
          value: null
        }
      ]
    }
  },
  // mounted () {
  //   this.getAllAttrs()
  // },
  methods: {
    ...mapActions(['createAttrs', 'getAllAttrs', 'updateAttrs']),
    show () {
      this.isOpen = true
    },
    hide () {
      this.isOpen = false
      this.loading = false
      this.clear()
    },
    clear () {
      this.create = {
        type: null
      }
      this.options = [
        {
          name: '',
          value: null
        }
      ]
    },
    handleOk () {
      this.hide()
    },
    addAttr () {
      this.options.push({
        name: '',
        value: null
      })
    },
    removeAttr (i) {
      this.options.splice(i, 1)
    },
    optionsChecking () {
      const array = this.options
      if (this.create.type === 'text' || this.create.type === 'number') {
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
    save () {
      const data = this.create
      if (data.name && data.type && this.optionsChecking() && this.dublicatProducts(this.options)) {
        const file = {
          active: true,
          description: data.description,
          name: data.name,
          order: data.order,
          type: data.type,
          options: (this.create.type === 'text' || this.create.type === 'number') ? [] : this.options,
          id: data.id ? data.id : undefined
        }
        this.loading = true
        console.log(file)
        if (this.create.edit) {
          this.updateAttrs({ files: file, edit: this.create.edit }).then(res => {
            this.getAllAttrs()
            this.loading = false
            this.hide()
            this.$message.success(this.$t('successfullyUpdated'))
          }).catch(err => {
            this.$message.error(err.message)
            this.loading = false
          })
        } else {
          this.createAttrs(file).then(res => {
            this.loading = false
            this.getAllAttrs()
            this.hide()
          }).catch(err => {
            this.$message.error(err.message)
            this.loading = false
          })
        }
      } else if (!data.name || !data.type) this.$message.error(this.$t('failedData'))
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style scoped>
.colo {
  color: rgb(184, 182, 182);
}
</style>
