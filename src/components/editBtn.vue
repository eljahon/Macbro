<template>
  <a-tooltip><template slot="title">{{ $t('update') }}</template>
    <a-button class="ant-btn-icon-only" id="buttonOrderDetails" type="primary" @click="$emit('click')">
      <a-icon :component="myIcons.penSvg" />
    </a-button>
  </a-tooltip>
</template>

<script>
    import myIcons from '@/core/icons'
    export default {
        data () {
            return {
                myIcons
            }
        },
        model: {
            prop: 'value',
            event: 'click'
        },
        props: {
            click: {
                type: Function
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
