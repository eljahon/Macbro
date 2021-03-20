<template>
  <div class="tab-content" :class="{ active: $parent.activeTab && name == $parent.activeTab.name }">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: [String, Number],
      default: ''
    },

    tab: {
      type: String
    },

    disabled: Boolean
  },

  watch: {
    disabled: 'emitDisabled'
  },

  methods: {
    emitDisabled (arg) {
      // alert(100, arg, this.name, this.tab)
      this.$parent.$emit('handle-tab-props-update', {
        name: this.name,
        tab: this.tab,
        disabled: !!arg
      })
    },
    emitProps () {
      this.$parent.$emit('handle-tab-props', {
        name: this.name,
        tab: this.tab,
        disabled: this.disabled
      })
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.emitProps()
    })
  }
}
</script>
