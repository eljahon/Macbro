<template>
  <a-table
    style="margin-top: 30px; cursor: pointer"
    :columns="columns"
    :rowKey="() => Math.random()"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="loading"
    :customRow="customRowClick"
    @change="handleTableChangeOfline"
    test-attr="list-customer"
    bordered
  >
    <div
      slot="branchDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        show-search
        allowClear
        @change="selectBranch"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Филиал`"
        :options="branchList"
        @search="searchBranch"
      />
    </div>
    <div
      slot="userDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        show-search
        allowClear
        @change="selectUser"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Покупатель`"
        :options="userList"
        @search="searchUser"
      />
    </div>
    <div slot="statusDropdown" style="padding: 8px; width: 230px;">
      <a-select
        :placeholder="$t('Статус')"
        style="width: 220px"
        allowClear
        @change="handleStatus"
        :options="statusesList"
      >
      </a-select>
    </div>
    <div
      slot="numberDropdown"
      style="padding: 8px"
    >
      <a-input-number
        style="width: 220px"
        v-debounce="seracherNumber"
        :placeholder="`ИД. аккаунта`"
      />
    </div>
    <a-icon
      style="font-size: 20px; color: transparent; background-color: transparent"
      slot="filterIcon"
      class="filter-dropdown-icon"
      :component="$myIcons.filterDownIcon"
    />
    <template slot="statuses" slot-scope="text, row">
      <a-tag :color="row.status === 'active' ? 'blue' : 'red'">{{ row.status === 'active' ? 'Активный' : 'Не активный' }}</a-tag>

    </template>
    <template slot="customer" slot-scope="text, row">
      <table-user :name="`${row.cashier.first_name} ${row.cashier.last_name} `" :image="row.cashier.profile_image" :type="userType[row.cashier.user_type]" :phone="row.cashier.phone_number"/>
    </template>
      <template slot="sum" slot-scope="text, row">
        <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.sum) }}</span>
      </template>
  </a-table>
</template>

<script>
import tableUser from '../../../components/TableUserColumn/TableUserColumn'
export default {
  components: {
    tableUser
  },
    props: ['columns', 'loading', 'dataSource', 'getPagination', 'customRowClick', 'branchList', 'userList'],
  data () {
    return {
      fetching: false,
      userType: {
        'director': 'Директор',
        'consultant': 'Консультант',
        'counteragent': 'Контрагент',
        'cashier': 'Кассир',
        'admin': 'Администратор',
        'manager': 'Менеджер',
        'courier': 'Курьер',
        'client': 'Клиент',
        'postavshik': 'Поставщик',
        ' investor': 'Инвестор'
      },
      statusesList: [{ label: 'Активный', value: 'active' }, { label: 'Не активный', value: 'inactive' }]
    }
  },
  methods: {
    selectBranch (id, data) {
      this.$emit('selectBranch', { id: id, data: data })
    },
    handleTableChangeOfline (pagination) {
      this.$emit('handleTableChange', pagination)
    },
    searchBranch (value) {
      this.$emit('searchBranch', value)
    },
    selectUser (value, data) {
      this.$emit('selectUser', value)
    },
    searchUser (value) {
      this.$emit('searchUser', value)
    },
    handleStatus (val) {
      this.$emit('handelStatus', val)
    },
    seracherNumber (val) {
      this.$emit('number', val)
    }
  }
}
</script>

<style scoped>

</style>
