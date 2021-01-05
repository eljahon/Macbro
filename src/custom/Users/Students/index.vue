<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row :gutter="[16]" type="flex" justify="end" class="mb-2">
        <a-col span="auto">
          <a-button type="primary" @click="$router.push('/users/students/new')">Создать студента</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="auto">
          <a-table
            :columns="columns"
            :data-source="students"
            :pagination="pagination"
            @change="getPagination"
            :indentSize="5">
            <span slot="name" slot-scope="text">
              <a-row type="flex" :gutter="16">
                <a-col type="flex" span="auto">
                  <a-avatar :size="50" v-if="text.image.url" :src="text.image.url" />
                  <a-avatar :size="50" v-else v-text="text.name.substring(0,1).toUpperCase()" />
                </a-col>
                <a-col type="flex" span="auto">
                  <h3>{{ text.name }}</h3>
                  <a-tag color="green">{{ text.phone }}</a-tag>
                </a-col>
              </a-row>
            </span>
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
                      <a-button type="primary" icon="edit" @click="$router.push('/users/students/' + text.id)" />
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
        students: [],
        pagination: {
          current: 1
        },
        columns: [
            {
                title: 'Репетитор',
                key: 'name',
                scopedSlots: { customRender: 'name' }
            },
            {
                title: this.$t('table.created_at'),
                key: 'created_at',
                scopedSlots: { customRender: 'created_at' }
            },
            // {
            //     title: 'Статус',
            //     key: 'active',
            //     scopedSlots: { customRender: 'active' }
            // },
            {
                title: this.$t('table.actions'),
                key: 'action',
                scopedSlots: { customRender: 'action' }
            }
        ]
    }
},
        methods: {
        getPagination (e) {
          this.$router.push({ path: this.$route.fullPath, query: { offset: (e.current - 1) * 10, limit: 10 } })
          this.getStudents(this.$route.query)
          this.pagination.current = e.current
        },
        getStudents (pagination) {
            this.$store.dispatch('getStudents', pagination).then(res => {
                // console.log(res.students.length)
                this.students = res.students.map(e => ({ ...e, key: e.id }))
                const pagination = { ...this.pagination }
                pagination.total = res.count
                this.pagination = pagination
                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0
            })
        },
        deleteStudent (id) {
          this.$store.dispatch('deleteStudent', id).then(res => {
            this.$deleteFromList(this.students, id)
            this.$alertMessage('success', 'Deleted', 'Student deleted successfully', this)
          })
        }
    },
    created () {
      this.$setupQuery(this)
      this.getStudents(this.$route.query)
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
