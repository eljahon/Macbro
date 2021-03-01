<template>
    <a-tag :color="active ? '#108ee9' : '#EC5B56'" >
        {{ title }}
    </a-tag>
</template>

<script>
    export default {
        props: {
            active: {
                type: Boolean,
                default: true
            },
            text: {
                type: [String, Number]
            }
        },
        computed: {
            title () {
                return this.text || this.active ? this.$t('active') : this.$t('inactive')
            }
        }
    }
</script>

<style lang="less" scoped>
    .ant-tag {
        border: none;
        border-radius: 4px;
        color: white;
    }
</style>
