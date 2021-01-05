<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row :gutter="[16]" type="flex" justify="end" class="mb-2">
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/users/tutors/new')">Создать репетитора</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="auto">
          <a-table :columns="columns" :data-source="tutors">
            <span slot="name" slot-scope="text">
              <a-row type="flex" :gutter="16">
                <a-col type="flex" span="auto">
                  <a-avatar :size="50" :src="text.image.url" />
                </a-col>
                <a-col type="flex" span="auto">
                  <h3>{{ text.name }}</h3>
                  <a-tag color="green">{{ text.phone }}</a-tag>
                </a-col>
              </a-row>
            </span>
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="email" slot-scope="text"><a target="_blank" :href="text.email">{{ text.email }}</a></span>
            <span slot="action" slot-scope="text">
              <a-col span="auto">
                <a-row type="flex" :gutter="[8]">
                  <a-col span="auto">
                    <a-popconfirm
                      title="Вы уверены, чтобы удалить этот студент?"
                      ok-text="Да"
                      cancel-text="Нет"
                      @confirm="deleteTutor(text.id)"
                      @cancel="cancel => null"
                    >
                      <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                        <a-button type="danger" icon="delete" />
                      </a-tooltip>
                    </a-popconfirm>
                  </a-col>
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                      <a-button type="primary" icon="edit" @click="$router.push('/users/tutors/' + text.id)" />
                    </a-tooltip>
                  </a-col>
                  <!-- <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                      <a-button type="primary" icon="eye" @click="openDialog(text)" />
                    </a-tooltip>
                  </a-col> -->
                </a-row>
              </a-col>
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
        tutors: [],
        columns: [
            {
                title: 'Репетитор',
                key: 'name',
                scopedSlots: { customRender: 'name' }
            },
             {
                title: 'Эл. адрес',
                key: 'email',
                scopedSlots: { customRender: 'email' }
            },
            {
                title: this.$t('table.created_at'),
                key: 'created_at',
                scopedSlots: { customRender: 'created_at' }
            },
            {
                title: this.$t('table.actions'),
                key: 'action',
                scopedSlots: { customRender: 'action' }
            }
        ]
    }
},
   methods: {
        getTutors () {
            this.$store.dispatch('getTutors').then(res => {
                console.log(res)
                this.tutors = res.tutors.map(e => ({ ...e, key: e.id }))
            })
        },
        deleteTutor (id) {
          this.$store.dispatch('deleteTutor', id).then(res => {
            this.$deleteFromList(this.tutors, id)
            this.$alertMessage('success', 'Deleted', 'Tutor deleted successfully', this)
          })
        }
    },
    created () {
        this.getTutors()
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
