<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row :gutter="[16]" type="flex" justify="space-between" class="mb-2">
        <a-col span="auto">
          <a-select v-model="user_role_id" style="width: 140px">
            <a-select-option v-for="item in userRoles" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/role-permission/user-permissions/' + user_role_id + '/new')">Создать</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="auto">
          <a-table :columns="columns" :data-source="user_permissions">
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="active" slot-scope="text"><a-switch v-model="text.active"></a-switch></span>
            <span slot="action" slot-scope="text">
              <a-col span="auto">
                <a-row type="flex" :gutter="[8]">
                  <a-col span="auto">
                    <a-popconfirm
                      title="Вы уверены, чтобы удалить этот ?"
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
                      <a-button type="primary" icon="edit" @click="$router.push('/role-permission/user-permissions/' + user_role_id + '/edit/' + text.id)" />
                    </a-tooltip>
                  </a-col>
                  <a-col span="auto">
                    <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                      <a-button type="primary" icon="eye" @click="openDialog(text)" />
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
        user_permissions: [],
        userRoles: [],
        user_role_id: '',
        columns: [
            {
                title: 'Название',
                key: 'permission_name',
                dataIndex: 'permission_name'
            },
            {
                title: 'Доступ',
                key: 'actions',
                scopedSlots: { customRender: 'actions' }
            },
            {
                title: this.$t('table.actions'),
                key: 'action',
                scopedSlots: { customRender: 'action' }
            }
        ]
    }
},
        watch: {
          user_role_id (val) {
              console.log(val)
              this.getUserPermissions(val)
          }
        },
        methods: {
        getUserRoles () {
          console.log()
            this.$store.dispatch('getUserRoles', this.$store.state.Auth.client_id).then(res => {
                this.userRoles = res.user_roles
            })
        },
        deleteUserPermission (id) {
          this.$store.dispatch('deleteUserPermission', id).then(res => {
            this.$deleteFromList(this.roles, id)
            this.$alertMessage('success', 'Deleted', 'user permission deleted successfully', this)
          })
        },
        getUserPermissions (userRoleId) {
            this.$store.dispatch('getUserRolePermissions', userRoleId).then(res => {
                console.log(res)
                this.user_permissions = res.map(el => ({ ...el, key: el.id }))
          })
        }
    },
    created () {
        this.getUserRoles()
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
