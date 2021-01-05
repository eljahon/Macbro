<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-row type="flex" justify="space-between">
          <a-col span="auto">
            <a-list :grid="{ gutter: 2 }">
              <a-list-item>
                <h2>Преимущества</h2>
              </a-list-item>
              <a-list-item>Вы можете добавить новое предложение и преимущества образовательного центра</a-list-item>
            </a-list>
          </a-col>
          <a-col span="auto">
            <a-button type="primary" @click="$router.push('/cms-settings/about-us/offers/new')">{{
              $t('button.new')
            }}</a-button>
          </a-col>
        </a-row>
        <a-table :columns="columns" :data-source="advantages">
          <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
          <span slot="updated_at" slot-scope="text">{{ $date(text.updated_at) | moment('DD.MM.YY HH:mm') }}</span>
          <span slot="image" slot-scope="text">
            <img width="100" class="img_layout" :src="text.image" alt="" />
          </span>
          <span slot="action" slot-scope="text">
            <a-row type="flex">
              <a-col span="auto">
                <a-popconfirm
                  title="Are you sure delete this advantage?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteAdvantage(text.id)"
                  @cancel="(cancel) => null"
                >
                  <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                    <a-button class="mx-1" type="danger" icon="delete" />
                  </a-tooltip>
                </a-popconfirm>
              </a-col>
              <a-col span="auto">
                <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                  <a-button @click="$router.push('/cms-settings/about-us/offers/' + text.id)" type="primary" icon="edit" />
                </a-tooltip>
              </a-col>
            </a-row>
          </span>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      advantages: [],
      columns: [
        {
          dataIndex: 'title.ru',
          key: 'title',
          title: this.$t('table.title')
        },
        {
          title: this.$t('table.subtitle'),
          key: 'subtitle',
          dataIndex: 'description.ru'
        },
        {
          title: this.$t('table.created_at'),
          scopedSlots: { customRender: 'created_at' },
          key: 'created_at'
        },
        {
          title: this.$t('table.updated_at'),
          key: 'updated_at',
          scopedSlots: { customRender: 'updated_at' }
        },
        {
          title: this.$t('table.actions'),
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '20%'
        }
      ],
      value: ''
    }
  },
  methods: {

    getAdvantages () {
      this.$store.dispatch('getAdvantages').then(res => {
        console.log(res)
        this.advantages = res.map(el => ({ ...el, key: el.id }))
      })
    },
    deleteAdvantage (id) {
      this.$store.dispatch('deleteAdvantage', id).then(res => {
        this.$deleteFromList(this.advantages, id)
        this.$alertMessage('success', 'Deleted', 'Advantage deleted successfully', this)
      })
    }
  },
  created () {
    this.getAdvantages()
  }
}

</script>

<style scoped>
.img_layout {
  width: 100px;
  height: 80px;
  object-fit: cover;
}
</style>
