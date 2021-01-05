<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row type="flex" justify="end" class="mb-1">
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/cms-settings/teacher/new')">Create teacher</a-button>
        </a-col>
      </a-row>
      <a-table :columns="columns" :data-source="teachers">
        <a slot="user" slot-scope="text">{{ text.user }}</a>
        <span slot="picture.url" slot-scope="text"><img class="img_style" :src="text.picture.url" :alt="text.picture.url"></span>
        <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
        <span slot="action" slot-scope="text">
          <a-col span="auto">
            <a-row type="flex">
              <a-col span="auto" class="mx-1">
                <a-popconfirm
                  title="Вы хотите удалить этого учителя?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="deleteTeacher(text.id)"
                  @cancel="cancel => null"
                >
                  <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                    <a-button type="danger" icon="delete" />
                  </a-tooltip>
                </a-popconfirm>
              </a-col>
              <a-col span="auto">
                <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                  <a-button type="primary" icon="edit" @click="$router.push('/cms-settings/teacher/' + text.id)" />
                </a-tooltip>
              </a-col>
            </a-row>
          </a-col>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>

const columns = [
   {
    title: 'Picture',
    scopedSlots: { customRender: 'picture.url' },
    key: 'picture.url'
  },
  {
    title: 'Teacher name',
    key: 'user',
    scopedSlots: { customRender: 'user' },
    width: '24%'
  },
  {
    title: 'Created at',
    scopedSlots: { customRender: 'created_at' },
    key: 'created_at'
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '20%'
  }
]
export default {
    data () {
        return {
            columns,
            teachers: []
        }
    },
    methods: {
        getTeachers () {
            this.$store.dispatch('getTeachers').then(res => {
                console.log(res)
                this.teachers = res.map(e => ({ ...e, key: e.id }))
            })
        },
        deleteTeacher (id) {
      this.$store.dispatch('deleteTeacher', id).then(res => {
        this.$deleteFromList(this.teachers, id)
        this.$alertMessage('success', 'Deleted', 'Teacher deleted successfully', this)
      })
    }
    },
    created () {
        this.getTeachers()
    }

}
</script>

<style lang="less" scoped>
.img_style{
    width: 70px;
    height: 70px;
    object-fit: cover;
}
</style>
