<template>
  <div>
    <a-modal v-model="visible">
      <slot></slot>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          {{ cancelButton }}
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          {{ okButton }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
    props: {
        visibles: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        cancelButton: {
             type: String,
            required: true
        },
         okButton: {
            type: String,
            required: true
        },
        handleCancel: {
            type: Function,
            required: true
        },
        handleOk: {
            type: Function,
            required: true
        }
    },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    // showModal () {
    //   this.visible = true
    // },
    // handleCancel (e) {
    //   console.log(e)
    //   this.visible = false
    // },
    //   handleOk (e) {
    //   console.log(e)
    //   this.visible = false
    // }
  }
}
</script>
