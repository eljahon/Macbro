<template>
    <div>
        <a-breadcrumb style="margin: 10px 5px">
            <a-breadcrumb-item
                v-for="(item, index) in getRoutes"
                :key="item.path"
            >
                <router-link :to="item.path" v-if="index !== getRoutes.length - 1">{{ $t(item.meta.title) }}</router-link>
                <span v-else>{{ $t(item.meta.title) }}</span>
            </a-breadcrumb-item>
          <!-- <a-breadcrumb-item>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item> -->
        </a-breadcrumb>
    </div>
</template>

<script>
    export default {
        computed: {
            getRoutes () {
                console.log('ROUTES')
                return this.$route.matched.filter(item => item.meta.show)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
