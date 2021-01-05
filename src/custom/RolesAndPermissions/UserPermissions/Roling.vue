<template>
  <page-header-wrapper :title="false">
    <a-row :gutter="[8]">
      <a-col :span="7">
        <a-card style="height: auto">
          <a-input @change="search" placeholder="input search text" style="padding: 14px" />
          <div :class="item.disabled ? 'card_left back_color' : 'card_left'" v-for="item in permissions" :key="item.id">
            <a-row type="flex" justify="space-between" align="middle">
              <a-col span="auto">
                <span class="mx-1">{{ item.name }}</span>
              </a-col>
              <a-col span="auto">
                <a-button :disabled="item.disabled" type="border" @click="addToUserPermission(item)">Add</a-button>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
      <a-col span="17">
        <a-card style="width: 100%">
          <a-table bordered :columns="columns" :data-source="userPermissions">
            <span slot="create" slot-scope="text">
              <a-switch @change="onChange(text, text.create)" v-model="text.create"/>
            </span>
            <span slot="read" slot-scope="text">
              <a-switch @change="onChange(text, text.read)" v-model="text.read"/>
            </span>
            <span slot="update" slot-scope="text">
              <a-switch @change="onChange(text, text.update)" v-model="text.update"/>
            </span>
            <span slot="delete" slot-scope="text">
              <a-switch @change="onChange(text, text.delete)" v-model="text.delete"/>
            </span>
            <span slot="action" slot-scope="text, record">
              <a-row type="flex" :gutter="[16]">
                <a-col span="auto" v-if="text.id">
                  <a-popconfirm
                    title="Вы действительно хотите удалить это разрешение пользователя ?"
                    ok-text="Да"
                    cancel-text="Нет"
                    @confirm="deleteUserRolePermission(text)"
                    @cancel="(cancel) => null"
                  >
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a>{{ $t('button.delete') }}</a>
                    </a-tooltip>
                  </a-popconfirm>
                </a-col>
                <a-col span="auto" v-else>
                  <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                    <a @click="removePerminant(record)">{{ $t('button.delete') }}</a>
                  </a-tooltip>
                </a-col>
                <a-col span="auto" v-if="!text.id">
                  <a @click="postUserPermission(text)">{{ $t('button.save') }}</a>
                </a-col>
              </a-row>
            </span>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
export default {
data () {
  return {
        permissions: [],
        csp: true,
        user_role_id: '',
        cachedData: [],
        userPermissions: [],
         columns: [
            {
                title: 'Название',
                key: 'permission_name',
                dataIndex: 'permission_name'
            },
            {
              title: 'Список разрешений',
                children: [
                  {
                    title: 'СОЗДАТЬ',
                    scopedSlots: { customRender: 'create' },
                    key: 'building',
                    width: 100
                  },
                  {
                    title: 'ЧИТАТЬ',
                    scopedSlots: { customRender: 'read' },
                    key: 'numbdaer',
                    width: 100
                  },
                  {
                    title: 'ИЗМЕНИТЬ',
                    scopedSlots: { customRender: 'update' },
                    key: 'numbdser',
                    width: 110
                  },
                  {
                    title: 'УДАЛИТЬ',
                    scopedSlots: { customRender: 'delete' },
                    key: 'numbesdr',
                    width: 100
                  }
                ]
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
  search (e) {
    const tempPermissions = [...this.permissions]
    if (e.target.value.trim().length > 0) {
      this.permissions = tempPermissions.filter(el => el.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
    } else {
      this.getPermissions()
    }
  },
  onChange (data, flag) {
    if (data.id) { this.updateUserPermission(data) }
  },
  getPermissions () {
    this.$store.dispatch('getPermissions').then(res => {
        this.$store.dispatch('getUserRolePermissions', this.user_role_id).then(result2 => {
          this.setUserRolePermissions(result2)
          this.permissions = res.map(el => {
              return {
                ...el,
                disabled: result2.filter(ds => {
                  return el.id === ds.permission_id
                }).length > 0
              }
          })
          console.log(this.permissions)
        })
    })
  },
  setUserRolePermissions (list) {
    this.userPermissions = list.map(el => ({
      create: el.actions.create,
      read: el.actions.read,
      update: el.actions.update,
      delete: el.actions.delete,
      permission_id: el.permission_id,
      permission_name: el.permission_name,
      key: el.id,
      id: el.id
    }))
  },
  postUserPermission (data) {
    console.log(data)
    const form = {
        'actions': {
          'create': data.create,
          'delete': data.delete,
          'read': data.read,
          'update': data.update
        },
        'permission_id': data.permission_id,
        'permission_name': data.permission_name,
        id: '',
        key: data.permission_id
        }
      this.$store.dispatch('postUserRolePermission', { ...form, user_role_id: this.user_role_id }).then(res => {
        console.log(res)
        this.getUserRolePermissions()
        this.$alertMessage('success', 'Created', 'User Role Permission created successfully', this)
      })
  },

  addToUserPermission (data) {
    data.disabled = true
    this.userPermissions.push(
      {
        create: true,
        read: true,
        update: true,
        delete: true,
        permission_id: data.id,
        permission_name: data.name,
        key: data.id,
        id: ''
      }
    )
  },
  removeFromPermissions (data) {
    console.log(data)
   this.$deleteFromList(this.userPermissions, data.id)
   this.permissions.forEach(el => {
     if (el.id === data.permission_id) {
          el.disabled = false
      }
     })
  },
  getUserRolePermissions () {
    this.$store.dispatch('getUserRolePermissions', this.user_role_id).then(res => {
      this.setUserRolePermissions(res)
    })
  },
  updateUserPermission (data) {
    const form = {
        'actions': {
          'create': data.create,
          'delete': data.delete,
          'read': data.read,
          'update': data.update
        },
        'permission_id': data.permission_id,
        'permission_name': data.permission_name,
        user_role_permission_id: data.id,
        user_role_id: this.user_role_id
        }
        this.$store.dispatch('updateUserRolePermission', form).then(res => {
        this.$alertMessage('success', 'Success', 'User permission has updated successfully', this)
    })
  },
  removePerminant (id) {
    console.log(id)
    this.userPermissions.splice(this.userPermissions.findIndex(el => el.key === id.key), 1)
       this.permissions.forEach(el => {
     if (el.id === id.key) {
          el.disabled = false
      }
     })
  },
  deleteUserRolePermission (data) {
    if (data.id === '') {
      this.removeFromPermissions(data)
      return
    }
        const form = {
        user_role_permission_id: data.id,
        user_role_id: this.user_role_id
        }
    this.$store.dispatch('deleteUserRolePermission', form).then(e => {
      this.removeFromPermissions(data)
      this.$alertMessage('success', 'Deleted', 'Role deleted successfully', this)
    })
  }
},
created () {
  this.user_role_id = this.$route.params.id
  console.log(this.$route.params.id)
  this.getPermissions()
}
}
</script>

<style scoped>
.card_left {
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
  border-radius: 2px;
  padding: 3px !important;
  background: rgb(255, 255, 255);
}
.back_color {
  background: rgb(240, 240, 240);
  color: rgb(160, 160, 160);
}
</style>
