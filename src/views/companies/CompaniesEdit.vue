<template>
  <div>

    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px">
        <a-breadcrumb-item>
          <router-link to="/company/list" test-attr="prev-link-company">{{ $t('companies') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :bordered="false" v-if="edit" class="no-space-tab" >
      <a-tabs v-model="activeTabKey" default-active-key="1">
        <a-tab-pane :tab="$t('information')" :key="1">
          <v-main @clickParent="clickParent" :ref="`EditForm`"></v-main>
        </a-tab-pane>
        <a-tab-pane :tab="$t('staff')" :key="2">
          <company-staff></company-staff>
        </a-tab-pane>
        <a-tab-pane :tab="$t('inventory')" :key="3">
          <company-inventory></company-inventory>
        </a-tab-pane>
        <a-tab-pane :tab="$t('branches')" :key="4">
          <branches></branches>
        </a-tab-pane>
      </a-tabs>
      <!-- <v-main @clickParent="clickParent" :ref="`EditForm`"></v-main> -->
    </a-card>
    <v-main @clickParent="clickParent" ref="createForm" v-else></v-main>
    <a-row v-if="activeTabKey === 1" class="edit-btns">
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
import companyInventory from './CompanyInventory'
import branches from './branches/BranchesList'
import { langMapper, flagMapper } from '@/utils/mappers'
export default {
  data () {
    return {
      btnLoading: false,
      activeTabKey: 1,
      edit: !!this.$route.params.id,
      langs: ['ru', 'uz', 'en']
    }
  },
  components: {
    'v-main': vMain,
    companyStaff,
    companyInventory,
    branches
  },
  // mounted() {
  //   console.log('$refs', this.$refs)
  // },
  // updated() {
  //   console.warn('$refs', this.$refs)
  // },
  methods: {
    langMapper,
    flagMapper,
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
