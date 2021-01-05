<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row class="my-1" type="flex" justify="space-between">
        <a-col span="auto">
          <a-row :gutter="[8,8]" type="flex">
            <a-col span="auto">
              <a-input
                v-model="searchItem"
                :placeholder="$t('blogs.posts.search.placeholder')"
                style="width: 400px"
              />
            </a-col>
            <a-col v-if="false" span="auto">
              <a-range-picker @change="onChange" />
            </a-col>
            <a-col span="auto">
              <a-button @click="searchPost" type="green">{{ $t('blogs.posts.button.search') }}</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-col span="auto">
          <a-button
            type="green"
            @click="$router.push('/blogs/posts/new-post')"
          >{{ $t('blogs.posts.button.new') }}</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="[8,8]">
        <a-col :md="24">
          <a-table :columns="columns" :data-source="data">
            <span slot="created_at" slot-scope="text">{{ $date(text.created_at) | moment('DD.MM.YY HH:mm') }}</span>
            <span slot="category" slot-scope="text">{{ text.category.name.ru }}</span>
            <span slot="is_active" slot-scope="text">
              <a-tag :color="text.is_active ? 'green' : 'red'">{{ text.is_active ? 'active' : 'disactivated' }}</a-tag>
            </span>
            <span slot="comments">
              <a>view</a>
            </span>
            <span slot="action" slot-scope="text">
              <a-row type="flex">
                <a-col span="auto">
                  <a-popconfirm
                    title="Вы уверены, что удалите этот пост?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="confirm(text)"
                    @cancel="cancel"
                  >
                    <a-tooltip placement="bottomLeft" :title="$t('button.delete')">
                      <a-button class="mx-1" type="danger" icon="delete" />
                    </a-tooltip>
                  </a-popconfirm>
                </a-col>
                <a-col span="auto">
                  <a-tooltip placement="bottomLeft" :title="$t('button.edit')">
                    <a-button @click="$router.push('/blogs/posts/' + text.id)" type="primary" icon="edit" />
                  </a-tooltip>
                </a-col>
              </a-row>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
const data = []
export default {
  data () {
    return {
      data,
      searchItem: '',
      columns: [
        {
          title: this.$t('blogs.posts.table.postType'),
          dataIndex: 'type',
          key: 'titles',
          width: '7%'
        },
        {
          title: this.$t('blogs.posts.table.title'),
          dataIndex: 'title.ru',
          key: 'title.ru',
          width: '28%'
        },
        {
          title: this.$t('blogs.posts.table.category'),
          key: 'category',
          scopedSlots: { customRender: 'category' }
        },
        {
          title: this.$t('blogs.posts.table.publishedDate'),
          scopedSlots: { customRender: 'created_at' },
          key: 'created_at'
        },
        {
          title: this.$t('blogs.posts.table.status'),
          key: 'is_active',
          scopedSlots: { customRender: 'is_active' }
        },
        {
          title: this.$t('blogs.posts.table.seen'),
          key: 'view_count',
          dataIndex: 'view_count'
        },
        {
          title: this.$t('blogs.posts.table.comments'),
          key: 'comments',
          dataIndex: 'comments',
          scopedSlots: { customRender: 'comments' }
        },
        {
          title: this.$t('blogs.posts.table.actions'),
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '20%'
        }
      ]
    }
  },
  methods: {
    searchPost () {
      this.$store.dispatch('searchPosts', this.searchItem).then(res => {
       this.data = res.posts.map(el => ({ ...el, key: el.id }))
      })
    },
    getPosts () {
      this.$store.dispatch('getPosts').then(res => {
        console.log(res)
        this.data = res.map(el => ({ ...el, key: el.id }))
      })
    },
    onChange () {},
    onSearch () {},
    confirm (data) {
      this.$store.dispatch('deletePost', data.id).then(res => {
        this.$alertMessage('error', data.title.ru, 'Successfully deleted', this)
        this.$deleteFromList(this.data, data.id)
      })
    },
    cancel () {}
  },
  created () {
    this.getPosts()
  }
}
</script>

<style>
</style>
