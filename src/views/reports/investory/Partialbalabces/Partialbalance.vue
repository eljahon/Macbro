<template>
  <a-card>
    <div slot="title">
      <span>{{ $t('partailBalance') }}</span>
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
                <template slot="name" slot-scope="row">
                  <div style="display: flex; align-items: center" >
                    <img v-if="imageUrl" class="model-image" :src="`https://${imageUrl}`" alt="-">
                    <img v-else class="model-image" :src="require(`@/assets/model-image.jpg`)" alt="-">
                    <div style="margin-left: 20px;" >{{ row.name }}</div>
                  </div>
                </template>
                <template slot="order" slot-scope="text">
                  <span v-if="slugCount">{{ slugCount[text] || 0 }}</span>
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
      imageUrl: null,
      slugCount: null,
      columns: [
        {
          title: this.$t('Модель'),
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'name'
          }
        },
        {
          title: this.$t('Количество '),
          dataIndex: 'name',
          key: 'name',
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
    ...mapActions(['getAllListCatigoriya', 'getAllListPraductList', 'getAllListPraductListItemInside', 'getAllListPraductListItemInsideFull', 'partiabalItemList']),
    TabCallback (val) {
      this.praductList(val)
    },
    reduce (item) {
      // const itemcount = item
      // console.log('===>', item.map((element) => element.count).reduce((summ, val) => summ + val))
      return item.map((element) => element.count).reduce((summ, val) => summ + val)
    },
    praductList (id) {
      this.loading = true
      this.getAllListPraductList({ param: true, id: id })
      .then(res => {
        this.insideTabList = res.products.map((element) => {
          return {
            id: element.id,
            name: element.name,
            slug: element.slug
          }
        })
        this.getAllListPraductListItemInsideFull(this.insideTabList[0].id)
        .then(res => {
          // console.log('reaaaa=====>>', res)
          this.imageUrl = res.product.image
          this.TabTwoInsideList = res.items
          const slugList = res.items.map((element) => {
            return {

              group_name: element.name,
              slugs: element.variants.map((element) => element.product_slug)
            }
          })
          this.partiabalItemList(slugList)
          .then(res => {
            console.log('slugList', res)
            const slaughterCount = {}
            res.items.forEach(item => {
              let counter = 0
              item.slug_counts.forEach(el => { counter += el.count })
              slaughterCount[item.group_name] = counter
            })
            this.slugCount = slaughterCount
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
        // console.log('this.TabListCatigoriya =====>>', this.TabListCatigoriya)
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
      this.getAllListPraductListItemInsideFull(val)
        .then(res => {
          this.imageUrl = res.product.image
          this.TabTwoInsideList = res.items
          const slugList = res.items.map((element) => {
            return {
              group_name: element.name,
              slugs: element.variants.map((element) => element.product_slug)
            }
          })
          this.partiabalItemList(slugList)
          .then(res => {
            console.log('slugList', res)
            const slaughterCount = {}
            res.items.forEach(item => {
              let counter = 0
              item.slug_counts.forEach(el => { counter += el.count })
              slaughterCount[item.group_name] = counter
            })
            this.slugCount = slaughterCount
          })
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
