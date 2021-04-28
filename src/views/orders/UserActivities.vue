<template>
  <a-table
    :columns="columns"
    :dataSource="getAllUserActivities"
    :pagination="getUserActivitiesPagination"
    :loading="loading"
    @change="handleTableChange"
    align="center"
    test-attr="user-activities-order"
  >
    <template slot="action" slot-scope="text, record">
      <div class="activity-container">
        <span v-html="sortUserActivities(record)"></span>
        <a-tag class="time" color="blue">{{ convertISOToLocaleTime(record.time) }}</a-tag>
      </div>
    </template>
  </a-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    data () {
        return {
            orderNumber: this.$route.params.id,
            loading: false,
            columns: [
                {
                    title: this.$t('activities'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            paymentMethods: {
                cash: 'Наличные',
                card: 'Терминал',
                click: 'Click',
                payme: 'Payme',
                unired: 'Unired'
            },
            orderStatus: {
                'in-process': 'В обработке',
                'finished': 'Завершено',
                'cancelled': 'Отменен',
                'order_accepted': 'Заказ принят'
            }
        }
    },
    methods: {
        ...mapActions(['getUserActivities']),
        handleTableChange (pagination) {
            this.loading = true
            this.getUserActivities({ page: pagination, orderNumber: this.orderNumber })
                .then((res) => console.log(res))
                .catch(err => {
                    console.error(err)
                    this.$message.error(this.$t('error'))
                })
                .finally(() => (this.loading = false))
        },
        sortUserActivities (activity) {
            const { action, user: { name, last_name: lastName }, from_value: fromValue, to_value: toValue } = activity
            switch (action) {
                case 'change-status':
                    return `Пользователь ${name.bold()} ${lastName.bold()} изменил статус с ${this.textChanger(fromValue, action)} на ${this.textChanger(toValue, action)}`
                case 'change-payment-method':
                    return `Пользователь ${name.bold()} ${lastName.bold()} изменил способ оплаты с ${this.textChanger(fromValue, action)} на ${this.textChanger(toValue, action)}`
                case 'change-address':
                    return `Пользователь ${name.bold()} ${lastName.bold()} изменил адрес с ${fromValue.bold()} на ${toValue.bold()}`
                case 'change-customer-name':
                    return `Пользователь ${name.bold()} ${lastName.bold()} изменил имя клиента с ${fromValue.bold()} на ${toValue.bold()}`
                case 'change-note':
                    return `Пользователь ${name.bold()} ${lastName.bold()} изменил комментарий на ${toValue.bold()}`
                default:
                    return activity
            }
        },
        convertISOToLocaleTime (time) {
            return (new Date(time)).toLocaleString('uz-UZ')
        },
        textChanger (text, action) {
            switch (action) {
                case 'change-payment-method':
                    return this.paymentMethods[text].bold()
                case 'change-status':
                    return this.orderStatus[text].bold()
                default:
                    return text
            }
        }
    },
    computed: {
        ...mapGetters(['userActivities', 'userActivitiesPagination']),
        getAllUserActivities () {
            return this.userActivities
        },
        getUserActivitiesPagination () {
            return this.userActivitiesPagination
        }
    },
    mounted () {
        console.log('this.userActivities', this.userActivities)
        this.loading = true
        this.getUserActivities({ page: null, orderNumber: this.orderNumber })
            .then((res) => console.log('res', res))
            .catch(err => console.error(err))
            .finally(() => (this.loading = false))
    }
}
</script>
<style scoped>
.activity-container {
    display: flex;
    justify-content: space-between;
}
</style>
