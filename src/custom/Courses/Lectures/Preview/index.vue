<template>
  <a-card style="margin: 0px; padding:0px !important;">
    <a-row>
      <a-col v-if="true">
        <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          sub-title="Lesson 1: Introduction to the variable and syntaxes"
          @back="backTo"
        />
      </a-col>
    </a-row>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="Students" force-render>
        <Students />
      </a-tab-pane>
      <!-- <a-tab-pane key="2">
        <span slot="tab">
          <a-badge dot>
            <p>Assignments</p>
          </a-badge>
        </span>
        <Assignments />
      </a-tab-pane> -->
      <a-tab-pane key="3" tab="Comments">
        <Comments />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import Students from './Tabs/Students'
import Assignments from './Tabs/Assignments'
import Comments from './Tabs/Comments'
export default {
  components: {
    Students,
    Assignments,
    Comments
  },
  methods: {
    backTo () {
      this.$router.go(-1)
    }
  },
  created () {
    console.log(this.$route)
  }
}
</script>

<style>

</style>
