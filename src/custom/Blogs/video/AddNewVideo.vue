<template>
  <page-header-wrapper :title="false">
    <a-card>
      <div id="components-form-demo-advanced-search">
        <a-row :gutter="24">
          <a-col span="auto">
            <a-divider orientation="left">
              {{ isNew ? 'Создать видео' : 'Редактировать видео' }}
            </a-divider>
          </a-col>
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="Activity name">
              <a-tabs type="card">
                <a-tab-pane key="1" tab="Русский">
                  <a-input v-model="form.title.ru" :placeholder="$t('cms.settings.partners.title')"></a-input>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Uzbek">
                  <a-input v-model="form.title.uz" :placeholder="$t('cms.settings.partners.title')"></a-input>
                </a-tab-pane>
                <a-tab-pane key="3" tab="English">
                  <a-input v-model="form.title.en" :placeholder="$t('cms.settings.partners.title')"></a-input>
                </a-tab-pane>
              </a-tabs>
            </a-form-model-item>
            <a-form-model-item label="Category">
              <a-select v-model="form.category" style="width: 100%" :placeholder="$t('blogs.video.category')">
                <a-select-option v-for="item in categories" :key="item.id">
                  {{ item.name.ru }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="Link">
              <a-input :placeholder="$t('blogs.video.url')" v-model="form.link"></a-input>
              <a-row type="flex" justify="end" class="my-1">
                <a-col :span="18" :style="{ textAlign: 'right' }">
                  <a-button @click="handleReset">
                    {{ $t("blogs.video.button.clear") }}
                  </a-button>
                  <a-button v-if="isNew" :style="{ marginLeft: '8px' }" @click="handleNewVideo" type="primary" html-type="submit">
                    {{ $t("blogs.video.button.new") }}
                  </a-button>
                  <a-button v-else :style="{ marginLeft: '8px' }" @click="updateVideo" type="primary" html-type="submit">
                    {{ $t("button.save") }}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-form-model>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>
<script>
export default {
  data () {
    return {
      labelCol: { span: 3 },
      isNew: null,
      wrapperCol: { span: 14 },
      categories: [],
      form: {
        'category': null,
        'created_at': '',
        'link': '',
        'title': {
          'en': '',
          'ru': '',
          'uz': ''
        },
        'updated_at': ''
      }
    }
  },
  methods: {
    handleChange () {

    },
    getCategories () {
      this.$store.dispatch('getBlogCategories').then(res => {
        console.log(res)
        this.categories = res
      })
    },
    updateVideo () {
      console.log(this.form)
      this.$store.dispatch('updateVideo', this.form).then(res => {
        alert('updated successfully')
        this.$router.push('/blogs/videos/list')
      })
    },
    handleReset () {
      this.form = {
        'category': '',
        'created_at': '',
        'link': '',
        'title': {
          'en': '',
          'ru': '',
          'uz': ''
        },
        'updated_at': ''
      }
    },

    handleNewVideo () {
      console.log(this.form)
      this.$store.dispatch('postVideo', this.form).then(res => {
        this.$router.go(-1)
      })
      this.handleReset()
    },
    getVideo (id) {
      this.$store.dispatch('getVideo', id).then(res => {
        console.log(res)
        this.form = res
        this.form.category = res.category.id
      })
    }
  },
  created () {
    if (Object.keys(this.$route.params).length === 0 && this.$route.params.constructor === Object) {
      this.isNew = true
    } else this.getVideo(this.$route.params.id)
    this.getCategories()
  }

}
</script>
<style>
.ant-advanced-search-form {
  padding: 12px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
</style>
