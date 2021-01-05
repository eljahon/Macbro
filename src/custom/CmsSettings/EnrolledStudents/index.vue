<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row :gutter="[16]" type="flex" justify="end" class="mb-2">
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/cms-settings/enrolled/new')">создать выпускник</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="auto">
          <a-table :columns="columns" :data-source="featuredStudents">
            <span slot="user" slot-scope="text">
              <a-row type="flex" :gutter="16">
                <a-col type="flex" span="auto">
                  <a-avatar :size="50" :src="text.picture.url" />
                </a-col>
                <a-col type="flex" span="auto">
                  <h3>{{ text.user }}</h3>
                  <a-tag color="green">{{ text.course }}</a-tag>
                </a-col>
              </a-row>
            </span>
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="link" slot-scope="text"><a target="_blank" :href="text.link">{{ text.link }}</a></span>
            <span slot="action" slot-scope="text">
              <a-col span="auto">
                <a-row type="flex">
                  <a-col span="auto">
                    <a-popconfirm
                      title="Вы уверены, чтобы удалить этот студент?"
                      ok-text="Да"
                      cancel-text="Нет"
                      @confirm="deleteFeatured(text.id)"
                      @cancel="cancel => null"
                    >
                      <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                        <a-button class="mx-1" type="danger" icon="delete" />
                      </a-tooltip>
                    </a-popconfirm>
                  </a-col>
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                      <a-button type="primary" icon="edit" @click="$router.push('/cms-settings/enrolled/' + text.id)" />
                    </a-tooltip>
                  </a-col>
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
        featuredStudents: [],
        columns: [
            {
                title: 'Студент',
                key: 'user',
                scopedSlots: { customRender: 'user' }
            },
             {
                title: 'Ссылка',
                key: 'link',
                scopedSlots: { customRender: 'link' }
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
    getFeatureds () {
        this.$store.dispatch('getFeatureStudents').then(res => {
            console.log(res)
            this.featuredStudents = res.map(e => ({ ...e, key: e.id }))
        })
    },
    deleteFeatured (id) {
      this.$store.dispatch('deleteFeatureStudent', id).then(res => {
        this.$deleteFromList(this.featuredStudents, id)
        this.$alertMessage('success', 'Deleted', 'Student deleted successfully', this)
      })
    }
},
created () {
    this.getFeatureds()
}
}
</script>

<style>

</style>
