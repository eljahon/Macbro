<template>
  <page-header-wrapper :title="false">
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <a-card >
          <a-row v-if="true" type="flex" justify="end">
            <a-col span="auto">
              <div class="table-operations mb-2">
                <a-button @click="openNewModal">
                  {{ $t('blogs.settings.button.category') }}
                </a-button>
              </div>
            </a-col>
            <a-col :span="24">
              <a-table :columns="columns" :data-source="categories">
                <span slot="created_at" slot-scope="text">{{ getTime(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
                <span slot="updated_at" slot-scope="text">{{ getTime(text.updated_at) | moment('DD.MM.YY HH:mm') }}</span>
                <span slot="action" slot-scope="text">
                  <a-row type="flex">
                    <a-col span="auto">
                      <a-popconfirm
                        title="Вы уверены, что хотите удалить эту категорию?"
                        ok-text="Yes"
                        cancel-text="No"
                        @confirm="confirm(text)"
                        @cancel="cancel"
                      >
                        <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                          <a-button class="mx-1" type="danger" icon="delete" />
                        </a-tooltip>
                      </a-popconfirm>
                    </a-col>
                    <a-col span="auto">
                      <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                        <a-button @click="editRowHandler(text)" type="primary" icon="edit" />
                      </a-tooltip>
                    </a-col>
                  </a-row>
                </span>
              </a-table>
            </a-col>
          </a-row>
          <a-row v-else type="flex" justify="center" align="bottom" style="height: 100%">
            <a-col span="auto">
              <EmptyLogo />
              <h3 class="text-center" style="text-align: center; font-weight: 400; color: LightGray">
                Выберите действие, чтобы продолжить процесс
              </h3>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <Modal
        :visible="visible"
        :category="form"
        :formType="formType"
        :actionHandler="formType == 'new' ? newPostHandler : editCategoryHandler"
      />
    </a-row>
  </page-header-wrapper>
</template>

<script>
import Modal from './Modal.vue'
import EmptyLogo from '../../../assets/no_data.vue'

export default {
  data () {
    return {
      activated: '',
      visible: {
        flag: false
      },
      categories: [],
      columns: [
        // {
        //   title: this.$t('blogs.video.table.title_uz'),
        //   dataIndex: 'name.uz',
        //   key: 'title_uz'
        // },
        {
          title: this.$t('blogs.video.table.title_ru'),
          dataIndex: 'name.ru',
          key: 'title_ru'
        },

        // {
        //   title: this.$t('blogs.video.table.title_eng'),
        //   dataIndex: 'name.en',
        //   key: 'title_eng'
        // },
        {
          title: this.$t('table.created_at'),
          scopedSlots: { customRender: 'created_at' },
          key: 'created_at'
        },
        {
          title: this.$t('table.updated_at'),
          scopedSlots: { customRender: 'updated_at' },
          key: 'updated_at'
        },
        {
          title: this.$t('table.actions'),
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      formType: 'new',
      form: {
        updated_at: 'string',
        created_at: 'string',
        id: '',
        name: {
          en: '',
          ru: '',
          uz: ''
        }
      }
    }
  },
  methods: {
    getTime (date) {
      return new Date(date)
    },
    newPostHandler () {
      console.log(this.form)
      this.$store.dispatch('postBlogCategory', this.form).then((res) => {
        console.log(res)
        this.categories.push({
          ...this.form,
          key: res.blogcategory_id,
          id: res.blogcategory_id
        })
      })
      this.visible.flag = false
    },
    openNewModal () {
      this.visible.flag = true
      this.formType = 'new'
      this.form = {
        updated_at: 'string',
        created_at: 'string',
        id: '',
        name: {
          en: '',
          ru: '',
          uz: ''
        }
      }
    },
    getBlogCategories () {
      this.$store.dispatch('getBlogCategories').then((res) => {
        this.categories = res.map(e => ({ ...e, key: e.id }))
      })
    },
    editCategoryHandler () {
      this.$store.dispatch('updateBlogCategory', this.form).then((e) => {
        alert('modified successfully')
        this.visible.flag = false
      })
    },
    editRowHandler (text) {
      this.formType = 'edit'
      this.visible.flag = true
      this.form = text
    },
    deleteRow (array, id) {
      array.splice(array.findIndex(e => e.id === id), 1)
    },
    cancel () {},
    confirm (val) {
      this.$store.dispatch('deleteBlogCategory', val.id).then(res => {
        this.deleteRow(this.categories, val.id)
      })
    }
  },
  components: {
    EmptyLogo,
    Modal
  },
  created () {
    this.getBlogCategories()
  }
}
</script>

<style scoped>
.list_row {
  border-left: 1px solid transparent;
  transition: border-left 0.3s;
}

.active {
  border-left: 8px solid #52c41a;
}
</style>
