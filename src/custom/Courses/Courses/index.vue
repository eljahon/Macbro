<template>
  <div>
    <a-card class="mb-1">
      <a-breadcrumb>
        <a-breadcrumb-item><a @click="$router.push('/')">Главный</a></a-breadcrumb-item>
        <a-breadcrumb-item><a @click="$router.push('/courses/job-list')">Обучение</a></a-breadcrumb-item>
        <a-breadcrumb-item>Курсы</a-breadcrumb-item>
      </a-breadcrumb>
    </a-card>
    <a-row :gutter="[8,8]" type="flex" justify="center">
      <a-col :span="24">
        <a-card v-if="activeCourse"><a-skeleton active /></a-card>
        <a-card v-else>
          <a-row type="flex" justify="space-between" class="mb-2">
            <a-col v-if="true" :span="12" :sm="8" :md="6">
              <a-row type="flex" justify="start">
                <a-col span="auto">
                  <a-input-search placeholder="поиск" style="width: 300px" @search="onSearch" />
                </a-col>
              </a-row>
            </a-col>
            <a-col span="auto">
              <a-row type="flex" justify="space-between">
                <a-col span="auto" class="mx-1">
                  <a-button type="primary" @click="$router.push('/courses/list/new')">Новый курс</a-button>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-table :columns="columns" :data-source="courses">
                <span slot="teacher_ids" slot-scope="text">
                  <a-tag color="pink" v-for="item in text.teacher_ids" :key="item"> {{ item }}</a-tag>
                </span>
                <span slot="title.ru" slot-scope="text" @click="$router.push('/courses/list/'+ text.id + '/chapter')" ><a>{{ text.title.ru }}</a></span>
                <span slot="created_at" slot-scope="text">{{ getTime(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
                <span slot="action" slot-scope="text">
                  <a-popconfirm
                    title="Вы уверены, что удалите эту главу?"
                    ok-text="Да"
                    cancel-text="Нет"
                    @confirm="confirm(text.id)"
                    @cancel="cancel => null"
                  >
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-popconfirm>
                  <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                    <a-button @click="$router.push('/courses/list/' + text.id)" type="primary" icon="edit" />
                  </a-tooltip>
                  <!-- <a-tooltip placement="bottomLeft" title="просмотр">
                    <a-button @click="$router.push('/courses/34/job/2')" class="mx-1" type="primary" icon="plus" />
                  </a-tooltip> -->
                </span>
              </a-table>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      courses: [],
      activeCourse: true,
      columns: [
        {
          title: 'Название курса',
          scopedSlots: { customRender: 'title.ru' },
          key: 'chapter',
          width: '30%'
        },
        {
          title: 'Учителя',
          key: 'teacher_ids',
          width: '30%',
          scopedSlots: { customRender: 'teacher_ids' }
        },
        {
          title: 'Создано',
           scopedSlots: { customRender: 'created_at' },
          key: 'created_at'
        },
        {
          title: 'Действие',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '30%'
        }
      ]
    }
  },
  methods: {
    getTime (date) {
      return new Date(date)
    },
    getNameOfTutors (teachers, tutors) {
      const teacherIds = []
      tutors.forEach(el => {
        teachers.forEach(t => {
          if (el.id === t) teacherIds.push(el.name)
        })
      })
      return teacherIds
    },
    getCourses () {
      this.$store.dispatch('getCourses').then(res => {
        this.$store.dispatch('getTutors').then(tutors => {
        this.courses = res.map(el => ({ ...el,
          key: el.id,
          teacher_ids: this.getNameOfTutors(el.teacher_ids, tutors.tutors)
        }))
        console.log(this.courses)
        }).finally(() => (this.activeCourse = false))
    })
    },

    deleteCourse (id) {
      this.$store.dispatch('deleteCourse', id).then(res => {
        alert('deleted successfully')
        this.getCourses()
      })
    },
    confirm (id) {
      this.deleteCourse(id)
    },
    onSearch () {

    }
  },
  created () {
    this.getCourses()
  }
}
</script>

<style lang="less" scoped>

</style>
