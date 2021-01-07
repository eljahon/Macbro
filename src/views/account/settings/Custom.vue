<template>
  <a-list itemLayout="horizontal">
    <a-list-item>
      <a-list-item-meta>
        <template v-slot:title>
          <a>Say something</a>
        </template>
        <template v-slot:description>
          <span>
            Hello Dell
          </span>
        </template>
      </a-list-item-meta>
      <template v-slot:actions>
        <a-switch checkedChildren="dark" unCheckedChildren="light" :defaultChecked="navTheme === 'dark' && true || false" @change="onChange" />
      </template>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template v-slot:title>
          <a>What is up?</a>
        </template>
        <template v-slot:description>
          <span>
            I do not know <a>{{ colorFilter(primaryColor) }}</a>
          </span>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>
<script>
import { colorList } from '@/components/SettingDrawer/settingConfig'
import { baseMixin } from '@/store/app-mixin'
import { NAV_THEME, TOGGLE_NAV_THEME } from '@/store/mutation-types'

const themeMap = {
  'dark': 'dark',
  'light': 'light'
}

export default {
  mixins: [baseMixin],
  data () {
    return {
    }
  },
  filters: {
    themeFilter (theme) {
      return themeMap[theme]
    }
  },
  methods: {
    colorFilter (color) {
      const c = colorList.find(o => o.color === color)
      return c && c.key
    },

    onChange (checked) {
      if (checked) {
        this.$store.commit(TOGGLE_NAV_THEME, NAV_THEME.DARK)
      } else {
        this.$store.commit(TOGGLE_NAV_THEME, NAV_THEME.LIGHT)
      }
    }
  }
}
</script>
