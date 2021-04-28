<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/customers/list" test-attr="prev-link-customer">{{ $t('customers') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('update')" class="breadcrumb-row" :bordered="false">
    </a-card>

    <a-card :bordered="false">
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
                        <a-col :lg="16" :md="24">
                            <a-table
                                :columns="generalCol"
                                :dataSource="geberalInfo"
                                test-attr="history-list-customer"
                            />
                        </a-col>
                        <a-col :lg="8" :md="24">
                            <a-table
                                :columns="generalCol2"
                                :dataSource="geberalInfo"
                                test-attr="history-list-customer"
                            />
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <a-tab-pane key="2" :tab="$t('Типы оплаты')">
                    <a-table
                        :columns="paymentCol"
                        :dataSource="paymentTypes"
                        test-attr="history-list-customer"
                    >
                        <img slot="type" width="48" height="32" src="https://webmoney.uz/img/logo/logo_uzcard.png" alt="uzcard">
                        <span slot="money" slot-scope="text">
                            {{ text }}
                        </span>
                    </a-table>
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
                dataIndex: 'text'
            },
            {
                dataIndex: 'money',
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
