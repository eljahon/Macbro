<template>
  <div>
    <breadcrumb-row >
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/roles/list" test-attr="prev-link-roles">{{ $t('roles') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card :title="$t(edit ? 'update' : 'fillIn')" :bordered="false">
      <!-- <a-popconfirm
        v-if="edit"
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @click.native.stop=""
        @confirm="deleteRole"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm> -->
    </a-card>
    <div v-if="edit" style="flex: 1; display: flex">
      <a-card style="flex: 1" :bordered="false">
        <!-- <a-row>
          <a-tabs type="card" v-model="activeTabKey">
            <a-tab-pane v-for="(lang, idx) in langs" :key="idx + 1">
              <span slot="tab">
                <flag :iso="flagMapper(lang)" />
                {{ langMapper(lang) }}
              </span>
              <v-main @clickParent="clickParent" :ref="`${lang}EditForm`" :lang="lang"></v-main>
            </a-tab-pane>
          </a-tabs>
        </a-row> -->
        <v-main @clickParent="clickParent" :ref="`EditForm`"></v-main>
      </a-card>
    </div>
    <div v-else style="flex: 1; display: flex">
      <a-card style="flex: 1" :bordered="false">
        <a-row>
          <v-main @clickParent="clickParent" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="btnLoading" type="primary" html-type="submit" @click.prevent="submit" test-attr="save-roles">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm" test-attr="reset-roles">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import vMain from './v-main'
import request from '@/utils/request'
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
    // console.log('ROUTES', this.$route)
  },
  // updated() {
  //   console.warn('$refs', this.$refs)
  // },
  methods: {
    langMapper,
    flagMapper,
    deleteRole (e) {
      this.loading = true
      request({
        url: `/role/${this.$route.params.id}`,
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
        Object.entries(this.$refs).forEach(form => {
          console.log(form)
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
