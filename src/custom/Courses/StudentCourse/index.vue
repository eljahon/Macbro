<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row type="flex" justify="space-between">
        <a-col span="auto">
          <h2>Участники группы</h2>
        </a-col>
        <a-col span="auto">
          <a-button type="primary">Новая</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns" :data-source="studentCourses">
            <span slot="action" slot-scope="">
              <a-col span="auto">
                <a-row type="flex">
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-col>
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                      <a-button type="primary" icon="edit" />
                    </a-tooltip>
                  </a-col>
                </a-row>
              </a-col>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      studentCourses: [],
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
      visible: { flag: false, type: 'new' }
    }
  },
  methods: {
    getStudentCourses () {
      this.$store.dispatch('getStudentCourses').then(res => {
        console.log(res)
        this.studentCourses = res.map(el => ({ ...el, key: el.id }))
      })
    },
    editStudentCourse (id, data) {
      this.$store.dispatch('updateStudentCourse', data).then(res => {
        this.alertMessage('success', 'Успешно отредактировано', data.title.ru + ' edited')
        this.getCategories()
      })
    },
    deleteStudentCourse (id) {
      this.$store.dispatch('deleteStudentCourse', id).then(() => {
        // this.categories.splice(this.categories.findIndex(el => el.id === id), 1)
        this.alertMessage('error', 'Успешно удалено')
      })
    }
  },
  created () {
    this.getStudentCourses()
  }
}
</script>

<style>

</style>
