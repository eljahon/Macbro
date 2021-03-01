<template>
    <a-tooltip style="margin-left: 5px"><template slot="title">{{ $t('update') }}</template>
        <a-button class="listActionBtns" type="danger" ghost>
            <a-icon :component="lockSvg" />
        </a-button>
    </a-tooltip>
</template>

<script>
    import { lockSvg } from '@/core/icons'
    export default {
        data () {
            return {
                lockSvg
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
