<template>
  <a-table :columns="columns" :data-source="data" bordered>
    <a slot="name" slot-scope="text">{{ text }}</a>
    <a-tag slot="vid_status" slot-scope="text" :color="text=='watched' ?'green':'orange'">{{ text }}</a-tag>
    <a-tag slot="assignment_status" slot-scope="text" :color="text ?'green':'orange'">{{ text ? 'Submitted' : 'pending' }}</a-tag>
    <span slot="actions" slot-scope="text, row">
      <a-popconfirm
        title="Are you sure delete this task?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="confirm"
        @cancel="cancel"
      >
      </a-popconfirm>
      <a-tooltip v-if="row.submittion" placement="bottomLeft" :title="$t('button.edit')">
        <a-button :type="row.submittion ? 'primary' : 'link'">
          {{ row.submittion ? 'Download' : 'not available' }}<a-icon type="download" />
        </a-button>
      </a-tooltip>
      <a-tooltip v-if="row.submittion" placement="bottomLeft" title="Новый модуль">
        <a-button class="mx-1" type="primary">
          Accept<a-icon type="right" />
        </a-button>
      </a-tooltip>
      <p v-else> Not available</p>
    </span>
  </a-table>
</template>
<script>
const columns = [
  {
    title: 'Student Name',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Description of assignment',
    dataIndex: 'desciption',
    key: 'desciption'
  },
  {
    title: 'Video lesson',
    dataIndex: 'vid_status',
    key: 'vid_status',
    scopedSlots: { customRender: 'vid_status' }
  },
  {
    title: 'Assignment Status',
    dataIndex: 'assignment_status',
    key: 'assignment_status',
    ellipsis: true,
    scopedSlots: { customRender: 'assignment_status' }
  },
  {
    title: 'Action',
    dataIndex: 'actions',
    key: 'actions',
    ellipsis: true,
     scopedSlots: { customRender: 'actions' }
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    desciption: 'Homework description 0',
    vid_status: 'watched',
    assignment_status: 0,
    submittion: 1
  },
   {
    key: '14',
    name: 'Gulirano Urazova',
    age: 32,
    desciption: 'Homework description 1',
    vid_status: 'watched',
    assignment_status: 1,
    submittion: 0
  },
  {
    key: '13',
    name: 'Alisher Botirov',
    age: 32,
    desciption: 'Homework description 2',
    vid_status: 'pending',
    assignment_status: 1,
    submittion: 0
  }
]

export default {
  data () {
    return {
      data,
      columns
    }
  }
}
</script>
