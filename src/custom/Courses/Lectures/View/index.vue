<template>
  <div>
    <a-card class="mb-1">
      <a-row type="flex" justify="start" align="middle">
        <a-col span="auto">
          <!-- <a @click="$router.push('/courses/list')" style="margin-right: 15px; color: black"> <a-icon type="arrow-left" /> Назад</a> -->
          <a-button shape="round" @click="$router.push('/courses/list/'+ ids.course_id + '/chapter/' + ids.chapter_id)" style="margin-right: 15px; color: black" icon="arrow-left"> Назад</a-button>
        </a-col>
        <a-col span="auto">
          <a-breadcrumb>
            <a-breadcrumb-item><a @click="$router.push('/')">Главный</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/job-list')">Обучение</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list')">Курсы</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list/'+ ids.course_id + '/chapter')">Главы</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list/'+ ids.course_id + '/chapter/' + ids.chapter_id)">Уроки</a></a-breadcrumb-item>
            <a-breadcrumb-item><a>Просмотр видео</a></a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>
    </a-card>
    <a-card>
      <a-row type="flex" :gutter="[16]">
        <a-col span="24">
          <h2 v-if="lessonInfo.lesson.title">{{ lessonInfo.lesson.title }}</h2>
        </a-col>
        <a-col span="12" v-for="item in videoInfo" :key="item.created_at">
          <video width="100%" height="340" controls>
            <source :src="item.url" type="video/mp4">
            <source :src="item.url" type="video/ogg">
            Your browser does not support the video tag.
          </video>
          <h2>{{ item.resolution }}</h2>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {

    data () {
        return {
            ids: {},
            videoInfo: [],
            lessonInfo: {
                lesson: { title: '' }
            }
        }
    },
    methods: {
    getVideoInfo (file) {
        this.$store.dispatch('getVideoInfo', file).then(el => {
        this.videoInfo = el.videos
      })
    },
    getLesson (obj) {
    this.$store.dispatch('getLesson', obj).then(res => {
      console.log(res)
      this.lessonInfo = res
      this.getVideoInfo(res.lesson.file)
    })
    }
    },
    created () {
    const path = this.$route.path.split('/')
    this.ids.chapter_id = path[5]
    this.ids.course_id = path[3]
    this.ids.lesson_id = this.$route.params.id
    this.getLesson(this.ids)
    }

}
</script>

<style>

</style>
