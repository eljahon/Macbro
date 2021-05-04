<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/country/list" test-attr="prev-link-city">{{ $t('countries') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <a @click="$router.go(-1)" test-attr="prev-link-city">{{ $t('regions') }}</a>
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
        @confirm="deleteCity"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm>
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <v-main @clickParent="clickParent" v-if="edit" :ref="`EditForm`" style="flex: 1"></v-main>
      <v-main @clickParent="clickParent" ref="createForm" v-else style="flex: 1"></v-main>
    </a-card>
    <a-row class="edit-btns">
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
import { mapActions, mapGetters } from 'vuex'
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
  // mounted() {
  //   console.log('$refs', this.$refs)
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
  beforeDestroy () {
    this.setLastTab(1)
  },
  methods: {
    ...mapActions(['setLastTab']),
    deleteCity (e) {
      this.loading = true
      request({
        url: `/city/${this.$route.params.id}`,
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
  components: { 'v-main': vMain }
}
</script>
<style></style>
