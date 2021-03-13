<template>
    <a-tooltip style="margin-left: 5px">
        <template slot="title">{{ $t('update') }}</template>
        <a-button class="listActionBtns ant-btn-icon-only" type="danger" ghost>
            <a-icon :component="myIcons.lockSvg" />
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
            event: 'confirm'
        },
        props: {
            confirm: {
                type: Function
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
