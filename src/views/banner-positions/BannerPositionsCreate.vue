<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/banner-positions/list" test-attr="prev-link-banner-pos">{{ $t('bannerPositions') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-row>
      <a-col :span="12">
      </a-col>
    </a-row>

    <a-card :title="bannerPositionId ? $t('update') : $t('fillIn')" :bordered="false">
      <a-popconfirm
        v-if="edit"
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @click.native.stop=""
        @confirm="deleteBannerPosition"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm>
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-row>
        <a-switch
          slot="extra"
          v-model="bannerPosition.active"
          :checked-children="$t('active')"
          :un-checked-children="$t('inactive')"
          default-checked
          style="margin: 15px 0"
          test-attr="active-banner-pos"
        />
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="bannerPosition"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input
                  v-model="bannerPosition.title"
                  size="large"
                  test-attr="title-banner-pos"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="slug" :label="$t('url')" prop="slug">
                <a-input
                  size="large"
                  :disabled="!!bannerPositionId"
                  v-model="bannerPosition.slug"
                  test-attr="slug-banner-pos"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="size" :label="$t('size')" prop="size">
                <a-input
                  size="large"
                  v-model="bannerPosition.size"
                  test-attr="size-banner-pos"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="bannerPosition.description" test-attr="description-banner-pos"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-row>
    </a-card>

    <a-row class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-banner-pos">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-banner-pos">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
export default {
  components: {
    'tinymce': tinymce
  },
  data () {
    return {
      edit: !!this.$route.params.id,
      bannerPositionId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      bannerPosition: {
        title: '',
        size: '',
        description: '',
        slug: '',
        active: true
      },
      rules: {
        title: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        slug: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.bannerPositionId) this.getBannerPositionAttrs()
  },
  methods: {
    deleteBannerPosition (e) {
      this.loading = true
      request({
        url: '/banner-position/' + this.$route.params.id,
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
    getBannerPositionAttrs () {
      request({
        url: `/banner-position/${this.bannerPositionId}`,
        method: 'get'
      }).then((response) => {
        console.log('response', response)
        const { position: { active, title, size, slug, description } } = response
        this.bannerPosition.active = active
        this.bannerPosition.title = title
        this.bannerPosition.description = description
        this.bannerPosition.size = size
        this.bannerPosition.slug = slug
       })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = '/banner-position'
            var method = 'post'
          if (this.bannerPositionId) {
            url = `/banner-position/${this.bannerPositionId}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url: url,
              method: method,
              data: {
                ...this.bannerPosition
              },
              headers: headers
          }).then(res => {
            console.log(res)
            this.$router.replace('/banner-positions/list')
          }).catch(err => {
            console.log(err)
            this.$message.error(this.$t('error'))
          })
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    onReady (editor) {
                // Insert the toolbar before the editable area.
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        )
    }
  }
}
</script>
