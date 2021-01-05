<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col v-if="false" :span="8">
        <a-row>
          <a-col :span="24">
            <a-list :grid="{ gutter: 2}">
              <a-list-item>
                <h2>{{ $t('cms.settings.about.motto') }}</h2>
              </a-list-item>
              <a-list-item>{{ $t('cms.settings.about.subtitle') }}</a-list-item>
            </a-list>
          </a-col>
        </a-row>
        <a-input :placeholder="$t('cms.settings.about.form.title.p')" class="mb-2"></a-input>
        <a-textarea
          v-model="value"
          :placeholder="$t('cms.settings.about.form.text.p')"
          :auto-size="{ minRows: 10, maxRows: 15 }"
        />
      </a-col>
      <a-col :span="24">
        <a-row type="flex" justify="space-between">
          <a-col span="auto">
            <a-list :grid="{ gutter: 2}">
              <a-list-item>
                <h2>{{ $t('cms.settings.about.directions') }}</h2>
              </a-list-item>
              <a-list-item>{{ $t('cms.settings.about.directions.subtitle') }}</a-list-item>
            </a-list>
          </a-col>
          <a-col span="auto">
            <a-button type="primary" @click="$router.push('/cms-settings/about-us/features/new')">{{ $t('button.new') }}</a-button>
          </a-col>
        </a-row>
        <a-table :columns="columns" :data-source="features" :pagination="{ page: 2 }">
          <span slot="picture.url" slot-scope="text">
            <img width="100" class="img_layout" :src="text.picture.url" :alt="text.picture.url">
          </span>
          <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
          <span slot="updated_at" slot-scope="text">{{ $date(text.updated_at) | moment('DD.MM.YY HH:mm') }}</span>
          <span slot="action" slot-scope="text">
            <a-popconfirm
              title="Вы действительно хотите удалить эту строку?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="confirm(text)"
              @cancel="cancel => null"
            >
              <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                <a-button class="mx-1" type="danger" icon="delete" />
              </a-tooltip>
            </a-popconfirm>
            <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
              <a-button @click="$router.push('/cms-settings/about-us/features/' + text.id)" type="primary" icon="edit" />
            </a-tooltip>
          </span>
        </a-table>
      </a-col>
    </a-row >
    <a-row v-if="false" :gutter="[16]" type="flex" justify="end">
      <a-col span="auto">
        <a-row type="flex" justify="space-between">
          <a-col span="auto">
            <a-button type="grey" style="margin-right:6px">{{ $t('button.reset') }}</a-button>
          </a-col>
          <a-col span="auto">
            <a-button type="primary">{{ $t('button.save') }}</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>

export default {
  data () {
    return {
      features: [],
      columns: [
          {
    dataIndex: 'title.ru',
    key: 'title.ru',
    title: this.$t('table.title')
  },
  {
    title: this.$t('table.image'),
    key: 'picture.url',
    scopedSlots: { customRender: 'picture.url' }
  },
  {
    title: this.$t('table.created_at'),
    scopedSlots: { customRender: 'created_at' },
    key: 'created_at'
  },
  {
    title: this.$t('table.updated_at'),
    key: 'updated_at',
    scopedSlots: { customRender: 'updated_at' }
  },
  {
    title: this.$t('table.actions'),
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
      ],
      visible: { flag: false },
      value: ''
    }
  },
  methods: {
    confirm (text) {
      this.$store.dispatch('deleteFeature', text.id).then(res => {
        this.$deleteFromList(this.features, text.id)
        this.$alertMessage('error', 'Deleted', 'Feature deleted successfully', this)
      })
    },
    getFeatures () {
      this.$store.dispatch('getFeatures').then(res => {
        console.log(res)
        this.features = res.map(el => ({ ...el, key: el.id }))
      })
    }
  },
  created () {
    this.getFeatures()
  }
}
</script>

<style scoped>
.img_layout {
   width: 100px;
  height: 80px;
  object-fit: cover;
}
</style>
