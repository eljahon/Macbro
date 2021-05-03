<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
          <a-breadcrumb-item>
            <router-link to="/country/list" test-attr="prev-link-city">{{ $t('countries') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
    </breadcrumb-row>

    <a-card :bordered="false" v-if="edit" class="no-space-tab" style="flex: 1">
      <a-tabs :activeKey="currentTab" @change="onTabChange">
        <a-tab-pane :tab="$t('information')" :key="1">
          <v-main @clickParent="clickParent" :ref="`EditForm`"></v-main>
        </a-tab-pane>
        <a-tab-pane :tab="$t('regions')" :key="2">
          <regions></regions>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <v-main @clickParent="clickParent" ref="createForm" v-else style="flex: 1"></v-main>
    <a-row class="edit-btns" v-if="currentTab === 1">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="btnLoading" type="primary" html-type="submit" @click.prevent="submit" test-attr="save-city">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm" test-attr="reset-city">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import vMain from './v-main'
import { langMapper, flagMapper } from '@/utils/mappers'
import Regions from './region/regionList'
export default {
  data () {
    return {
      btnLoading: false,
      activeTabKey: 1,
      currentTab: 1,
      edit: !!this.$route.params.id,
      langs: ['ru', 'uz', 'en']
    }
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
    onTabChange (value) {
      this.currentTab = value
    },
    clickParent (e) {
      this.btnLoading = e
    },
    submit () {
      console.log('submit')
      if (this.edit) {
        Object.values(this.$refs).forEach(form => {
          console.log('form', form)
          if (form) form.onSubmit()
          // if (form) form.onSubmit()
        })
      } else {
        this.$refs.createForm.onSubmit()
      }
    },
    resetForm () {
      if (this.edit) {
        // console.log('Refs', this.$refs)
        Object.entries(this.$refs).forEach(form => {
          // console.log(form)
          if (form) form[1].resetForm()
        })
      } else {
        this.$refs.createForm.resetForm()
      }
    }
  },
  components: { 'v-main': vMain, Regions }
}
</script>
<style></style>
