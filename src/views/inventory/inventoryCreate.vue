<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/inventory/list">{{ $t('inventory') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('fillIn')">
      <a-row>
        <v-main></v-main>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import vMain from './v-main'
export default {
  components: { 'v-main': vMain }
}
</script>
