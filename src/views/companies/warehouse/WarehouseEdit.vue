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

    <a-card :bordered="false" v-if="edit" class="no-space-tab"  style="flex: 1">
      <!-- <a-tabs v-model="activeTabKey">
        <a-tab-pane :key="1" :tab="$t('information')"> -->
          <v-main @clickParent="clickParent" :ref="`EditForm`"></v-main>
        <!-- </a-tab-pane>

        <a-tab-pane :key="2" :tab="$t('prixod')">
          <inventory-item />
        </a-tab-pane>
      </a-tabs> -->
    </a-card>
    <v-main v-else @clickParent="clickParent" ref="createForm"></v-main>
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
