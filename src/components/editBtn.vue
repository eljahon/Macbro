<template>
    <a-tooltip><template slot="title">{{ $t('update') }}</template>
        <a-button id="buttonOrderDetails" type="primary" icon="edit" @click="$emit('click')"></a-button>
    </a-tooltip>
</template>

<script>
    export default {
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
