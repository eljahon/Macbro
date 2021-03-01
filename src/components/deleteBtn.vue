<template>
    <a-popconfirm
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @confirm="$emit('confirm', arguments[0])"
        :okText="$t('yes')"
        :cancelText="$t('no')"
    >
        <a-tooltip>
            <template slot="title">{{ $t('delete') }}</template>
            <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
        </a-tooltip>
    </a-popconfirm>
</template>

<script>
    export default {
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
