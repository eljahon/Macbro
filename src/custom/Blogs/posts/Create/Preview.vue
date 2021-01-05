<template>
  <a-card>
    <span v-html="text"></span>
  </a-card>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    }

}
</script>

<style>

</style>
