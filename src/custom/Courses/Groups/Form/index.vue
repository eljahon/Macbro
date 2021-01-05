<template>
  <a-card>
    <a-row type="flex">
      <a-col :span="12" :offset="2">
        <a-divider orientation="left">Форма</a-divider>
        <a-form-model
          :colon="false"
          ref="ruleForm"
          :model="form"
          :rules="rules"
        >
          <a-row class="form-row" :gutter="16">
            <a-col>
              <a-form-model-item ref="name" label="Название" prop="name">
                <a-tabs default-active-key="1" @change="callback">
                  <a-tab-pane key="1" tab="English">
                    <a-input placeholder="Название на английском языке" v-model="form.title.en" />
                  </a-tab-pane>
                  <a-tab-pane key="2" tab="Russian" force-render>
                    <a-input placeholder="Название на русском языке" v-model="form.title.ru" />
                  </a-tab-pane>
                  <a-tab-pane key="3" tab="Uzbek">
                    <a-input placeholder="Название на узбекском языке" v-model="form.title.uz" />
                  </a-tab-pane>
                </a-tabs>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item ref="name" label="Роли для системного пользователя" prop="tariff_id">
                <a-select v-model="form.tariff_id">
                  <a-select-option v-for="(item, i) in tariffs" :key="i" :value="item.id">
                    {{ item.title.ru }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item ref="name" label="Временной интервал" prop="aspects">
                <a-row type="flex" justify="space-between" v-for="(item, i) in form.timeslots" :key="i">
                  <a-col span="auto">
                    <a-select v-model="item.day" style="width: 120px">
                      <a-select-option v-for="(day,d) in days" :key="d" :value="day.id">
                        {{ day.title }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col span="auto"><a-time-picker placeholder="Время" v-model="item.from" format="HH:mm" /></a-col>
                  <a-col span="auto"><a-time-picker placeholder="Время" v-model="item.to" format="HH:mm" /></a-col>
                  <a-col span="auto"><a-button @click="deleteRow(item)" shape="circle" type="link" icon="close"></a-button></a-col>
                </a-row>
                <a-button block type="dashed" @click="addTimeslot">Новый слот</a-button>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item ref="name" label="Аспекты" prop="aspects">
                <a-tabs type="editable-card" hide-add @edit="onEdit">
                  <a-tab-pane v-for="(item, i) in form.aspects" :key="item.id" :tab="`Аспект ${i + 1}`">
                    <a-tabs default-active-key="1" @change="callback">
                      <a-tab-pane key="1" tab="English">
                        <a-input placeholder="Название" v-model="item.title.en" />
                        <a-input class="my-1" placeholder="значение" v-model="item.value.en" />
                      </a-tab-pane>
                      <a-tab-pane key="2" tab="Russian" force-render>
                        <a-input placeholder="Название" v-model="item.title.ru" />
                        <a-input class="my-1" placeholder="значение" v-model="item.value.ru" />
                      </a-tab-pane>
                      <a-tab-pane key="3" tab="Uzbek">
                        <a-input placeholder="Название" v-model="item.title.uz" />
                        <a-input class="my-1" placeholder="значение" v-model="item.value.uz" />
                      </a-tab-pane>
                    </a-tabs>
                  </a-tab-pane>
                </a-tabs>
                <a-button block type="dashed" @click="addAspect">Новый аспект</a-button>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item ref="name" label="Ссылка для приглашения" prop="role">
                <a-input placeholder="Ссылка" v-model="form.invite_link" />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item ref="price" prop="price" label="Цена">
                <a-input-number v-model="form.price" :min="1000" :max="100000000" :default-value="3" @change="onChange" />
              </a-form-model-item>
              <a-form-model-item label="">
                <a-row type="flex" justify="end">
                  <a-col span="auto">
                    <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
                    <a-button @click="postGroup" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
                    <a-button @click="updateGroup" v-else type="primary">{{ $t('button.save') }}</a-button>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      tariffs: '',
      isNewForm: true,
      days: [
        { title: 'Sunday', id: 0 },
        { title: 'Monday', id: 1 },
        { title: 'Tuesday', id: 2 },
        { title: 'Wednesday', id: 3 },
        { title: 'Thursday', id: 4 },
        { title: 'Friday', id: 5 },
        { title: 'Saturday', id: 6 }
      ],
      form: {
        course_id: this.$route.params.id,
        invite_link: '',
        price: 23000,
        students: ['string'],
        tariff_id: '',
        timeslots: [
          {
            day: 0,
            from: '',
            to: '',
            id: 2
          }
        ],
        title: {
          en: '',
          ru: '',
          uz: ''
        },
        aspects: [
          {
            title: {
              en: '',
              ru: '',
              uz: ''
            },
            value: {
              en: '',
              ru: '',
              uz: ''
            },
            id: Math.random() * 200
          }
        ]
      },
      rules: {}
    }
  },
  methods: {
    moment,
    callback () {

    },
    onEdit (e, p) {
      this.$deleteFromList(this.form.aspects, e)
    },
    onChange () {

    },
    deleteRow (row) {
      console.log(row)
      this.form.timeslots.splice(this.form.timeslots.findIndex(el => el.id === row.id), 1)
    },
    addTimeslot () {
      this.form.timeslots.push(
        {
        'day': 0,
        'from': '',
        'to': '',
        id: Math.random() * 100
        }
      )
    },
    addAspect () {
      this.form.aspects.push({
            title: {
              en: '',
              ru: '',
              uz: ''
            },
            value: {
              en: '',
              ru: '',
              uz: ''
            },
            id: Math.random() * 100
          })
    },
    cancelPost () {
      this.$router.push('/courses/groups')
    },
    getGroup (id) {
       this.$store.dispatch('getGroup', id).then(res => {
         console.log(res)
        this.form = res.group
        this.form.tariff_id = res.group.tariff_id.id
        this.form.timeslots = res.group.timeslots.map(el => ({ ...el, id: Math.random() * 100 }))
        this.form.aspects = res.group.aspects.map(el => ({ ...el, id: Math.random() * 100 }))
      })
    },
    getTariffs () {
      this.$store.dispatch('getTariffs').then(res => {
        this.tariffs = res
      })
    },
    postGroup () {
      const form = { ...this.form }
      form.timeslots = form.timeslots.map(el => ({ ...el }))
      console.log(form)
      this.$store.dispatch('postGroup', form).then(res => {
        this.cancelPost()
      })
    },
    updateGroup () {
      this.$store.dispatch('updateGroup', this.form).then(res => {
        this.cancelPost()
      })
    }
  },
  created () {
    if (this.$route.name === 'edit-groups') {
      this.isNewForm = false
      this.getGroup(this.$route.params.id)
    }
    this.getTariffs()
  }
}
</script>

<style>
</style>
