<template>
  <div class="tabs-underline-wrapper">
    <div class="tabs-underline-container" :class="[tabClass || null]">
      <div
        :class="[
          'tab-thumb-item',
          { active: activeTab && item && activeTab.name == item.name },
          btnClass || 'tab-item',
          {
            disabled: item.disabled,
          },
        ]"
        v-for="item in tabsList"
        :key="item.name + item.disabled"
        :title="item.tab"
        @click="$emit('change', item)"
        :disabled="item.disabled"
      >
        {{ item.tab }}
      </div>

      <slot name="extra-tab" />
    </div>

    <div class="pt-4 flex-column flex-1">
      <div class="columns flex-1">
        <slot name="aside" />
        <div class="column">
          <div class="flex-column h-100">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'value',
      event: 'change'
    },

    watch: {
      value: {
        handler (arg) {
          const t = this.tabsList.find((item) => {
            return arg && item && item.name === arg.name
          })
          // console.log('t', t);
          this.activeTab = t || arg
        },
        immediate: true
      }
    },

    props: {
      value: {
        type: [String, Number, Object]
      },
      tabClass: {
        type: String
      },
      btnClass: {
        type: String
      }
    },
    data () {
      return {
        activeTab: {},
        tabsList: []
      }
    },

    mounted () {
      this.$on('handle-tab-props', (tab) => {
        this.tabsList.push(tab)

        if (
          !this.activeTab ||
          (this.activeTab && !this.activeTab.name && !tab.disabled)
        ) {
          this.activeTab = tab
        }
      })

      this.$on('handle-tab-props-update', (tab) => {
        const f = this.tabsList.findIndex(
          (item) => item && tab && item.name === tab.name
        )

        if (f !== -1) {
          // this.tabsList[f] = tab
          this.$set(this.tabsList, f, tab)
        }
      })

      this.$on('change', (tab) => {
        this.activeTab = tab
      })
    }
  }
</script>

<style lang="less">
  .tabs {
    &-underline {
      &-container {
        display: flex;
        flex-flow: row nowrap;

        .tab-thumb-item {
          &.disabled {
            pointer-events: none;
            opacity: 0.5;
            cursor: no-drop;
          }

          &.thumb-outline {
            background: #ffffff 0% 0% no-repeat padding-box;
            box-shadow: 0px 3px 10px #a1a1a124;
            border-radius: 4px;
            opacity: 1;
            flex: 1;
            margin: 0 5px;
            padding: 8px 22px;
            font-size: 15px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: pointer;
            // color: #9aa6bb;
            color: #333;
            transition: all 0.15s;

            &.no-fill {
              flex: unset;
            }

            // &.active {
            //   color: #333;
            // }

            &.no-inactive-background:not(.active) {
              background: unset;
              box-shadow: unset;
            }
          }
        }
      }

      &-wrapper {
        display: flex;
        flex-flow: column nowrap;

        .tab-item {
          cursor: pointer;
          display: flex;
          flex-flow: row nowrap;
          padding: 0.25em 0.5em;
          position: relative;
          font-size: 18px;

          &::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            transition: height 0.15s, background-color 0.1s;
            height: 1px;
            background-color: blue;
          }

          &.active {
            color: blue;
            &::before {
              height: 2px;
              background-color: transparent;
            }
          }
        }

        .tab-content {
          display: none;
          opacity: 0;
          transition: opacity 0.15s;

          &.active {
            display: block;
            flex: 1;
            opacity: 1;
          }
        }
      }
    }
  }
  .tabs-outline {
    border: 1px solid #bdc7d8;
    border-radius: 4px;
    opacity: 0.8;
    padding: 15px 11px;
    display: flex;
    flex-flow: row nowrap;
    background: #f9fafc;
  }
</style>
