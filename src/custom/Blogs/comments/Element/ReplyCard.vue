<template>
  <a-row type="flex" align="top">
    <a-col span="auto"><a-avatar size="large" :src="require('@/assets/dd.png')" /></a-col>
    <a-col span="22" class="mx-1 visible_btn_parent">
      <a-row type="flex" justify="space-between">
        <a-col span="12">
          <a-row type="flex" align="top" justify="space-between">
            <a-col span="auto"><h1 class="py-0">Najot Ta'lim</h1><small><strong>{{ answerList.published_at }}</strong></small></a-col>
            <a-col span="auto"><a-button class="btn-remove" @click="removeComment" type="link" icon="close" size="default" /></a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="auto">
          <p>{{ answerList.message }}</p>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    answerList: {
      type: Object,
      required: true
    },
    removeRepply: {
      type: Function,
      required: true
    }
  },
  methods: {
    removeComment () {
      this.removeRepply(this.answerList.message)
    }
  }

}
</script>

<style lang="less" scoped>
.visible_btn_parent {
  transition: 0.6s;
  .btn-remove {
    visibility:hidden;
    color: rgb(255, 255, 255);
    cursor: pointer;
    transition: 0.5s;
  }
  &:hover .btn-remove {
    visibility:visible;
    color: red;
  }
}
</style>
