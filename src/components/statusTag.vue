<template>
  <a-tag :color="colour" :class="{'ant-tag-custom': defaultVal}">
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
            },
            color: {
                type: String
            },
            defaultVal: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            title () {
                return this.text ? this.text : this.active ? this.$t('active') : this.$t('inactive')
            },
            colour () {
                return this.color ? this.color : this.active ? 'blue' : 'red'
            }
        }
    }
</script>

<style lang="less" scoped>
    // .ant-tag-custom {
    //     border: none !important;
    //     border-radius: 4px !important;
    //     color: white !important;
    // }
</style>
