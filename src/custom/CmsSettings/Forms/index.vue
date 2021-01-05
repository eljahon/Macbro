<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-table :columns="columns" :data-source="forms">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="is_active" slot-scope="text"><a-tag :color=" text.is_active ? 'blue' : 'orange'">{{ text.is_active ? 'pending' : 'seen' }}</a-tag></span>
        <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
        <span slot="action" slot-scope="text">
          <a-col span="auto">
            <a-row type="flex">
              <a-col span="auto">
                <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                  <a-button class="mx-1" @click="deleteForm(text.id)" type="danger" icon="delete" />
                </a-tooltip>
              </a-col>
              <a-col span="auto">
                <a-tooltip placement="bottomLeft" :title="$t('button.preview')">
                  <a-button type="primary" icon="eye" @click="viewModal(text)" />
                </a-tooltip>
              </a-col>
            </a-row>
          </a-col>
        </span>
      </a-table>
      <a-modal v-model="visible.flag" :title="visible.data.name" on-ok="handleOk" :footer="null">
        <a-row type="flex" :gutter="16">
          <a-col span="auto">
            <a-avatar
              shape="square"
              size="large"
              icon="user"
              :style="{ backgroundColor: 'orange', verticalAlign: 'middle' }"
            />
          </a-col>
          <a-col span="auto">
            <span>{{ visible.data.mail ? visible.data.mail : 'No email set' }}</span><br>
            <a :href="`tel:${visible.data.phone}`">{{ visible.data.phone }}</a>
          </a-col>
        </a-row>
        <a-row :gutter="[16]">
          <a-col span="auto" class="my-1">
            <p style="font-size: 16px">{{ visible.data.message }}</p>
          </a-col>
        </a-row>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {

}
</script>

<script>
const columns = [
  {
    title: 'Имя',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Телефонный номер',
    dataIndex: 'phone',
    key: 'age'
  },
  {
    title: 'Эл. адрес',
    dataIndex: 'mail',
    key: 'address 1',
    ellipsis: true,
  },
  {
    title: 'Сообщение',
    dataIndex: 'message',
    key: 'message',
    ellipsis: true,
  },
  {
    title: 'Статус',
    scopedSlots: { customRender: 'is_active' },
    key: 'is_active',
    ellipsis: true,
  },
  {
    title: 'Время отправки',
    scopedSlots: { customRender: 'created_at' },
    key: 'created_at',
    ellipsis: true,
  },
   {
    title: 'Действие',
    scopedSlots: { customRender: 'action' },
    key: 'address 33',
    ellipsis: true,
  }
];

export default {
  data() {
    return {
        visible: {
            flag: false,
            data: {}
        },
        loading: false,
        forms: [],
        columns,
    };
  },
  methods: {
      getForms () {
          this.$store.dispatch('getForms').then(res => {
              // console.log(res)
              this.forms = res.map(el => ({ ...el, key: el.id }))
          })
      },
      viewModal (text) {
          this.visible.flag = true
          this.visible.data = {...text}
          if (!text.is_active) {
            return
          }
          text.is_active = false
          this.$store.dispatch('updateForm', text).then(res => {})
      },
      handleCancel () {
          this.visible.flag = false
      },
      submit () {

      },
      deleteForm () {

      },
  },
  created () {
      this.getForms()
  }
};
</script>
