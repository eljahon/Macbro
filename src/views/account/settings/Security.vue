<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
  </a-list>
</template>

<script>
export default {
  data () {
    return {
      data: [
        { title: 'Password', description: 'Hozirga password:', value: 'strong', actions: { title: 'Edit', callback: () => { this.$message.info('This is a normal message') } } },
        { title: 'Telefon raqam', description: '9988899988', value: '138****8293', actions: { title: 'Edit', callback: () => { this.$message.success('This is a message of success') } } },
        { title: 'Yaratilgan kun', description: 'Yaratilgan sanasi', value: 'ant***sign.com', actions: { title: 'Edit', callback: () => { this.$message.warning('This is message of warning') } } },
        { title: 'O\'zgarish', description: 'O\'zgarish', value: '1-2-2020', actions: { title: 'Edit', callback: () => { this.$message.info('This is a normal message') } } }
      ]
    }
  }
}
</script>

<style scoped>

</style>
