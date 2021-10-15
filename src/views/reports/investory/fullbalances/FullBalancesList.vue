<template>
  <a-card>
    <div slot="title">
      <span>{{ $t('fullbalance') }}</span>
    </div>
    <div slot="extra">
      <div slot="extra" style="display: flex; gap: 9px">
        <a-button size="small" icon="dowlond" style="background-color: #1890FF; color: white; border: none">
          <a-icon :component="myIcons.excal"></a-icon></a-button>
      </div>
    </div>
    <a-card>
      <a-tabs type="card" @change="(key) => TabCallback(key)">
        <a-tab-pane v-for="item in TabListCatigoriya" :key="item.id" :tab="item.name" @click="(val)=> OnClickTab(val, item.id, item.name, item.slug)">
          <a-tabs type="card" @change="(key) => InsideTabClick(key)">
            <a-tab-pane v-for="item in insideTabList" :key="item.id" @click="(id) => ItemClickTAb(id)" :tab="item.name">
              <a-table
                style="margin-top: 30px"
                :columns="columns"
                :rowKey="(row) => row.id"
                :dataSource="getPraductList"
                :loading="loading"
                test-attr="list-customer"
                :pagination="false"
                bordered
              >
                <template slot="data" slot-scope="row">
                  <div style="display: flex; align-items: center" >
                    <img v-if="row.image" class="model-image" :src="`${row.image}`" alt="-">
                    <img v-else class="model-image" :src="require(`@/assets/model-image.jpg`)" alt="-">
                    <div style="margin-left: 20px;" >{{ row.name }}</div>
                  </div>
                </template>
                <template slot="order" slot-scope="text, row, index">
                  <span>{{ slugIdList[index] }}</span>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import myIcons from '@/core/icons'
export default {
  data () {
    return {
      myIcons,
      loading: false,
      TabListCatigoriya: [],
      insideTabList: [],
      TabTwoInsideList: [],
      slugIdList: [],
      columns: [
        {
          title: this.$t('Модель'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'data'
          }
        },
        {
          title: this.$t('Количество '),
          scopedSlots: { customRender: 'order' }
        }
      ]
    }
  },
  computed: {
    getPraductList () {
      return this.TabTwoInsideList
    }
  },
  methods: {
    ...mapActions(['getAllListCatigoriya', 'getAllListPraductList', 'getAllListPraductListItemInside', 'slugId']),
    TabCallback (val) {
      this.praductList(val)
    },
    praductList (id) {
      this.loading = true
      this.getAllListPraductList({ param: false, id: id })
        .then(res => {
          this.insideTabList = res.products.map((element) => {
            return {
              id: element.id,
              name: element.name,
              slug: element.slug
            }
          })
          this.getAllListPraductListItemInside(this.insideTabList[0].id)
            .then(res => {
              // eslint-disable-next-line no-unused-vars
              let slugList = []
              slugList = res.product.variants.flatMap((element) => element.value.slug)
              this.TabTwoInsideList = res.product.variants.map(variant => variant.value)
              this.slugId(slugList)
              .then(res => {
                console.log('slugList =>', res)
                this.slugIdList = res.product_count.map((element) => element.count)
              })
            }).finally(() => {
            this.loading = false
          })
        })
    },
    catigiriyaList () {
      this.$store.dispatch('getAllListCatigoriya')
        .then(res => {
          this.TabListCatigoriya = res.categories.flatMap((element) => {
            return element.children
          })
          console.log('this.TabListCatigoriya =====>>', this.TabListCatigoriya)
          this.praductList(this.TabListCatigoriya[0].id)
        })
    },
    rangepicker (val, data) {
      console.log(data)
    },
    OnClickTab (val, id, name, slug) {
      console.log(val, id, name, slug)
    },
    ItemClickTAb (val) {
      console.log(val)
    },
    InsideTabClick (val) {
      this.loading = true
      this.getAllListPraductListItemInside(val)
        .then(res => {
          this.TabTwoInsideList = res.product.variants.map(variant => variant.value)
          // console.log('=======', res.product)
        }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.catigiriyaList()
  }
}
</script>

<style scoped>
  .model-image {
    width: 50px;
    height: 50px;
    object-fit: scale-down;
  }
</style>
