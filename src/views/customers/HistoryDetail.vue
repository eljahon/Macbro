<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('back') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('История заказов')" class="breadcrumb-row" :bordered="false">
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-form-model
        @submit="onSubmit"
        ref="ruleForm"
        :model="customer"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-tabs type="card" v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('Общие сведение')">
            <a-row>
              <a-col :lg="16" :md="24" style="padding-right: 20px">
                <a-table
                  :columns="generalCol"
                  :dataSource="geberalInfo"
                  test-attr="history-list-customer"
                  bordered
                />
              </a-col>
              <a-col :lg="8" :md="24">
                <a-table
                  :columns="generalCol2"
                  :dataSource="geberalInfo"
                  test-attr="history-list-customer"
                  bordered
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('Типы оплаты')">
            <a-col span="12">
              <a-table
                :showHeader="false"
                :columns="paymentCol"
                :dataSource="paymentTypes"
                :pagination="false"
                test-attr="history-list-customer"
              >
                <div slot="type" slot-scope="text, row">
                  <img width="48" height="32" style="margin-right: 20px" src="https://webmoney.uz/img/logo/logo_uzcard.png" alt="uzcard">
                  <span>{{ row.text }}</span>
                </div>
                <span slot="money" slot-scope="text">
                  {{ $moneyFormat(text) }}
                </span>
              </a-table>
            </a-col>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
        activeTabKey: '1',
        geberalInfo: [],
        paymentTypes: [
            {
                text: 'Узкард',
                amount: 20000
            }
        ],
        generalCol: [
            {
                title: 'Товар'
            },
            {
                title: 'Количество'
            },
            {
                title: 'Цена'
            },
            {
                title: 'Общая сумма'
            }
        ],
        generalCol2: [
            {
                title: 'Общие сведение'
            },
            {
                title: ''
            }
        ],
        paymentCol: [
            {
                key: 'type',
                scopedSlots: {
                    customRender: 'type'
                }
            },
            {
                dataIndex: 'amount',
                scopedSlots: {
                    customRender: 'money'
                }
            }
        ]
    }
  }
}
</script>
<style>
</style>
