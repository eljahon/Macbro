<template>
  <a-card :bordered="false">
    <a-row type="flex" align="top">
      <a-col span="auto"><a-avatar size="large" :src="comment.image" /></a-col>
      <a-col span="16" class="mx-1">
        <a-row type="flex" justify="space-between">
          <a-col span="auto">
            <a-row type="flex" align="middle">
              <a-col span="auto"><h1 class="py-0">{{ comment.fullName }}</h1><small><strong>{{ comment.published_at }}</strong></small></a-col>
              <!-- <a-col span="auto"><small>3 days, ago</small></a-col> -->
            </a-row>
          </a-col>
          <a-col span="auto">
            <a-button @click="comment.is_active = !comment.is_active" :type="comment.is_active ? 'link' : ''"> {{ comment.is_active ? $t('blogs.text.cancel') : $t('blogs.text.confirm') }}</a-button>
            <a-button @click="removeComments" type="link" icon="close" size="default" />
          </a-col>
        </a-row>
        <a-row>
          <a-col span="auto">
            <p>{{ comment.message }}</p>
          </a-col>
          <a-col span="24" v-for="(answer,key) in comment.answer" :key="key">
            <ReplyCard :answerList="answer" :removeRepply="removeRepply" />
          </a-col>
        </a-row>
      </a-col>
      <a-col span="17">
        <a-input-search
          :placeholder="$t('blogs.button.reply.p')"
          :enter-button="$t('blogs.button.reply')"
          size="default"
          v-model="texting"
          @search="addNewComment"
        />
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import ReplyCard from './ReplyCard'
export default {
    data () {
        return {
            texting: ''
        }
    },
    props: {
        comment: {
            type: Object,
            required: true
        },
        addComment: {
            type: Function,
            required: true
        },
        removeComment: {
            type: Function,
            required: true
        }
    },
    components: {
        ReplyCard
    },
    methods: {
        addNewComment (text) {
            this.comment.answer.push({
              author: 'asfdaa',
              message: text,
              published_at: '2.03.2020 22:30',
              updated_at: '2.03.2020 22:30',
              is_active: true
              })
              this.texting = ''
        },
        removeRepply (message) {
            this.comment.answer.splice(this.comment.answer.findIndex(el => el.message === message), 1)
        },
        removeComments () {
            this.removeComment(this.comment.message)
        }
    }

}
</script>

<style>

</style>
