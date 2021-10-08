<template>
  <a-card>
    <div slot="title">
      <span>{{ $t('partailBalance') }}</span>
    </div>
    <div slot="extra">
      <div slot="extra" style="display: flex; gap: 9px">
<!--        <a-input>-->
<!--          <a-icon style="color: blue" slot="addonAfter" type="search" />-->
<!--        </a-input>-->
        <!--        <a-select-->
        <!--          label-in-value-->
        <!--          :default-value="{ key: 'lucy' }"-->
        <!--          style="width: 180px"-->
        <!--        >-->
        <!--          <a-icon slot="suffixIcon" style="color: blue" type="down" />-->
        <!--          <a-select-option value="jack">-->
        <!--            Jack (100)-->
        <!--          </a-select-option>-->
        <!--          <a-select-option value="lucy">-->
        <!--            Lucy (101)-->
        <!--          </a-select-option>-->
        <!--        </a-select>-->
        <a-button style="padding: 2px" type="primary" icon="file-excel" size="small" />
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
                :rowKey="() => Math.random()"
                :dataSource="getPraductList"
                :loading="loading"
                test-attr="list-customer"
                :pagination="false"
                bordered
              >
                <!--                <div slot="Aккаунта" style="padding: 8px; width: 230px;">-->
                <!--                  <a-select-->
                <!--                    :placeholder="$t('Тип аккаунта')"-->
                <!--                    style="width: 220px"-->
                <!--                    @change="AccountTypeSearch"-->
                <!--                    allowClear-->
                <!--                  >-->
                <!--                    <a-select-option v-for="(catigoriya, index) in AccountGrups" :key="index" :value="catigoriya.id">-->
                <!--                      {{ catigoriya.name }}-->
                <!--                    </a-select-option>-->
                <!--                  </a-select>-->
                <!--                </div>-->
                <!--                <div-->
                <!--                  slot="аккаунта"-->
                <!--                  style="padding: 8px"-->
                <!--                >-->
                <!--                  <a-input-number-->
                <!--                    :placeholder="`ИД. аккаунта`"-->
                <!--                    v-debounce="AccountSearch"-->
                <!--                    style="width: 188px; margin-bottom: 8px; display: block;"-->
                <!--                  />-->
                <!--                </div>-->
                <!--                <a-icon-->
                <!--                  style="font-size: 20px; color: transparent; background-color: transparent"-->
                <!--                  slot="filterIcon"-->
                <!--                  class="filter-dropdown-icon"-->
                <!--                  :component="$myIcons.filterDownIcon"-->
                <!--                />-->
                <template slot="data" slot-scope="text, row">
                  <!--                  <img style="width: 50px; height: 50px; border-radius: 50%" :src="row.image" alt="imgId">-->
                  <span style="margin-left: 5px">{{ row.name }}</span>
                </template>
                <template slot="order" slot-scope="text, row, index">
                  <span v-if="slugCount.length">{{ reduce(slugCount[index]) }}</span>
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

export default {
  data () {
    return {
      loading: false,
TabListCatigoriya: [],
      insideTabList: [],
      TabTwoInsideList: [],
      slugCount: [],
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
          this.TabTwoInsideList = res.items.map((element) => {
            return {
              name: element.name
            }
          })
          const slugList = res.items.map((element) => {
            return {

                  group_name: element.name,
              slugs: element.variants.map((element) => element.product_slug)
            }
          })
          this.partiabalItemList(slugList)
          .then(res => {
            // console.log('slugList', res)
          const slaughterCount = res.items.map((element, index) => {
                           return element.slug_counts.map((element) => element)
})
            this.slugCount = slaughterCount
            // console.log(slaughterCount)
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
          this.TabTwoInsideList = [res.product]
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

</style>
