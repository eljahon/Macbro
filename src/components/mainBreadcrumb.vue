<template>
  <a-card class="breadcrumb-row" :bordered="false">
    <a-row type="flex" align="middle">
      <a-button v-if="hasBack" type="link" @click="$router.go(-1)" style="padding: 0 25px 0 0">
        <a-icon :component="$myIcons.leftArrow"/>
      </a-button>
      <a-col :span="12">
        <slot name="links"/>
      </a-col>
      <a-col :span="12">
        <slot name="extra"/>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
    export default {
        props: {
            hasBack: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            getRoutes () {
                console.log('ROUTES')
                return this.$route.matched.filter(item => item.meta.show)
            }
        }
    }
</script>

<style lang="less">
.breadcrumb-row {
    .ant-card-body {
        padding: 11px 24px;
    }
}
</style>
