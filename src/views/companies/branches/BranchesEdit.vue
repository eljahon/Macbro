<template>
  <div>
    <breadcrumb-row @click="()=> $router.go(-1)">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/company/list" test-attr="prev-link-company">{{ $t('companies') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <a @click="() => $router.push({ name: 'CompaniesEdit', params: {id: routeid} })" test-attr="branches-branch">{{ $t('branches') }}</a>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <div v-if="edit">
      <a-card :title="$t('information')" :bordered="false">
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
    <div v-else>
      <a-card :title="$t('fillIn')" :bordered="false">
        <a-row>
          <v-main @clickParent="clickParent" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row class="edit-btns" v-if="ButtonBoole === '1'">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="btnLoading" type="primary" html-type="submit" @click.prevent="submit" test-attr="save-branch">
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
import { langMapper, flagMapper } from '@/utils/mappers'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      routeid: localStorage.getItem('company_id'),
      btnLoading: false,
      activeTabKey: 1,
      edit: !!this.$route.params.id,
      langs: ['ru', 'uz', 'en']
    }
  },
  computed: {
    ...mapGetters(['citiesList', 'ButtonBoole'])
  },
  mounted () {
    // console.log('$refs', this.$refs)
    // this.$router.push({ name: this.$route.name, query: { tabid: '1' } })
    this.getCities()
    console.log('ROUTES', this.$route.path)
  },
  // updated() {
  //   console.warn('$refs', this.$refs)
  // },
  methods: {
    ...mapActions(['getCities']),
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
  components: { 'v-main': vMain }
}
</script>
<style></style>
