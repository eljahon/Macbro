<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row type="flex" justify="space-between" :gutter="[8]">
        <a-col span="auto"> </a-col>
        <a-col span="auto"><a-button type="primary" @click="$router.push('/blogs/videos/list/new')">Add new video</a-button></a-col>
      </a-row>
      <a-row class="my-2">
        <a-col>
          <a-table :columns="columns" :data-source="videos">
            <span slot="link" slot-scope="text">
              <a :href="text.link" target="_blank">{{ text.link }}</a>
            </span>
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="updated_at" slot-scope="text">{{ $date(text.updated_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="action" slot-scope="text">
              <a-row type="flex">
                <a-col span="auto">
                  <a-popconfirm
                    title="Вы уверены, что удалили это видео?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteVideo(text.id)"
                    @cancel="cancel => null"
                  >
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-popconfirm>
                </a-col>
                <a-col span="auto">
                  <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                    <a-button @click="$router.push('/blogs/videos/list/' + text.id)" type="primary" icon="edit" />
                  </a-tooltip>
                </a-col>
                <a-col span="auto">
                  <a-tooltip placement="bottomLeft" title="preview">
                    <a-button class="mx-1" type="primary" icon="eye" />
                  </a-tooltip>
                </a-col>
              </a-row>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
    <a-modal v-if="false" v-model="visible">
      <iframe width="100%" height="345" :src="preview">
        <a-row>
        <a-col>
        <h2>{{ preview.title.ru }}</h2>
        </a-col>
        </a-row>
      </iframe>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
export default {

  data () {
    return {
      visible: false,
      preview: {},
      videos: [],
      columns: [
        {
          title: this.$t('blogs.video.table.title_uz'),
          dataIndex: 'title.uz',
          key: 'titile.uz'
        },
        {
          title: this.$t('blogs.video.table.title_ru'),
          dataIndex: 'title.ru',
          key: 'title.ru'
        },

        {
          title: this.$t('blogs.video.table.title_eng'),
          dataIndex: 'title.en',
          key: 'title.en'
        },
        {
          title: this.$t('blogs.video.table.link'),
          key: 'link',
          scopedSlots: { customRender: 'link' }
        },
        {
          title: this.$t('blogs.video.table.created_at'),
           scopedSlots: { customRender: 'created_at' },
          key: 'created_at'
        },
        // {
        //   title: this.$t('blogs.video.table.updated_at'),
        //   scopedSlots: { customRender: 'updated_at' },
        //   key: 'updated_at'
        // },
        {
          title: this.$t('table.actions'),
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '25%'
        }
      ],
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    confirm () {

    },
    getVideos () {
      this.$store.dispatch('getVideos').then(res => {
        console.log(res)
        this.videos = res.map(el => ({ ...el, key: el.id }))
      })
    },
    deleteVideo (id) {
      this.$store.dispatch('deleteVideo', id).then(res => {
        this.$deleteFromList(this.videos, id)
        this.$alertMessage('success', 'Deleted', 'Video deleted successfully', this)
      })
    },
    addNewVideoHandler (el) {

    }
  },
  created () {
    this.getVideos()
  }
}
</script>

<style>
</style>
