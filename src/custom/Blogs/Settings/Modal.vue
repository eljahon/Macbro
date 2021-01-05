<template>
  <a-modal v-model="visible.flag" :title="formType == 'new' ? $t('blogs.settings.button.category'): $t('button.edit')">
    <!-- <p>{{ $t('blogs.settings.category.title_uz') }}</p>
    <a-input placeholder="uzbek" v-model="category.name.uz" />
    <p>{{ $t('blogs.settings.category.title_ru') }}</p>
    <a-input placeholder="russian" v-model="category.name.ru" />
    <p>{{ $t('blogs.settings.category.title_eng') }}</p>
    <a-input placeholder="english" v-model="category.name.en" /> -->
    <a-tabs type="card" >
      <a-tab-pane key="1" tab="Uzbek">
        <a-input :placeholder="$t('blogs.settings.category.title_ru')" v-model="category.name.uz" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Русский">
        <a-input :placeholder="$t('blogs.settings.category.title_ru')" v-model="category.name.ru" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="English">
        <a-input :placeholder="$t('blogs.settings.category.title_ru')" v-model="category.name.en" />
      </a-tab-pane>
    </a-tabs>
    <template slot="footer">
      <a-button key="back" @click="visible.flag = false">
        {{ $t('button.cancel') }}
      </a-button>
      <a-button key="submit" type="primary" @click="actionHandler">
        {{ formType == 'new' ? $t('button.create') : $t('button.save') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
    props: {
        category: {
            type: Object,
            required: true
        },
        formType: {
            type: String,
            required: true
        },
        actionHandler: {
            type: Function,
            required: true
        },
        visible: {
            type: Object,
            required: true
        }
    },
    created () {
    }

}
</script>

<style>

</style>
