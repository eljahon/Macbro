<template>
  <page-header-wrapper :title="false">
    <a-row :gutter="[8,8]">
      <a-col :span="24">
        <Team />
      </a-col>
      <a-col :span="24">
        <Gallery />
      </a-col>
      <a-col :span="24">
        <Contacts />
      </a-col>
      <a-col :span="24">
        <a-tabs default-active-key="2" >
          <a-tab-pane key="1" :tab="$t('cms.settings.about.directions')">
            <Directions />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Преимущества">
            <Offers />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import Offers from './Offers'
import Gallery from './Gallery'
import Contacts from './Contacts'
import Team from '../Team/Team.vue'
import Directions from './Directions'
export default {
  components: {
  Team,
  Offers,
  Gallery,
  Contacts,
  Directions
}

}
</script>

<style>

</style>
