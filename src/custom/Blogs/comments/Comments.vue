<template>
  <page-header-wrapper :title="false">
    <a-row :gutter="[8,8]" type="flex">
      <a-col :span="6">
        <a-card :style="`margin: 0px; padding:0px !important;`">
          <a-page-header
            style="border: 1px solid rgb(235, 237, 240);padding:8px"
            sub-title=""
          >
            <a-input-search class="search_post" :placeholder="$t('blogs.input.search')" @search="onSearch" />
          </a-page-header>
          <a-card-grid :hoverable="false" v-for="item in comments" :key="item.id" style="width:100%; padding:10px; cursor: pointer;">
            <a-row type="flex" justify="start" align="top">
              <a-col span="auto" >
                <img width="90" height="90" style="object-fit: cover" :src="item.img" alt="asa">
              </a-col>
              <a-col span="18">
                <a-row type="flex" justify="space-between">
                  <a-col span="auto"><p class="py-0"></p></a-col>
                  <a-col span="auto"><p class="py-0">{{ item.date }}</p></a-col>
                </a-row>
                <h4 class="mx-1">{{ item.title }}</h4>
                <h5 class="mx-1 my-0" style="color: grey">{{ item.comLength }} {{ $t('blogs.text.comment') }}</h5>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="18">
        <a-card>
          <h2>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece ...</h2>
          <p>2 Jan, 2020 10:30</p>
          <a-row>
            <a-col v-for="(item, keys) in comment" :key="keys">
              <Card :comment="item" :addComment="addComment" :removeComment="removeComment"/>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-card v-if="false">
      <EmptyComments />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import EmptyComments from '../../UI/EmptyComments'
import Card from './Element/CommentCard'
import As from './dummy'

export default {
  components: {
    EmptyComments,
    Card
  },
  data () {
    return {
      likes: 0,
      dislikes: 0,
      action: null,
      height: window.innerHeight,
      moment,
      comments: As.commentings,
      comment: As.comment
    }
    },
  methods: {
    like () {
      this.likes = 1
      this.dislikes = 0
      this.action = 'liked'
    },
    dislike () {
      this.likes = 0
      this.dislikes = 1
      this.action = 'disliked'
    },
    addComment () {
      alert('add coment')
    },
    removeComment (message) {
      this.comment.splice(this.comment.findIndex(el => el.message === message), 1)
    }
  }
}
</script>

<style scoped lang="less">
.search_post{
  border: 0 !important;
  outline: none !important;
  width: 100%;
  &:focus {
      border: 1px solid rgb(167, 58, 8);
  }
}
</style>
