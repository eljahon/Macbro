<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/catalog/products/list">{{ $t('products') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <div v-if="edit">
      <a-card :title="$t('fillIn')">
        <a-row>
          <a-tabs type="card" v-model="activeTabKey">
            <a-tab-pane key="1">
              <span slot="tab">
                <flag iso="ru" />
                Русский
              </span>
              <v-main ref="ruEditForm" lang="ru"></v-main>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">
                <flag iso="uz" />
                O'zbekcha
              </span>
              <v-main ref="uzEditForm" lang="uz"></v-main>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-card>
    </div>
    <div v-else>
      <a-card :title="$t('fillIn')">
        <a-row>
          <v-main ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :disabled="loading" type="primary" html-type="submit" @click.prevent="submit">
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
import { mapActions, mapGetters } from 'vuex'
import vMain from './v-main.vue'
export default {
  data () {
    return {
      activeTabKey: '1',
      edit: !!this.$route.params.id
    }
  },
  mounted () {
    this.setLoading(false)
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['setLoading']),
    submit () {
      this.setLoading(true)
      if (this.edit) {
        console.log('edit')
        if (!this.$refs.uzEditForm) {
          this.$refs.ruEditForm.onSubmit()
          return
        }
        this.$refs.ruEditForm.onSubmit()
        this.$refs.uzEditForm.onSubmit()
      } else {
        this.$refs.createForm.onSubmit()
        setTimeout(() => {
          this.setLoading(false)
        }, 2000)
      }
    },
    resetForm () {
      if (this.edit) {
        if (!this.$refs.uzEditForm) {
          this.$refs.ruEditForm.resetForm()
          return
        }
        this.$refs.ruEditForm.resetForm()
        this.$refs.uzEditForm.resetForm()
      } else {
        this.$refs.createForm.resetForm()
      }
    }
  },
  components: { 'v-main': vMain }
}
</script>
<style>
button.ant-btn:disabled {
  cursor: not-allowed !important;
}
.ant-tabs-tab {
  min-width: 150px;
}
.ant-tabs-tab span {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active span{
  color: red;
}
.flag-icon {
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
}
</style>
