<template>
  <div class="mainIconChange">
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('coming') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          :placeholder="$t('search') + '...'"
          v-debounce="debouncedSearch"
          v-model="page.search"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('coming')" class="breadcrumb-row" :bordered="false">
      <div slot="extra">
        <a-dropdown style="background-color: #00A0E9">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1">
              PDF
            </a-menu-item>
            <a-menu-item key="2">
              Excel
            </a-menu-item>
          </a-menu>
          <a-button>
            <a-icon type="download" />
          </a-button>
        </a-dropdown>
      </div>

      <!--      </router-link>-->
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-table
        :data-source="dataWerhoustList"
        :columns="columns"
        bordered
        :pagination="getPagination"
        :customRow="customRowClick"
        class="cursorpointer"
        :rowKey="record => record.id"
        :loading="loading">
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
        >
          <a-input
            v-ant-ref="c => (searchInput = c)"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block;"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            Search
          </a-button>
          <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
            Reset
          </a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="down"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template slot="counter_agent" slot-scope="text"> {{ text.firstname }} {{ text.lastname }}</template>
        <template slot="bar_code_count" slot-scope="text, record">
          <a-tag :color="record.bar_code_count+record.imei_code_count === record.items_count ? '#E7F4FF' : '#FFEBE5' ">
            <span
              :style="[record.bar_code_count+record.imei_code_count === record.items_count? {color: '#1890FF'} : {color: '#FF3D00'}]"> {{ record.bar_code_count + record.imei_code_count
              }}/{{ record.items_count }}</span>
          </a-tag>
        </template>
        <template slot="number" slot-scope="text"><span style="color: #1890FF">{{ text }}</span></template>
        <template slot="customRender" slot-scope="text, record, index, column">
          <span v-if="searchText && searchedColumn === column.dataIndex">
            <template
              v-for="(fragment, i) in text
                .toString()
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                :key="i"
                class="highlight"
              >{{ fragment }}</mark
              >
              <template v-else>{{ fragment }}</template>
            </template>
          </span>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import moment from 'moment'

export default {
  data () {
    return {
      data: [
        {
          key: '1',
          monthe: '1234-24-03-2021',
          name: 'Макбро Малика',
          age: 'Андианова София',
          address: 'Громов Даниил',
          data: '150',
          number: '0/150 Сканировано',
          summ: '$120 000'
        },
        {
          key: '2',
          monthe: '1234-24-03-2021',
          name: 'Макбро Малика',
          age: 'Андианова София',
          address: 'Громов Даниил',
          data: '150',
          number: '0/150 Сканировано',
          summ: '$120 000'
        },
        {
          key: '3',
          monthe: '1234-24-03-2021',
          name: 'Макбро Малика',
          age: 'Андианова София',
          address: 'Громов Даниил',
          data: '150',
          number: '0/150 Сканировано',
          summ: '$120 000'
        },
        {
          key: '4',
          monthe: '1234-24-03-2021',
          name: 'Макбро Малика',
          age: 'Андианова София',
          address: 'Громов Даниил',
          data: '150',
          number: '0/150 Сканировано',
          summ: '$120 000'
        }
      ],
      dataWerhoustList: [],
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      columns: [
        {
          title: 'Номер',
          dataIndex: 'number',
          key: 'number',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'number'
          },
          onFilter: (value, record) =>
            record.number
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: 'Филиал',
          dataIndex: 'warehouse_id',
          key: 'warehouse_id',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'warehouse_id'
          },
          onFilter: (value, record) =>
            record.warehouse_id
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: 'Кассир',
          dataIndex: 'counter_agent.lastname',
          key: 'address',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.lastname
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              })
            }
          }
        },
        {
          title: 'Поставшик',
          dataIndex: 'counter_agent',
          key: 'counter_agent',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'counter_agent'
          },
          onFilter: (value, record) =>
            record.age
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              })
            }
          }
        },
        {
          title: 'Кол-во',
          dataIndex: 'items_count',
          key: 'items_count',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.data
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              })
            }
          }
        },
        {
          title: ' Сумма',
          dataIndex: 'total_amount',
          key: 'total_amount',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.summ
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              })
            }
          }
        },
        {
          title: 'Сканировано',
          dataIndex: 'bar_code_count',
          key: 'bar_code_count',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'bar_code_count'
          },
          onFilter: (value, record) =>
            record.number
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              })
            }
          }
        }
      ],
      value: '',
      companyId: this.$route.params.company_id,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCompany: null,
      filterParams: {},
      loading: false,
        page: { limit: 1, pageSize: 10, total: null }
    }
  },
  computed: {
    ...mapGetters(['companyWarehouseList', 'companyWarehousePagination', 'searchQuery', 'werhousPagination']),
    getPagination () {
      return this.werhousPagination
    }
  },
  mounted () {
    // this.getWerhousList(this.page).then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    ...mapActions(['getCompanyWarehouse', 'setSearchQuery', 'getWerhousList']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            // eslint-disable-next-line standard/object-curly-even-spacing
            this.$router.push({ name: 'warehouseIncomeUpdate', params: { id: record.id, number: record.number } })
          }
        }
      }
    },
    werhousesListGetAll (page) {
      this.loading = true
      this.$store.dispatch('getWerhousList', page)
        .then(res => {
          this.dataWerhoustList = res.parties
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleMenuClick (e) {
      console.log('click', e)
    },
    moment,
    handleTableChange (pagination) {
      this.loading = true
      this.getCompanyWarehouse({ page: pagination, search: true, company_id: this.$route.params.id })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (companyId) {
      this.getselectedBranch(companyId)
      this.previewVisible = true
    },
    getselectedBranch (companyId) {
      request({
        url: `/branch/${companyId}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedCompany = response
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedCompany = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.$router.push({
        name: this.$route.name,
        query: {
          page: 1,
          limit: 10,
          search: this.params.search
        }
      })
      this.getWerhousList(this.params)
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      // console.log('debounce')
      // console.log('this.shopsData', this.shopsData)
    },
    deleteCompany (e, slug) {
      this.loading = true
      request({
        url: `/warehouse/${slug}`,
        method: 'delete'
      })
        .then(res => {
          this.$message.success(this.$t('successfullyDeleted'))
          this.getCompanyWarehouse({ page: this.companyWarehousePagination, company_id: this.$route.params.id })
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
          this.getCompanyWarehouse({ company_id: this.$route.params.id })
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    },
    handleSearch (selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    }
  },
  created () {
    this.page = { ...this.werhousPagination }
    // if (this.$route.query.page && this.$route.query.limit) {
    //   this.params.page.current = parseInt(this.$route.query.page)
    //   this.params.page.pageSize = parseInt(this.$route.query.limit)
    //   // this.params.search = this.$route.query.search
    // }
    console.log(this.page)
    this.werhousesListGetAll(this.page)
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

.cursorpointer {
  cursor: pointer;
}

.tag {
  color: red;
  background: rgba(255, 61, 0, 0.1);
}
</style>
