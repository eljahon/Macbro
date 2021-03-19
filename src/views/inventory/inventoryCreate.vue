<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px">
        <a-breadcrumb-item>
          <router-link to="/inventory/list" test-attr="prev-link-inventory">{{ $t('inventory') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('fillIn')" :bordered="false">
      <a-row>
        <v-main></v-main>
      </a-row>
    </a-card>
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
