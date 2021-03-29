<template>
    <a-tooltip><template slot="title">{{ $t('read') }}</template>
        <!-- <a-button id="buttonPreview" type="default" :icon="icon" @click="$emit('click')"></a-button> -->
        <a-button type="default" :icon="icon" @click="$emit('click')"></a-button>
    </a-tooltip>
</template>

<script>
    export default {
        model: {
            prop: 'value',
            event: 'click'
        },
        props: {
            icon: {
                type: String,
                default: 'eye'
            },
            click: {
                type: Function
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
