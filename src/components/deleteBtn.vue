<template>
    <a-popconfirm
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @confirm="$emit('confirm', arguments[0])"
        :okText="$t('yes')"
        :cancelText="$t('no')"
    >
        <a-tooltip placement="right">
            <template slot="title">{{ $t('delete') }}</template>
            <a-button class="ant-btn-icon-only" id="buttonDelete" type="danger">
                <a-icon :component="myIcons.binSvg" />
            </a-button>
        </a-tooltip>
    </a-popconfirm>
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
