<template>
  <div>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="getcontorsList"
      :pagination="getPagination"
      :loading="loading"
      @change="handleTableChange"
      test-attr="list-customer"
      bordered
      :customRow="customRowClick"
      class="pointer"
    >
      <template slot="tag" slot-scope="text">
        <div v-if="text"> <a-tag :color="text ? '#E8F4FF' : 'blue'"><span style="color:#1890FF">Физ. лицо</span></a-tag></div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  watch: {
    search: (value) => {
      console.log(value)
      // this.params.search = value
      // this.loading = true
      //   this.getContractorsAllList(this.params)
      //     .then(res => {
      //       console.log(res)
      //     }).catch(error => {
      //     console.log(error)
      //   }).finally(() => {
      //     this.loading = false
      //   })
      }
  },
  data () {
    return {
      data: [],
      params: {
        page: { current: 1, pageSize: 10, total: null },
        search: '',
        offset: 0,
        user_type: 'counteragent'
      },
      columns: [
        {
          title: this.$t('firstName'),
          dataIndex: 'first_name'
        },
        {
          title: this.$t('lastName'),
          dataIndex: 'last_name'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone_number',
          width: '20%'
        },
        {
          title: this.$t('counterpartyType'),
          width: '10%',
          scopedSlots: { customRender: 'tag' }
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: 120,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      loading: false,
      search: this.$route.query.search
    }
  },
  methods: {
    ...mapActions(['getContractorsAllList']),
    getContractorsAll () {
      this.loading = true
      this.params.page = { ...this.contractorsPagination }
      this.$store.dispatch('getContractorsAllList', this.params)
        .then(res => {
          console.log(res)
          this.data = res
        })
        .catch(err => {
          console.log(err)
        })
      .finally(() => {
        this.loading = false
      })
    },
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`/customers/update/${record.id}`)
          }
        }
      }
    },
    handleTableChange (pagination) {
      this.params.page = pagination
      this.loading = true
      this.getContractorsAllList(this.params)
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    }
  },
  computed: {
    ...mapGetters(['contractorsList', 'contractorsPagination']),
    getPagination () {
      return this.contractorsPagination
    },
    getcontorsList () {
      return this.contractorsList
    }

//     if(search) {
//       console.log(search)
// }
  },
  mounted () {
    this.params.page = { ...this.contractorsPagination }
    this.loading = true
    this.getContractorsAllList(this.params)
      .then(res => {
        console.log(res)
      }).catch(error => {
      console.log(error)
    }).finally(() => {
      this.loading = false
    })
  },
  created () {
  }
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
