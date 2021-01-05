<template>
  <global-footer class="footer custom-render my-0 py-0">
    <template v-slot:links>
      <a href="#" target="_blank">Copyright {{ currentDate }} Udevs</a>
    </template>
    <!-- <template v-slot:copyright>
      <a href="#" target="_blank">copyright {{ new Date() }}</a>
    </template> -->
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  data () {
    return {
      currentDate: new Date().getFullYear()
    }
  },
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
