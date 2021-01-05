<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row justify="center">

        <a-col v-if="false">
          <a-skeleton active />
        </a-col>
        <a-col offset="2" span="14" v-else>
          <a-form-model :model="course" :colon="false" ref="ruleForm">
            <a-divider orientation="left">Форма курса</a-divider>
            <a-form-model-item label="Учителя">
              <a-select v-model="course.teacher_ids" mode="multiple" placeholder="пожалуйста, выберите подходящих учителей">
                <a-select-option v-for="item in teachers" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="Название курса">
              <a-input class="my-part" v-for="cr in course.title" :key="cr.label" v-model="cr.input" :placeholder="'Введите название нового курса на ' + cr.label" />
            </a-form-model-item>
            <a-form-model-item label="Описание">
              <a-form-model-item label="">
                <a-input
                  :placeholder="'Краткое описание нового курса ' + item.label"
                  v-for="(item, i) in course.description"
                  :key="i"
                  v-model="item.input"
                  :type="'textarea'"
                />
              </a-form-model-item>
              <a-form-model-item label="Период (месяц)">
                <a-input-number id="inputNumber" v-model="course.duration" :min="1" :max="10" @change="onChange" />
              </a-form-model-item>
              <a-form-model-item label="Изображение на обложке">
                <a-upload
                  :customRequest="uploadMainImage"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="removeImage"
                >
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">{{ $t('button.upload') }}</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-model-item>
              <a-form-model-item label="Дополнительные поля">
                <a-tabs default-active-key="final_works" @change="tabChange" v-model="selectedType" tab-position="left">
                  <a-tab-pane v-for="item in course.text_fields" :key="item.title" :tab="item.unique">
                    <a-tabs type="editable-card" v-model="selectedBody" @edit="editBody">
                      <a-tab-pane v-for="(list, i) in item.body" :key="list.tabKey" :tab="`Часть ${i + 1}`" :closable="list.closable">
                        <a-col span="auto">
                          <a-input class="my-1" v-model="cn.input" v-for="(cn,u) in list.title" :key="u" :placeholder="`Заголовок на ${cn.label}`"></a-input>
                        </a-col>
                        <a-col span="auto">
                          <a-textarea
                            class="my-1"
                            v-for="(ds,it) in list.description"
                            v-model="ds.input"
                            :key="it"
                            :placeholder="`Описание на ${ds.label}`"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                          />
                        </a-col>
                        <a-col span="auto" class="my-part">
                          <a-upload
                            :customRequest="uploadImage"
                            list-type="picture-card"
                            :file-list="list.fileList"
                            @preview="handlePreview"
                            @change="handleChanges($event, list)"
                          >
                            <div v-if="list.fileList.length < 1">
                              <a-icon type="plus" />
                              <div class="ant-upload-text">{{ $t('button.upload') }}</div>
                            </div>
                          </a-upload>
                          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                            <img alt="example" style="width: 100%" :src="list.picture.url" />
                          </a-modal>
                        </a-col>
                      </a-tab-pane>
                    </a-tabs>
                    <a-button v-if="false" type="dashed" block size="large" @click="addnewField(item)">Добавить новый абзац</a-button>
                  </a-tab-pane>
                </a-tabs>
                <a-row type="flex" justify="end" class="my-1">
                  <a-col span="auto">
                    <a-button @click="$router.push('/courses/list')">{{ $t('button.cancel') }}</a-button>
                    <a-button style="margin-left: 10px" v-if="isNewForm" type="primary" @click="onSubmit" :loading="loading">{{ $t('button.create') }}</a-button>
                    <a-button
                      style="margin-left: 10px"
                      v-else
                      type="primary"
                      @click="saveForm"
                      :loading="loading"
                    >{{ $t('button.save') }}</a-button
                    >
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-form-model-item></a-form-model>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>
<script>
// var uniqueList = ['Final works', 'Features', 'Learning process', 'Audience', 'Questions']
export default {
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      selectedBody: 'inital',
      selectedType: 'final_works',
      fileList: [],
      loading: false,
      labelCol: { span: 12 },
      wrapperCol: { span: 12, md: 12, sm: 14 },
      locale: { lang: 'ru' },
      langs: [],
      teachers: [],
      isNewForm: null,
      course: {
         layout: 'horizontal',
        description: [],
        duration: 0,
        title: [],
        picture: {
          url: 'https://www.socialsamosa.com/wp-content/uploads/2016/06/digital-class.jpg',
          uuid: 'uid'
        },
        skills: [
          {
            en: '',
            ru: '',
            uz: ''
          }
        ],
        teacher_ids: [],
        text_fields: [
          {
            body: [
              {
                description: [],
                picture: {
                  url: 'fgh',
                  uuid: 'as'
                },
                fileList: [],
                title: [],
                tabKey: 'inital',
                closable: false
              }
            ],
            title: 'final_works',
            unique: 'Итоговые проекты'
          },
          {
            body: [
              {
                title: [],
                fileList: [],
                description: [],
                picture: {
                  url: 'df',
                  uuid: 'as'
                },
                tabKey: 'inital',
                closable: false
              }
            ],
            title: 'feature',
            unique: 'Особенности'
          },
          {
            body: [
              {
                description: [],
                picture: {
                  url: 'fhg',
                  uuid: 'as'
                },
                fileList: [],
                title: [],
                tabKey: 'inital',
                closable: false
              }
            ],
            title: 'learning_process',
            unique: 'Процесс изучения'
          },
          {
            body: [
              {
                description: [],
                picture: {
                  url: 'fgh',
                  uuid: 'as'
                },
                title: [],
                fileList: [],
                tabKey: 'inital',
                closable: false
              }
            ],
            title: 'audience',
            unique: 'Публика'
          },
          {
            body: [
              {
                description: [],
                picture: {
                  url: 'sdfs',
                  uuid: 'as'
                },
                fileList: [],
                title: [],
                tabKey: 'inital',
                closable: false
              }
            ],
            title: 'question',
            unique: 'Вопросы'
          }
        ]
      }
    }
  },
  watch: {},
  computed: {
    formItemLayout () {
      const { layout } = this.course
      return layout === 'vertical'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
          }
        : {}
    }
    },
  methods: {
    getTutors () {
      this.$store.dispatch('getTutors').then(res => {
        console.log(res)
        this.teachers = res.tutors
      })
    },
    addnewField (data) {
      const bodyEl = {
        description: this.langs.map(el => ({ input: '', label: el.label, value: el.value })),
        title: this.langs.map(el => ({ input: '', label: el.label, value: el.value })),
        picture: { uuid: 'asda' },
        fileList: [],
        tabKey: Math.random() * 100,
        closable: false
      }
      this.selectedBody = bodyEl.tabKey
      data.body.push(bodyEl)
      if (data.body.length > 1) { data.body.forEach(el => (el.closable = true)) }
    },
    tabChange (e) {
      this.course.text_fields.forEach(el => {
        if (el.title === e) {
          this.selectedBody = el.body[0].tabKey
        }
      })
    },
    editBody (targetKey, action) {
       this[action](targetKey)
    },
    remove (key) {
      this.course.text_fields.forEach(el => {
        if (el.title === this.selectedType) {
            el.body = el.body.filter(f => f.tabKey !== key)
                if (el.body.length === 1) el.body[0].closable = false
                if (key === this.selectedBody) {
                  this.selectedBody = el.body[el.body.length - 1].tabKey
                }
        }
      })
    },
    add (key) {
      // console.log(this.selectedBody)
      this.course.text_fields.forEach(el => {
        if (el.title === this.selectedType) { this.addnewField(el) }
      })
    },
    async uploadImage (data) {},
    async uploadMainImage (data) {
      this.$uploadImage(data.file, this.fileList, this)
    },
    async getCourse (id) {
      const langs = await this.setupLocale()
      this.$store.dispatch('getCourse', id).then((res) => {
        const textField = [...this.course.text_fields]
        this.course = res
        this.fileList = [{ uid: res.picture.uuid, url: res.picture.url, status: 'done', name: res.picture.uuid }]
        this.course.title = this.$convertObjectToArray(this.course.title, langs)
        this.course.description = this.$convertObjectToArray(this.course.description, langs)
        this.course.text_fields = res.text_fields.map((el, i) => ({
          ...el,
          unique: textField.filter(els => els.title === el.title)[0].unique,
          body: el.body.map(e => ({
            ...e,
            title: this.$convertObjectToArray(e.title, langs),
            description: this.$convertObjectToArray(e.description, langs),
            tabKey: Math.random() * 100,
            closable: el.body.length !== 1,
            fileList: [{
              uid: e.picture.uuid,
              url: e.picture.url,
              name: e.picture.uuid,
              status: 'done'
            }]
            }))
        }))
        this.selectedBody = this.course.text_fields[0].body[0].tabKey
        this.selectedType = 'final_works'
      })
    },

    onSubmit () {
      this.course.picture = {
        uuid: this.fileList[0].uid,
        url: 'text'
      }
      this.loading = true
      this.course.text_fields = this.course.text_fields.map((el) => ({
        ...el,
        body: el.body.map(els => {
          if (els.fileList.length > 0) {
              return { ...els,
                picture: {
                  url: els.fileList[0].uid,
                  uuid: els.fileList[0].uid
                },
                fileList: []
              }
          } else {
            return {
              ...els,
              picture: { url: 'etr', uuid: 'asdzdas' },
              fileList: []
            }
          }
        })
        }))

      this.tranformationForm([], 'object')
      console.log(this.course)

      this.$store
        .dispatch('postCourse', this.course)
        .then((res) => {
          this.$alertMessage('success', this.course.title.ru, 'Successfully created', this)
          this.loading = false
          this.$router.push('/courses/list')
        })
        .finally(() => (this.loading = false))
    },
    onChange () {},
    saveForm () {
      this.course.picture = {
        uuid: this.fileList[0].uid,
        url: 'text'
      }
      this.loading = true
      this.course.text_fields = this.course.text_fields.map((el) => ({
        ...el,
        body: el.body.map(els => {
          if (els.fileList.length > 0) {
              return { ...els,
                picture: {
                  url: els.fileList[0].uid,
                  uuid: els.fileList[0].uid
                },
                fileList: []
              }
          } else {
            return {
              ...els,
              picture: { url: '', uuid: '' },
              fileList: []
            }
          }
        })
        }))
      this.tranformationForm([], 'object')
      console.log(this.course)
      this.$store.dispatch('updateCourse', this.course).then(() => {
        this.$alertMessage('success', 'Course', 'Modified successfully', this)
        this.$router.push('/courses/list')
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChanges (ev, data) {
      if (ev.fileList.length === 0) {
        data.fileList = []
        return
      }
      console.log(ev.file.originFileObj, data.fileList)
      this.$uploadImage(ev.file.originFileObj, data.fileList, this)
    },
    removeImage (e) {
      if (e.fileList.length === 0) {
        this.fileList = e.fileList
        return -1
      }
    },
    async setupLocale () {
       return new Promise((resolve, reject) => {
          this.$store.dispatch('getLangs').then(res => {
            // console.log(res)
            this.langs = res.langs
            resolve(res)
      })
       })
    },
    tranformationForm (langs, type) {
      if (type === 'array') {
      this.course.description = [...langs].map(el => ({ ...el, input: '' }))
      this.course.title = [...langs].map(el => ({ ...el, input: '' }))
      this.course.text_fields = this.course.text_fields.map(el => ({
        ...el,
        body: el.body.map(e => ({
          ...e,
          title: [...langs].map(els => ({ ...els, input: '' })),
          description: [...langs].map(els => ({ ...els, input: '' }))
        }))
      }))
    } else if (type === 'object') {
      this.course.title = this.$convertArrayToObject(this.course.title, 'value')
      this.course.description = this.$convertArrayToObject(this.course.description, 'value')
      this.course.text_fields = this.course.text_fields.map(el => ({
        ...el,
        body: el.body.map(e => ({
          ...e,
          title: this.$convertArrayToObject(e.title, 'value'),
          description: this.$convertArrayToObject(e.description, 'value')
        }))
      }))
    }
    }
  },
  created () {
    this.getTutors()
    this.setupLocale().then(res => {
      this.tranformationForm(res.langs, 'array')
    })

    if (Object.keys(this.$route.params).length === 0 && this.$route.params.constructor === Object) {
      this.isNewForm = true
    } else this.getCourse(this.$route.params.id)
  }
}
</script>
<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
