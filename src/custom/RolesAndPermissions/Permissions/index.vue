<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row :gutter="[16]" type="flex" justify="end" class="mb-2">
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/role-permission/permissions/new')">Создать разрешения</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="auto">
          <a-table :columns="columns" :data-source="roles">
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="active" slot-scope="text"><a-switch v-model="text.active"></a-switch></span>
            <span slot="action" slot-scope="text">
              <a-col span="auto">
                <a-row type="flex" :gutter="[8]">
                  <a-col span="auto">
                    <a-popconfirm
                      title="Вы уверены, чтобы удалить этот студент?"
                      ok-text="Да"
                      cancel-text="Нет"
                      @confirm="deleteStudent(text.id)"
                      @cancel="cancel => null"
                    >
                      <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                        <a-button type="danger" icon="delete" />
                      </a-tooltip>
                    </a-popconfirm>
                  </a-col>
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                      <a-button type="primary" icon="edit" @click="$router.push('/role-permission/permissions/' + text.id)" />
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
        roles: [],
        columns: [
            // {
            //     title: 'ID',
            //     key: 'id',
            //     dataIndex: 'id'
            // },
            {
                title: 'Название',
                key: 'name',
                dataIndex: 'name'
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
        getPermissions () {
            this.$store.dispatch('getPermissions').then(res => {
                console.log(res)
                this.roles = res.map(e => ({ ...e, key: e.id }))
            })
        },
        deleteUserRole (id) {
          this.$store.dispatch('deleteUserRole', id).then(res => {
            this.$deleteFromList(this.roles, id)
            this.$alertMessage('success', 'Deleted', 'Role deleted successfully', this)
          })
        }
    },
    created () {
        this.getPermissions()
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
