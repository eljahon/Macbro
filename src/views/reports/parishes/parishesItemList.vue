<template>
  <a-card>
    <div slot="title">
      <a-page-header
        @back="() => $router.go(-1)">
        <div slot="subTitle" style="cursor: pointer">
          <span @click="() => $router.push({ name: 'SaleListMain'})">Отчеты /  </span>
          <span @click="() => $router.push({ name: 'parishesListMain'})">Список приходов</span>
          <span></span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra">
      <a-button size="small" icon="dowlond" style="background-color: #1890FF; color: white; border:none">
        <a-icon :component="myIcons.excal"></a-icon></a-button>
    </div>
    <a-card style="border-left: none; border-right: none; border-bottom: none">
      <div slot="title"> <span>ИД партии: 1234-24-03-2021</span></div>
    </a-card>
    <a-card style="margin-top: 20px; border-left: none; border-right: none; border-bottom: none">
      <div style="display: flex; justify-content: space-between;">
        <div
          style="
          display: flex;
          background-color: #F5F5F5;
          flex: 0 0 20%;
          border-radius: 9px;
          align-items: center;
           padding: 5px;
"><div style="display: flex;  align-items: center;  margin-left: 10px; gap: 5px">
           <img :src="img" alt="">
             <span>Darlene Robertson <br> <span style="color: #818C99; font-size: 16px">Кассир</span></span>
           </div>
        </div>
        <div style="display: flex;  flex: 0 0 30%;">
          <div
            style="
          display: flex;
          background-color: #F5F5F5;
          border-bottom-left-radius: 9px;
          border-top-left-radius: 9px;
          align-items: center;
"><div style="display: flex;  align-items: center;  margin-left: 10px; gap: 5px">
           <img :src="img" alt="">
           <span>Darlene Robertson <br> <span style="color: #818C99; font-size: 16px">Кассир</span></span>
         </div>
          </div>
          <div
            style="
          display: flex;
          background-color: rgba(255, 239, 235, 1);
          border-bottom-right-radius: 9px;
          border-top-right-radius: 9px;
          align-items: center;
"><div style="display: flex;  align-items: center;  margin-left: 10px; gap: 5px">
           <span style="color: red">-$ 2 730 <br> <span style="color: #818C99; font-size: 16px; padding-right: 10px">30/200 Сканировано</span></span>
         </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card style=" border-bottom: none; border-left: none; border-right: none">
      <a-tabs type="card" @change="callbak">
        <a-tab-pane key="1" tab="Основные сведения">
          <a-table
            style="margin-top: 30px; cursor: pointer"
            :columns="columnsparisherItem"
            :rowKey="() => Math.random()"
            :dataSource="getParishesList"
            :pagination="getPagination"
            :loading="loading"
            @change="handleTableChange"
            test-attr="list-customer"
            bordered
          >
            <div slot="Aккаунта" style="padding: 8px; width: 230px;">
              <a-select
                :placeholder="$t('Тип аккаунта')"
                style="width: 220px"
                allowClear
              >
              </a-select>
            </div>
            <div
              slot="аккаунта"
              style="padding: 8px"
            >
              <a-input-number
                :placeholder="`ИД. аккаунта`"
              />
            </div>
            <a-icon
              style="font-size: 20px; color: transparent; background-color: transparent"
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="myIcons.filterDownIcon"
            />
            <template slot="Статус" slot-scope="text, row">
              <a-tag :color="row.items_count === row.scanned_count ? 'blue' : 'red'">{{ row.items_count === row.scanned_count ? 'Сканировано' : `${'Не сканировано'}${row.items_count}/${row.scanned_count}` }}</a-tag>

              <!--                    <span>{{ row.merchant.firstname === '' ? '' : row.merchant.firstname}} {{ row.merchant.last_name === '' ? '' : row.merchant.last_name }}</span>-->
            </template>
            <template slot="seller" slot-scope="text, row">
              <span>{{ row.seller.first_name }}{{ ' ' }}{{ row.seller.last_name }}</span>
            </template>
            <template slot="buyers" slot-scope="text, row">
              <span>{{ row.buyer.first_name }}{{ ' ' }}{{ row.buyer.last_name }}</span>
            </template>
            <template slot="Кол" slot-scope="text, row">
              <span>{{ row.items_count }}</span>
            </template>
            <template slot="Сумма" slot-scope="text, row">
              <span>{{ '$' }}{{ row.total_amount }}</span>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="IMEI">
          <a-table
            style="margin-top: 30px"
            :columns="columns"
            :rowKey="() => Math.random()"
            :dataSource="getWritingList"
            :loading="loading"
            test-attr="list-customer"
            :pagination="false"
            bordered >
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Оплата">
          <div style="display: flex; margin-top: 10px; gap: 15px">
            <div style="flex: 0 0 30%; border: 1px solid #EEEEEE; border-radius: 5px; padding: 15px; display: flex; justify-content: space-between ">
              <div>
                <p><a-icon type="shop" style="color: #00A0E9"></a-icon> <span>Филиал</span></p>
                <p><a-icon type="calendar" style="color: #00A0E9"></a-icon> <span>Дата</span></p>
                <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>Итого</span></p>
              </div>
              <div>
<!--                <p><b>{{ list.branch.name }}</b></p>-->
<!--                <p><b>{{ moment(list.billing.created_at).format('YYYY-MM-DD') }}</b></p>-->
<!--                <p><b> {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }}</b></p>-->

              </div>
            </div>
            <div style="flex: 0 0 30%; border: 1px solid #EEEEEE; border-radius: 5px; padding: 15px; display: flex; justify-content: space-between ">
              <div>
                <!--          <p><a-icon type="shop" style="color: #00A0E9"></a-icon> <span>Филиал</span></p>-->
                <!--          <p><a-icon type="calendar" style="color: #00A0E9"></a-icon> <span>Дата</span></p>-->
                <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>Оплачено</span></p>
                <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>сумма</span></p>
              </div>
              <div>
                <!--          <p><b>Макбро Малика</b></p>-->
                <!--          <p><b>10.03.2021, 17:30</b></p>-->
<!--                <p><b>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.paid_amount.usd) }}</b></p>-->
<!--                <p><b>{{ new Intl.NumberFormat().format(list.billing.paid_amount.uzs) }} {{ "so'm" }}</b></p>-->

              </div>
            </div>

          </div>
          <a-table
            style="margin-top: 30px"
            :columns="columns"
            :rowKey="() => Math.random()"
            :dataSource="getWritingList"
            :loading="loading"
            test-attr="list-customer"
            :pagination="false"
            bordered >
</a-table>
<!--            <template slot="tavar" slot-scope="text, row">-->
<!--              <span style="width: 50px; height: 50px; display: inline-flex; border-radius: 50%">-->
<!--                <img style="object-fit: cover" :src="row.product_image" alt="imgId">-->
<!--              </span>-->
<!--              <span style="margin-left:5px; position: relative; top: -20px">{{ row.product_name }}</span>-->
<!--            </template>-->
<!--            <template slot="kol" slot-scope="text, row">-->
<!--              <span>{{ row.count }}</span>-->
<!--            </template>-->
<!--            <template slot="sena" slot-scope="text, row">-->
<!--              <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.price.usd_price) }}</span>-->
<!--            </template>-->
          <div style="margin-top: 20px"><span style="font-size: 20px; color: black">Фото по тип оплаты</span></div>
          <a-card style="margin-top: 20px">
          </a-card>
          <div style="margin-top: 20px"><span style="font-size: 20px; color: black">Комментарии</span></div>
          <br>
          <a-card style="border-bottom: none; border-left: none; border-right: none">
            <div style="background-color: #F7F7FB; padding: 10px; border-radius: 8px"><p>At enim feugiat at dolor dictum
              Eu amet nec lorem eget eget ut malesuada facilisi
              Cras lorem est ultricies vitae facilisi dis in nisl turpis
              Mattis amet quam id id turpis quam scelerisque. Nulla sapien aenean natoque
              massa, odio dolor, est imperdiet. Nisi, suscipit ipsum semper sagittis.
              Vulputate dignissim vitae eget quam sagittis.</p></div>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
import myIcons from '@/core/icons'
import img from '../../../assets/Ellipse 9.png'
export default {
  data () {
    return {
      myIcons,
      img,
      loading: false,
      params: {
        page: { current: 1, pageSize: 10, total: null }
      },
      columnsparisherItem: [
        {
          title: 'Товары',
          dataIndex: 'name',
          key: 'name',
          width: 200,
          align: 'center'
        },
    {
      title: 'Наличные',
        children: [
      {
        title: 'Кол-во',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: 'Цена'
      }
    ]
    },
    {
      title: 'Реализация',
        children: [
      {
        title: 'Кол-во',
        dataIndex: 'asdasddsad',
        key: 'dadfsfgfdfgdg'
      },
      {
        title: 'Цена',
        dataIndex: 'companyName',
        key: 'companyName'
      }
    ]
    },
        {
          title: 'Консегнация',
          children: [
            {
              title: 'Кол-во',
              dataIndex: 'asdadsd',
              key: 'companyAddress'
            },
            {
              title: 'Цена',
              dataIndex: 'companyAddress',
              key: 'dssdfdfsfs'
            },
            {
              title: 'Дата ',
              dataIndex: 'companyName',
              key: 'dfgdfdsfg'
            }
          ]
        },
    {
      title: 'Состояние',
        dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: 200,
      fixed: 'right'
    },
        {
          title: 'IMEI',
          dataIndex: 'gender',
          key: 'sfdfsf',
          width: 120,
          fixed: 'right'
        }
  ],
      columns: [
        {
          title: this.$t('Дата'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'tavar'
          }
        },
        {
          title: this.$t('Кассир '),
          scopedSlots: { customRender: 'kol' }
        },
        {
          title: this.$t('Тип оплаты '),
          scopedSlots: { customRender: 'sena' }
        },
        {
          title: this.$t('Сумма '),
          scopedSlots: { customRender: 'sena' }
        }
      ]
    }
  },
  computed: {
    getParishesList () {
      return []
    },
    getPagination () {
      return {}
    },
    getWritingList () {
      return []
    },
    getwrititngPaginotin () {
      return {}
    }
  },
  methods: {
    callbak (key) {
      console.log(key)
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
