<template>
  <div>
    <a-card class="mb-1">
      <a-row type="flex" justify="start" align="middle">
        <a-col span="auto">
          <!-- <a @click="$router.push('/courses/list')" style="margin-right: 15px; color: black"> <a-icon type="arrow-left" /> Назад</a> -->
          <a-button shape="round" @click="$router.push('/courses/list')" style="margin-right: 15px; color: black" icon="arrow-left"> Назад</a-button>
        </a-col>
        <a-col span="auto">
          <a-breadcrumb>
            <a-breadcrumb-item><a @click="$router.push('/')">Главный</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/job-list')">Обучение</a></a-breadcrumb-item>
            <a-breadcrumb-item><a @click="$router.push('/courses/list')">Курсы</a></a-breadcrumb-item>
            <a-breadcrumb-item>Главы</a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>
    </a-card>
    <a-card>
      <a-row type="flex" justify="space-between" class="mb-2">
        <a-col v-if="true" span="auto">
          <a-row type="flex" justify="start">
            <a-col span="auto">
              <a-input-search placeholder="поиск" style="width: 300px" @search="onSearch" />
            </a-col>
          </a-row>
        </a-col>
        <a-col span="auto">
          <a-row type="flex" justify="space-between">
            <a-col span="auto" class="mx-1">
              <a-button type="primary" @click="newChapter">Новый глава</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns" :data-source="chapters">
            <span slot="title" slot-scope="text" @click="$router.push('/courses/list/'+ $route.params.id +'/chapter/' + text.id)"><a>{{ text.title }}</a></span>
            <span slot="quantity" slot-scope="text">{{ text.quantity }}</span>
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
              <a-row type="flex">
                <a-col span="auto">
                  <a-popconfirm
                    title="Вы уверены, что удалите эту главу?"
                    ok-text="Да"
                    cancel-text="Нет"
                    @confirm="deleteChapter(text)"
                    @cancel="cancel => null"
                  >
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-popconfirm>
                </a-col>
                <a-col span="auto">
                  <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                    <a-button type="primary" @click="editChapter(text)" icon="edit" />
                  </a-tooltip>
                </a-col>
                <!-- <a-col span="auto">
                  <a-tooltip placement="bottomLeft" title="Добавить урок">
                    <a-button @click="$router.push('/courses/34/job/2')" class="mx-1" type="primary" icon="plus" />
                  </a-tooltip>
                </a-col> -->
              </a-row>
            </span>
          </a-table>
        </a-col>
      </a-row>
      <a-modal v-model="visible.flag" title="Название" on-ok="handleOk">
        <template slot="footer">
          <a-button key="back" @click="handleCancel">
            {{ $t('button.cancel') }}
          </a-button>
          <a-button v-if="visible.type == 'new'" key="submit" type="primary" :loading="loading" @click="postChapter">
            {{ $t('button.create') }}
          </a-button>
          <a-button v-else key="submit" type="primary" :loading="loading" @click="saveChapter">
            {{ $t('button.save') }}
          </a-button>
        </template>
        <a-input v-model="visible.data.value" placeholder="название главы"></a-input>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
export default {
data () {
  return {
    loading: false,
    visible: {
      flag: false,
      data: {}
    },
    columns: [
    {
      title: '',
      scopedSlots: { customRender: 'drag' },
      key: 'drag'
    },
      {
      title: 'Название главы',
      scopedSlots: { customRender: 'title' },
      key: 'title',
      width: '40%'
    },
    {
      title: 'Создано',
      scopedSlots: { customRender: 'created_at' },
      key: 'created_at',
      width: '20%'
    },
    {
      title: 'Действия',
      scopedSlots: { customRender: 'action' },
      key: 'action',
      width: '30%'
    }
    ],
    chapters: []
  }
},
methods: {
    onDrop (event, obj) {
    const tranferred = JSON.parse(event.dataTransfer.getData('id'))
    this.arrangePlace(obj, tranferred)
  },
  arrangePlace (waited, transferred) {
    if (waited.id === transferred.id) {
      return
    }
    this.chapters = this.chapters.filter(el => el.id !== transferred.id)
    const idx = this.chapters.indexOf(waited)
    this.chapters.splice(idx, 0, transferred)
    this.sortChapter(this.chapters)
  },
  sortChapter (data) {
    const form = {
      course_id: this.$route.params.id,
      chapter_orders: Object.fromEntries(data.map((el, i) => ([el.id, i + 1])))

    }
    this.$store.dispatch('sortChapters', form).then(res => {
      this.$alertMessage('success', 'Moved', 'Chapter has moved to given position successfully', this)
    })
  },
  onDragStarts (event, obj) {
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('id', JSON.stringify(obj))
  },
  handleOk () {
    // this.chapters.push({
    //   title: this.visible.data.value,
    //   key: Math.random() * 200,
    //   // quantity: '34',
    //   course_id: this.$route.params.id,
    //   created_at: new Date()
    // })
  },
  newChapter () {
    this.visible.type = 'new'
    this.visible.data.value = ''
    this.visible.flag = true
  },
  editChapter (value) {
    this.visible.type = 'edit'
    this.visible.flag = true
    this.visible.data = value
    this.visible.data.value = value.title
  },
  saveChapter () {
    const form = { ...this.visible }
    this.$store.dispatch('updateChapters', {
      courseId: this.$route.params.id,
      chapter: {
        id: form.data.id,
        title: this.visible.data.value
      }
    })
    this.getChapters()
    this.visible.flag = false
  },
  handleCancel () {
    this.visible.flag = false
  },
  onSearch () {

  },
  deleteChapter (item) {
      const form = {
      courseId: this.$route.params.id,
      chapterId: item.id
      }
    this.$store.dispatch('deleteChapter', form).then(res => {
     this.chapters.splice(this.chapters.indexOf(item), 1)
    })
  },
  postChapter () {
    const form = {
      courseId: this.$route.params.id,
      chapter: {
        title: this.visible.data.value
      }
    }
    this.$store.dispatch('postChapters', form).then(res => {
      this.chapters.push({
        title: form.chapter.title,
        key: res.chapter_id,
        id: res.chapter_id
      })
        this.visible.flag = false
        this.visible.value = ''
    })
  },
  getChapters () {
    this.$store.dispatch('getChapters', this.$route.params.id).then(res => {
      this.chapters = res.map(el => ({ ...el, key: el.id }))
    }).catch(err => {
      console.log(err)
    })
  }
},
created () {
  // console.log(this.$route)
  this.getChapters()
}
}
</script>

<style scoped>
.iconDrag {
  padding: 10px;
  cursor: move;
}
</style>
