<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/shops/list" test-attr="prev-link-shops">{{ $t('shops') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <div v-if="edit">
      <a-card :title="$t('fillIn')">
        <a-row>
          <a-tabs type="card" v-model="activeTabKey">
            <a-tab-pane v-for="(lang, idx) in langs" :key="idx + 1">
              <span slot="tab">
                <flag :iso="flagMapper(lang)" />
                {{ langMapper(lang) }}
              </span>
              <v-main @clickParent="clickParent" :ref="`${lang}EditForm`" :lang="lang"></v-main>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-card>
    </div>
    <div v-else>
      <a-card :title="$t('fillIn')">
        <a-row>
          <v-main @clickParent="clickParent" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="btnLoading" type="primary" html-type="submit" @click.prevent="submit" test-attr="save-shops">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm" test-attr="reset-shops">
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
export default {
  data () {
    return {
      btnLoading: false,
      activeTabKey: 1,
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
        console.log('edit reset', this.$refs)
        Object.entries(this.$refs).forEach(form => {
          console.log(form)
          if (form) form[1][0].resetForm()
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
