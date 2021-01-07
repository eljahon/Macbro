<template>
  <a-result
    :isSuccess="true"
    :content="false"
    :title="email"
    :sub-title="description">

    <template #extra>
      <a-button size="large" type="primary">View mail</a-button>
      <a-button size="large" style="margin-left: 8px" @click="goHomeHandle">Back to top</a-button>
    </template>

  </a-result>
</template>

<script>
export default {
  name: 'RegisterResult',
  data () {
    return {
      description: 'The activation email has been sent to your mailbox, and the email is valid for 24 hours. Please log in to the mailbox in time and click the link in the email to activate the account. ',
      form: {}
    }
  },
  computed: {
    email () {
      const v = this.form && this.form.email || 'xxx'
      return `Your account:${v} successfully registered `
    }
  },
  created () {
    this.form = this.$route.params
  },
  methods: {
    goHomeHandle () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>

</style>
