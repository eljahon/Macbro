import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const locale = {
  'button.delete': 'Delete',
  'button.preview': 'Preview',
  'button.edit': 'Edit',
  'table.actions': 'Actions',

  'blogs.posts': 'All posts',
  'blogs': 'Blogs',
  'blogs.posts.button.new': 'New post',
  'blogs.posts.button.search': 'Search',
  'blogs.posts.search.placeholder': 'input search text',
  'blogs.posts.button.startDate': 'Start date',
  'blogs.posts.button.endDate': 'End date',
  'blogs.posts.table.postType': 'Post type',
  'blogs.posts.table.title': 'Title',
  'blogs.posts.table.category': 'Category',
  'blogs.posts.table.publishedDate': 'Published date',
  'blogs.posts.table.status': 'Status',
  'blogs.posts.table.seen': 'Seen',
  'blogs.posts.table.comments': 'Comments',
  'blogs.posts.table.actions': 'Actions',

  'blogs.videos': 'Videos',
  'blogs.video.title_uz': 'Title in uzbek',
  'blogs.video.title_ru': 'Title in russian',
  'blogs.video.title_eng': 'Title in english',
  'blogs.video.category': 'Video category',
  'blogs.video.url': 'Video URL',
  'blogs.video.button.new': 'New video',
  'blogs.video.button.clear': 'Clear',
  'blogs.video.table.title_uz': 'Title uz',
  'blogs.video.table.title_ru': 'Title ru',
  'blogs.video.table.title_eng': 'Title eng',
  'blogs.video.table.link': 'Link',
  'blogs.video.table.created_at': 'Created at',
  'blogs.video.table.updated_at': 'Updated at',

  'blogs.comments': 'Комментарии',

  'blogs.settings': 'Razdeli'
}

export default {
  ...components,
  ...locale
}
