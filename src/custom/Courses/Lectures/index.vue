<template>
  <div>
    <a-card class="mb-1">
      <a-row type="flex" justify="start" align="middle">
        <a-col span="auto">
          <a-button @click="$router.push('/courses/list/'+ ids.course_id + '/chapter/' + ids.chapter_id)" shape="round" style="margin-right: 15px; color: black" icon="arrow-left"> Назад</a-button>
        </a-col>
        <a-col span="auto">
          <a-breadcrumb>
            <a-breadcrumb-item><a @click="$router.push('/')">Главный</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/job-list')">Обучение</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list')">Курсы</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list/'+ ids.course_id + '/chapter')">Главы</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list/'+ ids.course_id + '/chapter/' + ids.chapter_id)">Уроки</a></a-breadcrumb-item>
            <a-breadcrumb-item v-if="isNew">Новый урок</a-breadcrumb-item>
            <a-breadcrumb-item v-else>Редактировать урок</a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>
    </a-card>
    <a-card>
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="14">
          <a-input v-model="lesson.title" placeholder="Название урока"></a-input>
        </a-col>
        <a-col span="auto">
          <a-button @click="$router.push('/courses/list/'+ ids.course_id + '/chapter/' + ids.chapter_id)">{{ $t('button.cancel') }}</a-button>
          <a-button @click="postLesson" v-if="isNew" type="primary" style="margin-left:3px">Публиковать</a-button>
          <a-button @click="editLesson" v-else type="primary" style="margin-left:3px;">Сохранить</a-button>
        </a-col>
      </a-row>
      <a-row class="my-1">
        <a-col :span="24">
          <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="Video upload">
              <a-upload-dragger
                v-if="!(percentages > 0)"
                name="file"
                :multiple="true"
                :customRequest="uploadFile"
                @change="handleChange"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p class="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files
                </p>
              </a-upload-dragger>
              <div v-else class="card-box">
                <a-row type="flex" align="middle" justify="space-between">
                  <a-col span="1">
                    <a-icon type="play-circle" :style="{ fontSize: '20px'}"></a-icon>
                  </a-col>
                  <a-col :span="20">
                    <h2>{{ lesson.name }}</h2>
                    <a-progress v-if="!(percentages == 100)" :percent="percentages" :status="'active'" />
                    <!-- <a target="_blank" :href="item.url">{{ item.url }}</a> -->
                  </a-col>
                  <a-col v-if="!(percentages == 100)" span="auto">
                    <a-row type="flex">
                      <a-col span="auto">
                        <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                          <a-button @click="removeVideo" class="mx-1" type="danger" icon="close" />
                        </a-tooltip>
                      </a-col>
                      <a-col span="auto">
                        <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                          <a-button v-if="!isPause" @click="stopUpload" type="primary" icon="pause" />
                          <a-button v-else @click="continueUpload" type="primary" icon="play-circle" />
                        </a-tooltip>
                      </a-col>
                    </a-row>
                  </a-col>
                  <a-col v-else span="auto">
                    <a-row type="flex">
                      <a-col span="auto">
                        <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                          <a-button @click="removeVideo" class="mx-1" type="danger" icon="delete" />
                        </a-tooltip>
                      </a-col>
                    </a-row>
                  </a-col>
                  <a-col class="my-3" span="24">
                    <a-row type="flex" :gutter="[16]">
                      <a-col span="auto" v-for="item in videoInfo" :key="item.created_at" class="mx-2">
                        <div @click="showVideo(item)" :class="item.status=='SUCCESS' ? 'video_card': 'video_card_onPros'">
                          <!-- <a-row type="flex" justify="end">
                            <a-col span="auto">
                              <p class="my-part"></p>
                            </a-col>
                          </a-row> -->
                          <a-row type="flex" align="middle" justify="center">
                            <a-col span="auto" stretch>
                              <a-icon type="caret-right" :style="{ fontSize: '36px' }"/>
                            </a-col>
                          </a-row>
                          <a-row class="my-1" type="flex" justify="center">
                            <a-col span="auto">
                              <span class="mb-1">{{ item.resolution }}</span>
                            </a-col>
                          </a-row>
                        </div>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Text" force-render>
              <a-row type="flex" justify="center">
                <a-col :span="10">
                  <quill-editor
                    v-model="lesson.body"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="3" tab="Lecture notes">
              <a-card :bordered="false">
                <a-upload-dragger
                  name="file"
                  :multiple="false"
                  :showUploadList="false"
                  :customRequest="uploadNotes"
                  @change="handleUploadNotes"
                >
                  <p class="ant-upload-drag-icon">
                    <a-icon type="inbox" />
                  </p>
                  <p class="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p class="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                  </p>
                </a-upload-dragger>
              </a-card>
              <a-card v-if="lesson.homeworks" :bordered="false">
                <div class="card-box" v-for="(item,i) in lesson.homeworks" :key="i">
                  <a-row type="flex" align="middle" justify="space-between">
                    <a-col span="1">
                      <a-icon type="file" :style="{ fontSize: '20px'}"></a-icon>
                    </a-col>
                    <a-col :span="20">
                      <h2>{{ item.name }}</h2>
                    </a-col>
                    <a-col span="auto">
                      <a-row type="flex">
                        <a-col span="auto">
                          <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                            <a-button class="mx-1" @click="deleteFile(item)" type="danger" icon="delete" />
                          </a-tooltip>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                </div>
              </a-card>
            </a-tab-pane>
            <a-tab-pane v-if="false" key="4" tab="Assignment">
              <a-upload-dragger
                name="file"
                :multiple="true"
                :customRequest="uploadFile"
                @change="handleChange"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p class="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files
                </p>
              </a-upload-dragger>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-card>
    <a-card v-if="false" class="my-2">
      <div class="card-box">
        <a-row type="flex" align="middle" justify="space-between">
          <a-col span="1">
            <a-icon type="play-circle" :style="{ fontSize: '20px'}"></a-icon>
          </a-col>
          <a-col :span="20">
            <h2>{{ item.name }}</h2>
            <a target="_blank" :href="item.url">{{ item.url }}</a>
          </a-col>
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
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import * as tus from 'tus-js-client'
var percents = 0
var obj = null
var upload = null
export default {
  name: 'QuillEditor',
  components: {
    quillEditor
  },
  data () {
    return {
      isPause: false,
      isNew: true,
      content: null,
      videoInfo: [],
       ids: {
          course_id: '',
          chapter_id: ''
        },
      percentages: 0,
      editorOption: {
        // some quill options
      },
      lesson: {
        name: '',
        body: '',
        file: '',
        homeworks: [],
        recourses: [
          'efwedfsdfsdf'
        ],
        title: '',
        type: 'video'
      }
    }
  },
  watch: {
    percentages (value) {
      console.log(value)
    }
  },
  computed: {
    per () {
      return this.percentages
    }
  },
  methods: {
    callback () {

    },
    postLesson () {
      console.log(this.lesson)
      this.lesson.homeworks = this.lesson.homeworks.map(el => el.id)
      this.lesson = {
        ...this.lesson,
        ...this.ids
      }
      this.$store.dispatch('postLesson', this.lesson).then(res => {
        console.log(res)
        this.$router.push(`/courses/list/${this.ids.course_id}/chapter/${this.ids.chapter_id}`)
      })
    },
    deleteFile (file) {
      console.log(file)
    },
    uploadFile (data) {
      console.log(data)
      this.lesson.name = data.file.name
        upload = new tus.Upload(data.file, {
        endpoint: 'https://test.api.najottalim.uz/v1/upload-video/',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: data.file.name,
            filetype: data.file.type
        },
        onError: function (error) {
            console.log('Failed because: ' + error)
        },
        onProgress (bytesUploaded, bytesTotal) {
            percents = Math.ceil((bytesUploaded / bytesTotal * 100).toFixed(2))
            console.log(percents + '%')
        },
        onSuccess () {
            console.log('Download %s from %s', upload.file.name, upload.url)
            obj = upload
        }
    })
    upload.start()
    },
    stopUpload () {
      this.isPause = true
      upload.abort()
    },
    continueUpload () {
      this.isPause = false
      upload.start()
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    async uploadNotes (data) {
      console.log(data)
      const formData = new FormData()
      formData.append('file', data.file)
      this.$store.dispatch('uploadDocsFile', formData).then(res => {
        console.log(res)
        this.lesson.homeworks.push({
          name: data.file.name,
          id: res.filename
        })
      }).catch(err => console.log(err))
    },
    showVideo (item) {
      console.log(item)
      if (item.status === 'PENDING' || item.status === 'ORIGINAL') { return 1 } else { window.open(item.url) }
    },
    removeVideo () {
      upload.abort()
      this.videoInfo = []
      percents = 0
      this.setListener()
    },
    editLesson () {
      this.lesson = {
        ...this.lesson,
        ...this.ids
      }
      this.$store.dispatch('updateLesson', this.lesson).then(res => {
        console.log(res)
        this.$router.push(`/courses/list/${this.ids.course_id}/chapter/${this.ids.chapter_id}`)
      })
    },
    getVideoInfo (file) {
        console.log(file)
        this.$store.dispatch('getVideoInfo', file).then(el => {
        console.log(el)
        this.videoInfo = el.videos
      })
    },
    getLesson (obj) {
    this.$store.dispatch('getLesson', obj).then(res => {
      console.log(res)
      this.getVideoInfo(res.lesson.file)
      this.getBaseUrl(res.lesson.homeworks[0])
      this.percentages = 100
      this.lesson = res.lesson
      this.lesson.homeworks = res.lesson.homeworks.map((el, i) => ({ name: `файл ${i + 1}`, id: el }))
      this.lesson.name = res.lesson.file
    })
  },
    handleUploadNotes (data) {
      console.log(data)
    },
    onEditorBlur (quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange ({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.$emit('change', html)
    },
    setListener () {
      setInterval(() => {
      this.percentages = percents
      if (this.percentages === 100) {
        this.lesson.file = obj.url.split('upload-video/')[1].split('+')[0]
      }
    }, 100)
    },
    getBaseUrl (id) {
      this.$store.dispatch('getBaseUrl').then(res => {
        // const form = `${res.file_base_url}${id}`
        // this.$store.dispatch('getFileInfo', form).then(res => {
        //   console.log(res)
        // })
      })
    }
  },
  created () {
    const path = this.$route.path.split('/')
    this.ids.chapter_id = path[5]
    this.ids.course_id = path[3]
    this.ids.lesson_id = this.$route.params.id
    if (this.$route.name === 'edit-lecture') {
        this.isNew = false
        this.getLesson(this.ids)
      } else { this.setListener() }
  },
  beforeDestroy (e) {
  percents = 0
  obj = null
  upload = null
  }
}
</script>

<style lang="less" scoped>
.video_card {
  width: 200px;
  background-color: rgb(23, 167, 83);
  cursor: pointer;
  color: white;
  height: 150px;
  place-items: center;
  transition: ease background .6s;
  &:hover {
    background: rgb(21, 224, 123);
  }
}
.video_card_onPros {
  width: 200px;
  background-color: rgb(221, 190, 14);
  cursor: no-drop;
  color: white;
  height: auto;
  place-items: center;
  transition: ease background .6s;
  &:hover {
    background: rgb(224, 204, 21);
  }
}
.ready_placer {
  padding: 10px;
  background-color: red;
  width: 100%;
}
.card-box{
  width: 100%;
border: 1px solid rgb(240, 240, 240);
  padding: 12px;
  h2 {
    font-size: 18px;
    margin: 0px !important;
    color: #1890FF;
  }
  p {
    margin: 0px !important;
  }
}
</style>
