<template>
  <div>
    <a-card class="mb-1">
      <a-row type="flex" justify="start" align="middle">
        <a-col span="auto">
          <a-button @click="$router.push('/courses/list/'+ ids.course_id + '/chapter')" shape="round" style="margin-right: 15px; color: black" icon="arrow-left"> Назад</a-button>
        </a-col>
        <a-col span="auto">
          <a-breadcrumb>
            <a-breadcrumb-item><a @click="$router.push('/')">Главный</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/job-list')">Обучение</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list')">Курсы</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list/'+ ids.course_id + '/chapter')">Главы</a></a-breadcrumb-item>
            <a-breadcrumb-item>Уроки</a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>
    </a-card>
    <a-card>
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :sub-title="title"
      >
        <template slot="extra">
          <a-button type="primary" key="32" @click="newLecture">
            Новая лекция
          </a-button>
        </template>
        <div v-if="false" class="padd_card">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col flex="200px">
              <a-row type="flex">
                <a-col span="auto">
                  <img class="img_fit" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png" alt="">
                </a-col>
                <a-col span="16" style="margin-left:10px">
                  <h2 class="py-0">Современный JavaScript с самого начала</h2>
                  <span>by Modern Varkarn</span>
                  <p class="py-0">Javascript или JS - это хорошо интерпретируемый язык программирования высокого уровня, соответствующий спецификации ECMAScript..</p>
                </a-col>
              </a-row>
            </a-col>
            <a-col flex="auto">
              <div style="padding: auto 100px">
                <p><a-icon type="history"> </a-icon> 23 Часы</p>
                <p><a-icon type="project"> </a-icon> 12 лекции</p>
                <p class="py-0"><a-icon type="user"> </a-icon> Промежуточный уровень</p>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-page-header>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns" :data-source="lessons">
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span
              slot="drag"
              slot-scope="text"
              @drop="onDrop($event, text)"
              @dragenter.prevent
              @dragover.prevent
            >
              <div
                class="iconDrag"
                @dragstart="onDragStarts($event,text)"
                draggable="true"><a-icon type="drag" /></div>
            </span>
            <span slot="action" slot-scope="text">
              <a-popconfirm
                title="Вы хотите удалить это видео?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deleteLecture(text.id)"
                @cancel="cancel => null"
              >
                <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                  <a-button class="mx-1" type="danger" icon="delete" />
                </a-tooltip>
              </a-popconfirm>
              <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                <a-button @click="editLecture(text.id)" type="primary" icon="edit" />
              </a-tooltip>
              <a-tooltip placement="bottomLeft" title="просмотр">
                <a-badge :count="35">
                  <a-button @click="$router.push('/courses/2342/job/32/preview')" class="mx-1" type="primary" icon="eye" />
                </a-badge>
              </a-tooltip>
            </span>
            <span slot="id" slot-scope="text">
              <a-button type="link" icon="play-circle" style="color: #1890FF" @click="perviewLecture(text.id)"> {{ text.title }}</a-button>
            </span>
            <span slot="comment">
              <a-badge dot>
                <a-icon type="notification" />
              </a-badge>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
const columns = [
    {
    title: '',
    key: 'drag',
    scopedSlots: { customRender: 'drag' }
  },
  {
    title: 'Название лекции',
    key: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: 'Дата публикации',
    scopedSlots: { customRender: 'created_at' },
    key: 'created_at'
  },
  {
    title: 'Тип',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: 'Зарегистрировано (количество)',
    key: 'enroll',
    dataIndex: 'enroll'
  },
  //  {
  //   title: 'Comments',
  //   key: 'comment',
  //   scopedSlots: { customRender: 'comment' }
  // },
   {
    title: 'Действие',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
data () {
    return {
        columns,
        title: '',
        ids: {
          course_id: '',
          chapter_id: ''
        },
        lessons: []
    }
},
methods: {
  onDrop (event, obj) {
    // console.log(event, obj)
    const tranferred = JSON.parse(event.dataTransfer.getData('id'))
    this.arrangePlace(obj, tranferred)
  },
  arrangePlace (waited, transferred) {
    // console.log(waited, transferred)
    if (waited.id === transferred.id) {
      return
    }
    this.lessons = this.lessons.filter(el => el.id !== transferred.id)
    const idx = this.lessons.indexOf(waited)
    this.lessons.splice(idx, 0, transferred)
    this.sortLessons(this.lessons)
  },
  sortLessons (data) {
    const form = {
      ...this.ids,
      lesson_orders: Object.fromEntries(data.map((el, i) => ([el.id, i + 1])))

    }
    this.$store.dispatch('sortLessons', form).then(res => {
      this.$alertMessage('success', 'Moved', 'Video has moved to given position successfully', this)
    })
  },
  onDragStarts (event, obj) {
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('id', JSON.stringify(obj))
  },
  newLecture () {
      this.$router.push(`/courses/list/${this.ids.course_id}/chapter/${this.ids.chapter_id}/new`)
  },
  editLecture (lessonId) {
      this.$router.push(`/courses/list/${this.ids.course_id}/chapter/${this.ids.chapter_id}/lesson/${lessonId}`)
  },
  deleteLecture (lessonId) {
    const data = {
      ...this.ids,
      lesson_id: lessonId
    }
    this.$store.dispatch('deleteLesson', data).then(res => {
      this.$deleteFromList(this.lessons, lessonId)
      this.$alertMessage('success', 'Deleted', 'Video has successfully deleted', this)
    })
  },
    perviewLecture (lessonId) {
      this.$router.push(`/courses/list/${this.ids.course_id}/chapter/${this.ids.chapter_id}/lesson/${lessonId}/preview`)
  },
  confirm () {

  },
  back () {
    window.history.back()
  },
  getLessons () {
    this.$store.dispatch('getChapter', this.ids).then(res => {
      this.title = res.chapter.title
    })
    this.$store.dispatch('getLessons', this.ids).then(res => {
      // console.log(res)
      this.lessons = res.lessons.map(el => ({ ...el, key: el.id }))
    })
  }
},
created () {
  const path = this.$route.path.split('/')
  this.ids.chapter_id = path[5]
  this.ids.course_id = path[3]
  this.getLessons()
}
}
</script>

<style lang="less" scoped>
.padd_card {
    background-color: rgb(255, 255, 255);
    // box-shadow: 1px rgba(134, 133, 133, 0.13);
    border-radius: 3px;
    // border: 1px solid rgb(240, 240, 240);
    transition: 0.3s;
    margin: 1px 0px;
}
.iconDrag {
  padding: 10px;
cursor: move;
}
</style>
