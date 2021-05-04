<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/company/list" test-attr="prev-link-company">{{ $t('companies') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <a @click="$router.go(-1)" test-attr="branches-warehouse">{{ $t('warehouse') }}</a>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :bordered="false" :title="edit ? $t('information') : $t('fillIn')">
      <a-popconfirm
        v-if="edit"
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @click.native.stop=""
        @confirm="deleteWarehouse"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm>
    </a-card>
    <v-main @clickParent="clickParent" style="flex: 1" v-if="edit" :ref="`EditForm`"></v-main>
    <!-- <a-card :bordered="false" class="no-space-tab" >
      <a-tabs v-model="activeTabKey">
        <a-tab-pane :key="1" :tab="$t('information')">
        </a-tab-pane>

        <a-tab-pane :key="2" :tab="$t('prixod')">
          <inventory-item />
        </a-tab-pane>
      </a-tabs>
    </a-card> -->
    <v-main v-else @clickParent="clickParent" style="flex: 1" ref="createForm"></v-main>
    <a-row class="edit-btns" v-if="activeTabKey === 1">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button
            :loading="btnLoading"
            type="primary"
            html-type="submit"
            @click.prevent="submit"
            test-attr="save-branch"
          >
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm" test-attr="reset-branch">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import vMain from './v-main'
import InventoryItem from './inventoryitem/InventoryItemList'
import { langMapper, flagMapper } from '@/utils/mappers'
import request from '@/utils/request'

export default {
  data () {
    return {
      btnLoading: false,
      activeTabKey: 1,
      edit: !!this.$route.params.id,
      langs: ['ru', 'uz', 'en']
    }
  },
  mounted () {
    // console.log('$refs', this.$refs)
    console.log('ROUTES', this.$route)
  },
  // updated() {
  //   console.warn('$refs', this.$refs)
  // },
  methods: {
    langMapper,
    flagMapper,
    deleteWarehouse (e) {
      this.loading = true
      request({
        url: `/warehouse/${this.$route.params.id}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.$router.go(-1)
        // this.getCompanyWarehouse({ page: this.companyWarehousePagination, company_id: this.$route.params.id })
      })
      .catch(err => {
        this.$message.error(err)
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    clickParent (e) {
      this.btnLoading = e
    },
    submit () {
      console.log('submit')
      if (this.edit) {
        Object.values(this.$refs).forEach(form => {
          console.log('form', form)
          // if (form) form[0].onSubmit()
          if (form) form.onSubmit()
        })
      } else {
        this.$refs.createForm.onSubmit()
      }
    },
    resetForm () {
      if (this.edit) {
        Object.entries(this.$refs).forEach(form => {
          console.log(form)
          if (form) form[1].resetForm()
        })
      } else {
        this.$refs.createForm.resetForm()
      }
    }
  },
  components: { 'v-main': vMain, InventoryItem }
}
</script>
<style></style>
