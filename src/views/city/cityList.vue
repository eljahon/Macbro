<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('cities') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card class="breadcrumb-row" :title="$t('cities')" :bordered="false">
      <div slot="extra">
        <router-link to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-city">{{ $t('add') }}</a-button>
        </router-link>
      </div>
    </a-card>
    <a-card class="breadcrumb-row" :bordered="false">
      <a-row>
        <a-col :span="18">
          <!-- <div class="time-pickers-row" style="display: flex">
            <a-space size="middle">
              <a-date-picker @change="onChange" />
              <a-tag :color="true ? 'blue' :'null'">Сегодня</a-tag>
              <a-tag :color="false ? 'blue' :'null'">Вчера</a-tag>
              <a-tag :color="false ? 'blue' :'null'">Прошлая неделя</a-tag>
              <a-tag :color="false ? 'blue' :'null'">Прошлый месяц</a-tag>
              <a-tag :color="false ? 'blue' :'null'">Прошлый год</a-tag>
            </a-space>
          </div> -->
        </a-col>
        <a-col :lg="6">
          <a-input
            test-attr="search-city"
            id="inputSearch"
            :placeholder="$t('search') + '...'"
            v-decorator="['search', { initialValue: this.getSearchQuery }]"
            v-debounce="debouncedSearch"
          />
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getCitiesList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-city"
      >
        <template slot="action" slot-scope="text, row, index">
          <router-link :to="`./update/${row.id}`" >
            <edit-btn :test-attr="`edit-city${index}`"/>
          </router-link>
          <!-- <delete-btn @confirm="deleteCity($event, row.id)"/> -->
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
      loading: true,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      selectedAgent: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['citiesList', 'citiesPagination', 'searchQuery']),
    getPagination () {
      return this.citiesPagination
    },
    getCitiesList () {
      return this.citiesList
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
      this.setSearchQuery()
    this.getCities({ page: this.citiesPagination })
    .then(() => (console.log('companybranches')))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getCities', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getCities({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getCities()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCity (e, slug) {
      this.loading = true
      request({
        url: `/city/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getCities({ page: this.citiesPagination })
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
          this.getCities()
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
