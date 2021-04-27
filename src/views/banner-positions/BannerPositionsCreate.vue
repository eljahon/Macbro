<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/banner-positions/list" test-attr="prev-link-banner-pos">{{ $t('bannerPositions') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-row>
      <a-col :span="12">
      </a-col>
    </a-row>

    <v-main></v-main>
  </div>
</template>
<script>
import vMain from './v-main'
export default {
  components: { 'v-main': vMain },
  data () {
    return {
      edit: !!this.$route.params.id
    }
  }
}
</script>
