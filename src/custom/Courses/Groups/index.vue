<template>
  <page-header-wrapper :title="false">
    <a-row type="flex" :gutter="[16]">
      <a-col :span="7">
        <a-card>
          <a-card-grid style="width: 100%; padding: 7px" :hoverable="false">
            <a-input placeholder="search courses" v-model="search"></a-input>
          </a-card-grid>
          <a-card-grid
            :hoverable="false"
            :class="`selected ${item.selected}`"
            v-for="item in courses"
            :key="item.id"
            style="width: 100%; cursor: pointer"
            @click="showGroup(item)">
            <a-row type="flex" :gutter="[16]" justify="space-between">
              <a-col span="5" sm="24">
                <img :src="item.picture.url" :alt="item.picture.url">
              </a-col>
              <a-col span="19">
                <h4>{{ item.title.ru }}</h4>
                <small>{{ item.description.ru.length > 50 ? item.description.ru.substring(0, 50) : item.description.ru }}</small>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col span="17">
        <a-card>
          <a-row type="flex" justify="space-between">
            <a-col span="auto">
              <h4 v-if="chosenCourse.title !==null">{{ chosenCourse.title.ru }}</h4>
            </a-col>
            <a-col span="auto">
              <a-button type="primary" @click="$router.push(`/courses/groups/${chosenCourse.id}/new`)">{{ $t('button.create') }}</a-button>
            </a-col>
          </a-row>
          <a-table :columns="columns" :data-source="groups">
            <span slot="created_at" slot-scope="text"> {{ $date(text.created_at) | moment('DD.MM.YYYY HH:mm') }} </span>
            <span slot="tariff_id.title" slot-scope="text"> <a-tag color="pink">{{ text.tariff_id.title.ru }}</a-tag> </span>
            <span slot="action" slot-scope="text">
              <a-row type="flex">
                <a-col span="auto">
                  <a-popconfirm
                    title="Вы уверены, что удалите ?"
                    ok-text="Да"
                    cancel-text="Нет"
                    @confirm="deleteGroup(text)"
                    @cancel="cancel => null"
                  >
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-popconfirm>
                </a-col>
                <a-col span="auto">
                  <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                    <a-button type="primary" @click="$router.push(`/courses/groups/${text.id}/edit`)" icon="edit" />
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
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
export default {
data () {
  return {
    chosenCourse: {
      id: 'e1cb10b7-39a3-4676-ae40-71f4913547f5',
      title: null
    },
    search: null,
    courses: [],
    tempCourses: [],
    groups: [],
    columns: [
      {
        title: this.$t('table.title'),
        dataIndex: 'title.ru',
        key: 'table'
      },
       {
        title: 'Тариф',
        scopedSlots: { customRender: 'tariff_id.title' },
        key: 'tariff_id'
      },
       {
        title: this.$t('table.created_at'),
        scopedSlots: { customRender: 'created_at' },
        key: 'created_at'
      },
       {
      title: 'Действия',
      scopedSlots: { customRender: 'action' },
      key: 'action',
      width: '30%'
    }
    ]
  }
},
watch: {
  search (value) {
    if (value.trim()) {
      this.courses = [...this.tempCourses]
      this.courses = this.courses.filter(el => el.title.ru.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
    } else this.courses = [...this.tempCourses]
  }
},
  methods: {
    showGroup (item) {
      this.chosenCourse = item
      this.courses.forEach(el => {
        el.selected = ''
      })
      item.selected = 'selectedItem'
      if (this.$route.query.course_id === item.id) {
        return -1
      }
      this.getGroups(item.id)
      this.$router.replace({ query: { course_id: item.id } })
      console.log(this.$route)
    },
    getGroups (id) {
      this.$store.dispatch('getGroups', id).then(res => {
        this.groups = res.map(el => ({ ...el, key: el.id }))
      })
    },
    deleteGroup (item) {
      this.$store.dispatch('deleteGroup', item.id).then(res => {
        this.$deleteFromList(this.groups, item.id)
        this.$alertMessage('success', 'Deleted', 'Successfully deleted', this)
      })
    },
    getCourses () {
      this.$store.dispatch('getCourses').then(res => {
        console.log(res)
        this.tempCourses = res.map(el => ({ ...el, selected: '' }))
        this.courses = res
        if (!this.$isNewForm(this.$route.query)) {
        this.courses.forEach(el => {
          if (el.id === this.$route.query.course_id) {
            el.selected = 'selectedItem'
          }
        })
      }
      })
    }
  },
  created () {
    if (!this.$isNewForm(this.$route.query)) {
      this.getGroups(this.$route.query.course_id)
    }
    this.getCourses()
  }
}
</script>

<style lang="less" scoped>
.selected {
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.selectedItem {
  // border-left: 5px solid #1890FF;
  background:  #1890FF;
  color: white !important;
}
.trancateText {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
