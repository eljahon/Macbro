<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row type="flex" justify="space-between">
        <a-col span="auto">
          <h2>Категории</h2>
        </a-col>
        <a-col span="auto">
          <a-button type="primary" @click="openModal">Новая категория</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns" :data-source="categories">
            <span slot="picture.url" slot-scope="text">
              <img width="80" height="80" :src="text.picture.url" alt="text.picture.url">
            </span>
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="description" slot-scope="text">
              <p class="my-0">{{ text.description.ru.length > 100 ? text.description.ru.substring(0, 100)+ '...' : text.description.ru }}</p>
            </span>
            <span slot="action" slot-scope="text">
              <a-col span="auto">
                <a-row type="flex">
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" @click="deleteCategory(text.id)" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-col>
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                      <a-button type="primary" icon="edit" @click="openEditModal(text)" />
                    </a-tooltip>
                  </a-col>
                </a-row>
              </a-col>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
    <NewCategory :visible="visible" :newCategory="categoryFields" :addNewCategory="postCategory" :editCategory="editCategory" />
  </page-header-wrapper>
</template>

<script>
import NewCategory from './NewCategory'

export default {
  components: {
    NewCategory
  },
  data () {
    return {
      categories: [],
      columns: [
   {
    title: this.$t('table.title'),
    dataIndex: 'title.ru',
    key: 'title.ru'
  },
  {
    title: this.$t('table.image'),
    scopedSlots: { customRender: 'picture.url' },
    key: 'picture'
  },
  {
    title: this.$t('table.description'),
    key: 'description.ru',
    scopedSlots: { customRender: 'description' },
    width: '24%'
  },
  {
    title: this.$t('table.actions'),
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '20%'
  }
],
      visible: { flag: false, type: 'new' },
      categoryFields: {
        title: {
          en: '',
          ru: '',
          uz: ''
        },
        job_ids: [],
        jobs: [],
        fileList: [],
        description: {},
        picture: {
          uuid: '',
          url: ''
        }
      }
    }
  },
  methods: {
    getCategories () {
      this.$store.dispatch('getCategories').then(res => {
        console.log(res)
        this.categories = res.map(el => ({ ...el, key: el.id }))
      })
    },
    postCategory (data) {
      this.$store.dispatch('postCategory', data).then(res => {
        this.categories.push({ ...data, key: res.category_id, id: res.category_id })
        this.alertMessage('success', 'Успешно создано', data.title.ru + ' created')
      })
    },
    editCategory (id, data) {
      this.$store.dispatch('updateCategory', data).then(res => {
        this.alertMessage('success', 'Успешно отредактировано', data.title.ru + ' edited')
        this.getCategories()
      })
    },
    deleteCategory (id) {
      this.$store.dispatch('deleteCategory', id).then(() => {
        this.categories.splice(this.categories.findIndex(el => el.id === id), 1)
        this.alertMessage('error', 'Успешно удалено')
      })
    },
    openEditModal (item) {
      item.fileList = [{ uid: item.id, url: item.picture.url, status: 'done', name: `${item.id}.png` }]
      // console.log(item)
      this.categoryFields = { ...item }
      this.categoryFields.job_ids = item.job_ids.map(el => el.id)
      this.visible.flag = true
      this.visible.type = 'edit'
    },
    openModal () {
      this.visible.flag = true
      this.visible.type = 'new'
      this.categoryFields.title = { en: '', ru: '', uz: '' }
      this.categoryFields.description = { en: '', ru: '', uz: '' }
      this.categoryFields.id = ''
      this.categoryFields.job_ids = []
      this.categoryFields.fileList = []
      this.categoryFields.key = ''
    },
    alertMessage (type, title, desc = '') {
      this.$notification[type]({
        message: title,
        description: desc,
        duration: 2
      })
    }
  },
  created () {
    this.getCategories()
  }
}
</script>

<style>

</style>
