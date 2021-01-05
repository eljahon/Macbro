<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row type="flex" justify="space-between">
        <a-col span="auto">
          <h2>Тарифные планы</h2>
        </a-col>
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/courses/tariffs/new')">Новый тариф</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns" :data-source="tariffs">
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="picture.url" slot-scope="text"><img width="60" height="60" :src="text.picture.url" :alt="text.picture.url"></span>
            <span slot="actions" slot-scope="text">
              <a-popconfirm
                title="Вы уверены, что удалите эту?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="deleteTariff(text)"
                @cancel="cancel => null"
              >
                <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                  <a-button class="mx-1" type="danger" icon="delete" />
                </a-tooltip>
              </a-popconfirm>
              <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                <a-button @click="$router.push('/courses/tariffs/' + text.id)" type="primary" icon="edit" />
              </a-tooltip>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
data () {
  return {
    columns: [
      {
        title: 'Название тарифа',
        dataIndex: 'title.ru',
        key: 'title.ru'
      },
       {
        title: 'Картина',
        scopedSlots: { customRender: 'picture.url' },
        key: 'picture.url'
      },
      {
        title: 'Создано',
        scopedSlots: { customRender: 'created_at' },
        key: 'created_at'
      },
      {
        title: 'Действия',
        scopedSlots: { customRender: 'actions' },
        key: 'actions'
      }
    ],
    tariffs: []
  }
},
methods: {
  getTariffs () {
    this.$store.dispatch('getTariffs').then(res => {
      console.log(res)
      this.tariffs = res.map(el => ({ ...el, key: el.id }))
    })
  },
  deleteTariff (data) {
    this.$store.dispatch('deleteTariff', data.id).then(res => {
      this.$alertMessage('error', data.title.ru, 'Successfully deleted', this)
      this.$deleteFromList(this.tariffs, data.id)
    })
  }
},
created () {
  this.getTariffs()
}
}
</script>

<style>

</style>
