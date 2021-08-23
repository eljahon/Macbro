<template>
  <div>
    <a-card :title="$t('staff')" :bordered="false">
      <div slot="extra">
        <router-link :to="{name: 'CompaniesUserCreate',query: {companyId: $route.params.id}}" slot="extra">
          <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="search-branch">{{ $t('add') }}</a-button>
        </router-link>
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getCompanyBranchesList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-branch"
        bordered
      >
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-branch"/> -->
          <!-- <router-link :to="`./${row.id}/branches/list`" >
            <a-tooltip><template slot="title">{{ $t('branches') }}</template>
              <a-button id="buttonPreview" type="default" icon="branches"></a-button>
            </a-tooltip>
          </router-link> -->
          <router-link :to="`/company/user/update/${row.id}`">
            <edit-btn :test-attr="`edit-branch${index}`"/>
          </router-link>
          <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-branch${index}`"/>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  data () {
    return {
      value: '',
      data: [],
      companyId: this.$route.params.company_id,
      loading: true,
      params: {
        page: {
          pageSize: 10,
          current: 1,
          total: null
        },
        search: '',
        company_id: this.$route.params.id,
        user_type: '',
        user: '',
        offset: 0
      },
      columns: [
        {
          title: this.$t('fistname'),
          dataIndex: 'first_name',
          align: 'center'
        },
        {
          title: this.$t('lastname'),
          dataIndex: 'last_name',
          align: 'center'
        },
        {
          title: this.$t('phone_number'),
          dataIndex: 'phone_number',
          align: 'center'
        },
        {
          title: this.$t('inn'),
          dataIndex: 'inn',
          align: 'center'
        },
        {
          title: this.$t('тип пользователя'),
          dataIndex: 'user_type',
          align: 'center'
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCompany: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['searchQuery']),
    getPagination () {
      return {}
    },
    getCompanyBranchesList () {
      return this.data
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
      this.setSearchQuery()
    this.getUsers(this.params).then(res => {
      console.log(res)
      this.data = res.users
    }).catch(err => {
      console.log(err)
    })
    .finally(() => {
      this.loading = false
    })
  //   this.getCompanyBranches({ page: this.companyBranchesPagination })
  //     .then(() => (console.log('companybranches')))
  //     .catch(error => {
  //       this.requestFailed(error)
  //       console.error(error)
  //     })
  //     .finally(() => (this.loading = false))
  },
  methods: {
    companyid (value) {
      console.log(value)
    },
    ...mapActions(['getCompanyBranches', 'setSearchQuery', 'getUsers']),
    handleTableChange (pagination) {
      this.loading = true
      this.getCompanyBranches({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getCompanyBranches()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCompany (e, slug) {
      console.log(slug)
      this.loading = true
      request({
        url: `/user/${slug}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getUsers(this.params).then(res => {
          this.data = res.users
        })
      })
      .catch(err => {
        this.$message.error(err)
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        this.loading = true
        if (!err) {
          this.filterParams = values
          this.getCompanyBranches()
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    }
  }
}
</script>
<style>
img.shops-image {
    display: block !important;
    margin: 0 auto !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
</style>
