<template>
  <page-header-wrapper :title="false">
    <a-row :gutter="[8,8]" type="flex" justify="center">
      <a-col
        flex="auto"
        :xl="24"
        :md="24"
        :xs="24"
        :xxl="24">
        <a-card>
          <a-row type="flex" justify="space-between" class="mb-2">
            <a-col :span="12" :sm="8" :md="6">
              <a-row type="flex" justify="start">
                <a-col span="auto">
                  <a-input-search placeholder="введите текст для поиска" style="width: 200px" @search="onSearch" />
                </a-col>
              </a-row>
            </a-col>
            <a-col span="auto">
              <a-button type="primary" @click="$router.push('/courses/job-list/new')">Новая работа</a-button>
            </a-col>
          </a-row>
          <a-row>
            <a-col v-if="!courses.length">
              <a-skeleton active />
            </a-col>
            <a-col v-else>
              <a-table :columns="columns" :data-source="courses">
                <span slot="tariff" slot-scope="text">
                  <a-tag color="pink">{{ text.tariff }}</a-tag>
                </span>
                <span slot="action" slot-scope="t, record">
                  <a-popconfirm
                    title="Вы уверены, что хотите удалить это задание?"
                    ok-text="Да"
                    cancel-text="Нет"
                    @confirm="deleteJob(t.id)"
                    @cancel="cancel => null"
                  >
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-popconfirm>
                  <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                    <a-button type="primary" icon="edit" @click="$router.push('/courses/job-list/'+record.id)" />
                  </a-tooltip>
                </span>
                <span slot="created_at" slot-scope="text">
                  {{ getDate(text.created_at) | moment('DD.MM.YYYY HH:mm') }}
                </span>
              </a-table>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
const datas = {
  'chapters': [
    {
      'lessons': [
        {
          'body': 'string',
          'file_url': 'string',
          'homeworks': [
            'string'
          ],
          'recourses': [
            'string'
          ],
          'title': 'string',
          'type': 'string'
        }
      ],
      'title': 'string'
    }
  ],
  'created_at': 'string',
  'description': {},
  'duration': 0,
  'picture': 'string',
  'skils': [
    'string'
  ],
  'teacher_ids': [
    'string'
  ],
  'text_fields': [
    {
      'body': [
        {
          'description': 'string',
          'picture': 'string',
          'title': 'string'
        }
      ],
      'title': 'string'
    }
  ],
  'title': 'string',
  'updated_at': 'string'
}
console.log(datas)
export default {
  data () {
    return {
      height: window.innerHeight,
      activated: '',
      modalJob: { flag: false, type: null, data: {} },
      courses: [],
      columns: [
        {
          title: this.$t('table.title'),
          dataIndex: 'title.ru',
          key: 'title.ru',
          width: '25%'
        },
        {
          title: this.$t('table.created_at'),
          key: 'created_at',
          scopedSlots: { customRender: 'created_at' }
        },
        {
          title: this.$t('table.actions'),
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '30%'
        }
      ]
    }
  },
  methods: {
    onSearch () {
    },
    getJobs () {
      this.$store.dispatch('getJobs').then(res => {
        console.log(res)
        this.courses = res.map(el => ({ ...el, key: el.id }))
      })
    },
    deleteJob (id) {
      this.$store.dispatch('deleteJob', id).then(res => {
        this.$notification['error']({
          message: 'Успешно удалено',
          duration: 2
      })
      const idx = this.courses.findIndex(el => el.id === id)
      this.courses.splice(idx, 1)
      })
    },
    getDate (date) {
      return new Date(date)
    }
  },
  created () {
    this.getJobs()
  }
}
</script>

<style lang="less" scoped>
.list_row {
  border-left: 0px solid transparent;
  transition: border-left 0.3s;
  padding: 12px !important;
  width: 100%;
  text-align: start;
  // height: 90px;
  cursor: pointer;
  // height: 40px !important;
}
.list_row p {
  padding: 0px;
}
.list_row h4 {
  font-size: 18px;
  padding: 0px;
}
.active {
  border-left: 8px solid #1890FF;
  background-color: #fafafa;
}
.addButton {
  color: #1890FF;
  background-color: #fcfcfc;
  border: none;
  font-size: 18px;
  text-align: center;
  width: 100%;
  // padding: 20px auto;
  // height: 60px;
  // margin-bottom: 20px;
}
// .addButton p {
//   padding: 10px;
//   width: 200px;
//   background-color: red;
// }
// .button_add {

// }
</style>
