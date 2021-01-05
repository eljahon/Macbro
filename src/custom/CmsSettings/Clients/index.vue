<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row type="flex" justify="end" class="mb-1">
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/cms-settings/clients/new')">Create client</a-button>
        </a-col>
      </a-row>
      <a-table :columns="columns" :data-source="clients">
        <a slot="name.ru" slot-scope="text">{{ text.name.ru }}</a>
        <span slot="picture.url" slot-scope="text"><img class="img_style" :src="text.picture.url" :alt="text.picture.url"></span>
        <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
        <span slot="action" slot-scope="text">
          <a-col span="auto">
            <a-row type="flex">
              <a-col span="auto">
                <a-popconfirm
                  title="Вы уверены, что удалите эту главу?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="deleteClient(text.id)"
                  @cancel="cancel => null"
                >
                  <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                    <a-button class="mx-1" type="danger" icon="delete" />
                  </a-tooltip>
                </a-popconfirm>
              </a-col>
              <a-col span="auto">
                <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                  <a-button type="primary" icon="edit" @click="$router.push('/cms-settings/clients/' + text.id)" />
                </a-tooltip>
              </a-col>
            </a-row>
          </a-col>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>

const columns = [
   {
    title: 'Picture',
    scopedSlots: { customRender: 'picture.url' },
    key: 'picture.url'
  },
  {
    title: 'client name',
    key: 'user',
    scopedSlots: { customRender: 'name.ru' },
    width: '24%'
  },
  {
    title: 'Created at',
    scopedSlots: { customRender: 'created_at' },
    key: 'created_at'
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '20%'
  }
]
export default {
    data () {
        return {
            columns,
            clients: []
        }
    },
    methods: {
        getClients () {
            this.$store.dispatch('getClients').then(res => {
                console.log(res)
                this.clients = res.map(e => ({ ...e, key: e.id }))
            })
        },
        deleteClient (id) {
          this.$store.dispatch('deleteClient', id).then(res => {
            this.$deleteFromList(this.clients, id)
            this.$alertMessage('success', 'Deleted', 'Client deleted successfully', this)
          })
        }
    },
    created () {
        this.getClients()
    }

}
</script>

<style lang="less" scoped>
.img_style{
    width: 70px;
    height: 70px;
    object-fit: cover;
}
</style>
