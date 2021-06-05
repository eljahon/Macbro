<template>
  <div>

    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/company/list" test-attr="prev-link-company">{{ $t('companies') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card :title="edit ? $t('information') : $t('fillIn')" :bordered="false">
      <a-popconfirm
        v-if="edit"
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @click.native.stop=""
        @confirm="deleteCompany"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <!--        <a-button type="danger" html-type="submit" test-attr="save-customer">-->
        <!--          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}-->
        <!--        </a-button>-->
      </a-popconfirm>
    </a-card>

    <a-card :bordered="false" v-if="edit" style="flex: 1">
      <a-tabs type="card" :activeKey="currentTab" @change="onTabChange">
        <a-tab-pane :tab="$t('information')" :key="1">
          <v-main @clickParent="clickParent" :ref="`EditForm`"></v-main>
        </a-tab-pane>
        <a-tab-pane :tab="$t('staff')" :key="2">
          <company-staff></company-staff>
        </a-tab-pane>
        <a-tab-pane :tab="$t('warehouse')" :key="3">
          <warehouse></warehouse>
        </a-tab-pane>
        <a-tab-pane :tab="$t('legalAgents')" :key="4">
          <corporates></corporates>
        </a-tab-pane>
          <a-tab-pane :tab="$t('branches')" :key="5">
          <branches></branches>
        </a-tab-pane>
      </a-tabs>
      <!-- <v-main @clickParent="clickParent" :ref="`EditForm`"></v-main> -->
    </a-card>
    <a-card :bordered="false" v-else style="flex: 1">
      <v-main @clickParent="clickParent" ref="createForm" style="flex: 1"></v-main>
    </a-card>
    <a-row v-if="currentTab === 1" class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="btnLoading" type="primary" html-type="submit" @click.prevent="submit" test-attr="save-company">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm" test-attr="reset-company">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import vMain from './v-main'
import companyStaff from './CompanyStaff'
import branches from './branches/BranchesList'
import corporates from './corporate/CorporateList'
import warehouse from './warehouse/WarehouseList'
import { langMapper, flagMapper } from '@/utils/mappers'
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  data () {
    return {
      data: null,
      btnLoading: false,
      activeTabKey: 1,
      edit: !!this.$route.params.id,
      langs: ['ru', 'uz', 'en'],
      params: {
        page: {
          pageSize: 10,
          current: 1,
          total: null
        },
        search: '',
        company_id: this.$route.params.id,
        user_type: '',
        user: '',
        offset: 0
      }
    }
  },
  components: {
    'v-main': vMain,
    companyStaff,
    warehouse,
    branches,
    corporates
  },
  // mounted () {
  // },
  // updated() {
  //   console.warn('$refs', this.$refs)
  // },
  computed: {
    ...mapGetters(['lastTab']),
    currentTab () {
      return this.lastTab
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions(['setLastTab', 'getUsers']),
    deleteCompany (e) {
      this.loading = true
      request({
        url: `/company/${this.$route.params.id}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.$router.go(-1)
      })
      .catch(err => {
        this.$message.error(err)
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    langMapper,
    flagMapper,
    onTabChange (value) {
      console.log(value)
    if (value === '2') {
      this.getUsers(this.params).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
      })
    }
      this.setLastTab(value)
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
  }
}
</script>
<style></style>
