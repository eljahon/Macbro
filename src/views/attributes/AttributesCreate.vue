<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/catalog/attribute/list">{{ $t('attributes') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ this.edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card :title="$t(edit ? 'update' : 'fillIn')" class="breadcrumb-row" :bordered="false">
      <a-popconfirm
        v-if="edit"
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @click.native.stop=""
        @confirm="deleteAttr"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm>
    </a-card>
    <div v-if="edit" style="flex: 1; display: flex">
      <a-card :bordered="false" style="flex: 1">
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
      <a-card :bordered="false" style="flex: 1">
        <a-row>
          <v-main @clickParent="clickParent" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="btnLoading" type="primary" html-type="submit" @click.prevent="submit" test-attr="save-attribute">
            {{ $t('save') }}
          </a-button>
          <a-popconfirm
            placement="topRight"
            :title="$t('deleteMsg')"
            @confirm.prevent="resetForm"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button style="margin-left: 10px;" test-attr="reset-attribute">
                {{ $t('reset') }}
              </a-button>
            </a-tooltip>
          </a-popconfirm>
          <!-- <a-button style="margin-left: 10px;" @click.prevent="resetForm">
            {{ $t('reset') }}
          </a-button> -->
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import vMain from './v-main'
import { langMapper, flagMapper } from '@/utils/mappers'
// eslint-disable-next-line no-unused-vars,import/no-duplicates
// import { lang } from '@/utils/mappers'
export default {
  data () {
    return {
      btnLoading: false,
      activeTabKey: 1,
      edit: !!this.$route.params.id,
      langs: ['ru', 'uz', 'en']
    }
  },
  // mounted () {
  //   console.log('$refs', this.$refs)
  // },
  // updated () {
  //   console.warn('$refs', this.$refs)
  // },
  methods: {
    ...mapActions(['deleteAttrs']),
    langMapper,
    flagMapper,
    deleteAttr () {
      this.deleteAttrs(this.$route.params.id)
        .then(res => {
          this.$message.success('successfullyDeleted')
          this.$router.go(-1)
        })
        .catch(err => {
          this.$message.error(err.message)
          this.loading = false
        })
      // console.log(item)
    },
    clickParent (e) {
      this.btnLoading = e
    },
    submit () {
      console.log('submit')
      if (this.edit) {
        const forms = Object.values(this.$refs)
        console.log('Forms count', forms.length)
        const allLangs = ['uz', 'ru', 'en']
        const langs = []
        let edited = false
        // let formCount = 0
        let optionsMaxCount = null
        Object.values(this.$refs).forEach(form => {
          if (form[0]._data.initialOptionsCount < form[0]._data.productProperty.options.length) {
            optionsMaxCount = form[0]._data.productProperty.options.length
            edited = true
          }
          console.log('form', optionsMaxCount, form[0])
          // formCount++
        })
        console.log('value', edited)
        Object.values(this.$refs).forEach(form => {
          if (edited) {
            if (form[0]._data && optionsMaxCount === form[0]._data.productProperty.options.length) {
              langs.push(form[0].lang)
              allLangs.splice(allLangs.indexOf(form[0].lang), 1)
              console.log('Correct lang', form[0].lang, optionsMaxCount === form[0]._data.productProperty.options.length)
            } else {
              // langs.push(form[0].lang)
            }
          } else {
            langs.push(form[0].lang)
            console.log('Correct lang', form[0].lang)
          }
          console.log('form 1')
        })
        console.log('LENGTH', langs.length, forms.length)
        if (langs.length === forms.length && !edited) {
          Object.values(this.$refs).forEach(form => {
            if (form) {
              form[0].save()
            }
          })
        } else if (langs.length === 3 && edited) {
          Object.values(this.$refs).forEach(form => {
            if (form) {
              form[0].save()
            }
          })
        } else {
          this.$message.error(`Вы не добавляли изменений на ${allLangs.join(', ')} языках`)
        }
      } else {
        this.$refs.createForm.save()
      }
    },
    resetForm () {
      if (this.edit) {
        console.log('Refs', this.$refs)
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
