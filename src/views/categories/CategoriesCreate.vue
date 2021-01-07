<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/catalog/categories/list">{{ $t('categories') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <div v-if="edit">
      <a-card :title="$t('fillIn')">
        <a-row>
          <a-tabs type="card" v-model="activeTabKey">
            <a-tab-pane key="1">
              <span slot="tab">
                <flag iso="ru" />
                Русский
              </span>
              <v-main ref="ruEditForm" lang="ru"></v-main>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">
                <flag iso="uz" />
                O'zbekcha
              </span>
              <v-main ref="uzEditForm" lang="uz"></v-main>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-card>
    </div>
    <div v-else>
      <a-card :title="$t('fillIn')">
        <v-main ref="createForm"></v-main>
      </a-card>
      <!-- <a-card :title="$t('fillIn')">
        <a-row>
          <a-tabs type="card" v-model="activeTabKey">
            <a-tab-pane key="1" :tab="$t('basicSettings')">
              <v-main ref="createForm"></v-main>
            </a-tab-pane>
            <a-tab-pane key="2" tab="SEO">
              <a-row>
                <a-col :span="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('title')">
                    <a-input type="text" v-model="meta.title" :placeholder="$t('title')" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('meta_title')">
                    <a-input type="text" v-model="meta.tags" :placeholder="$t('meta_title')" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('description')">
                    <a-input type="text" v-model="meta.description" :placeholder="$t('description')" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="3" :tab="$t('attributes')">
              <a-card :title="$t('attributes')">
                <a-card>
                  <a-row type="flex" justify="space-between">
                    <a-col :span="4">
                      <a-button @click="addAttr" type="primary">{{ $t('add_attr') }}</a-button>
                    </a-col>
                  </a-row>
                </a-card>
                <a-row>
                  <a-table
                    :columns="columns"
                    :dataSource="tableAttrData"
                    :rowKey="record => record.id"
                  >
                    <template slot="status" slot-scope="is_active">
                      <a-tag v-if="is_active" color="#108ee9">{{ $t('active') }}</a-tag>
                      <a-tag v-else color="#f50">{{ $t('inactive') }}</a-tag>
                    </template>
                    <template slot="action" slot-scope="item">
                      <a-tooltip>
                        <template slot="title">{{ $t('delete') }}</template>
                        <a-button id="buttonDelete" @click="removeAttr(item)" type="danger" icon="delete"></a-button>
                      </a-tooltip>
                    </template>
                  </a-table>
                </a-row>
              </a-card>
              <a-modal v-model="isOpenAttrAdd" :title="$t('add_attr')">
                <a-row>
                  <a-col :span="24">
                    <a-select
                      mode="multiple"
                      size="large"
                      :placeholder="$t('add_attr')"
                      style="width: 100%"
                      v-model="attributes"
                      :filter-option="filterOption"
                    >
                      <a-select-option v-for="(item, i) in allAttrs" :key="i + item.id" :value="item.id">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
                <template slot="footer">
                  <a-button @click="closeModal" key="back">
                    {{ $t('cancel') }}
                  </a-button>
                  <a-button key="submit" type="primary" @click="addAttributes">
                    {{ $t('add') }}
                  </a-button>
                </template>
              </a-modal>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-card> -->
    </div>
    <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button type="primary" html-type="submit" @click.prevent="submit">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import vMain from './v-main'
// import Attrs from '../attributes/AttributesList'
export default {
  data () {
    return {
      activeTabKey: '1',
      edit: !!this.$route.params.id
    }
  },
  mounted () {
    console.log('category.$refs', this.$refs)
  },
  methods: {
    submit () {
      console.log('submit')
      if (this.edit) {
        if (!this.$refs.uzEditForm) {
          this.$refs.ruEditForm.onSubmit()
          return
        }
        this.$refs.ruEditForm.onSubmit()
        this.$refs.uzEditForm.onSubmit()
      } else {
        this.$refs.createForm.onSubmit()
      }
    },
    resetForm () {
      if (this.edit) {
        if (!this.$refs.uzEditForm) {
          this.$refs.ruEditForm.resetForm()
          return
        }
        this.$refs.ruEditForm.resetForm()
        this.$refs.uzEditForm.resetForm()
      } else {
        this.$refs.createForm.resetForm()
      }
    }
  },
  components: { 'v-main': vMain }
}
// :dataSource="allAttrs"
// :rowKey="record => record.id"
// :loading="loadAttrs"
// @change="changeAttrs"
// :pagination="paginationAttrs"
</script>
<style>
.ant-tabs-tab {
  min-width: 150px;
}
.ant-tabs-tab span {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active span{
  color: red;
}
.flag-icon {
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
}
</style>
