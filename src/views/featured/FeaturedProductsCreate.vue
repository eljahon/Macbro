<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/catalog/featured-products/list">{{ $t('featuredProducts') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card :title="edit ? $t('update') : $t('fillIn')" :bordered="false">
      <a-popconfirm
        v-if="edit"
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @click.native.stop=""
        @confirm="deleteFeaturedProduct"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm>
    </a-card>
    <div v-if="edit" style="flex: 1; display: flex">
      <a-card :bordered="false" style="flex: 1;">
        <a-row>
          <a-tabs type="card" v-model="activeTabKey">
            <a-tab-pane v-for="(lang, idx) in langs" :key="idx + 1">
              <span slot="tab">
                <flag :iso="flagMapper(lang)" style="margin-right: 5px"/>
                {{ langMapper(lang) }}
              </span>
              <v-main @clickParent="clickParent" :ref="`${lang}EditForm`" :lang="lang"></v-main>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-card>
    </div>
    <div v-else style="flex: 1; display: flex">
      <a-card :bordered="false" style="flex: 1;">
        <a-row>
          <v-main @clickParent="clickParent" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="btnLoading" type="primary" html-type="submit" @click.prevent="submit">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm">
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
//   mounted () {
//     console.log('$refs', this.$refs)
//   },
//   updated () {
//     console.warn('$refs', this.$refs)
//   },
  methods: {
    langMapper,
    flagMapper,
    deleteFeaturedProduct (e) {
      this.loading = true
      request({
        url: `/featured-list/${this.$route.params.id}`,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.$router.go(-1)
        })
        .catch(err => {
          console.error(err)
          this.$message.error(this.$t('error'))
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
          if (form) form[0].onSubmit()
        })
      } else {
        this.$refs.createForm.onSubmit()
      }
    },
    resetForm () {
      if (this.edit) {
        Object.entries(this.$refs).forEach(form => {
          if (form) form.resetForm()
        })
      } else {
        this.$refs.createForm.resetForm()
      }
    }
  },
  components: { 'v-main': vMain }
}
</script>
<style></style>
