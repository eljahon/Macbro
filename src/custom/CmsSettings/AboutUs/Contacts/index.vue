<template>
  <a-card >
    <a-row>
      <a-col :span="24">
        <a-list :grid="{ gutter: 2}">
          <a-list-item>
            <h2>{{ $t('cms.settings.about.contacts') }}</h2>
          </a-list-item>
          <a-list-item>{{ $t('cms.settings.about.contacts.subtitle') }}</a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <a-row :gutter="[24]" type="flex" justify="center" align="top">
      <a-col v-for="item in list" :key="item.id" :span="8" class="my-2">
        <a-tabs v-if="item.id == 3" type="card" @change="callback">
          <a-tab-pane key="1" tab="English">
            <a-input v-model="item.value.en" :placeholder="$t(item.placeholder)"></a-input>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Russian">
            <a-input v-model="item.value.ru" :placeholder="$t(item.placeholder)"></a-input>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Uzbek">
            <a-input v-model="item.value.uz" :placeholder="$t(item.placeholder)"></a-input>
          </a-tab-pane>
        </a-tabs>
        <a-input
          v-model="phone"
          v-if="item.id == 1"
          v-decorator="[
            'phone',
            {
              rules: [{ required: true, message: 'Please input your phone number!' }],
            },
          ]"
          style="width: 100%"
        >
          <a-select
            :placeholder="$t('cms.settings.about.contacts.phone')"
            slot="addonBefore"
            v-decorator="['prefix', { initialValue: '98' }]"
            style="width: 70px"
          >
            <a-select-option value="98">
              +998
            </a-select-option>
            <a-select-option value="938">
              +998
            </a-select-option>
          </a-select>
        </a-input>
        <a-input v-else-if="item.id == 2" v-model="item.value" :placeholder="$t(item.placeholder)"></a-input>
      </a-col>
    </a-row>
    <a-row>
      <a-row type="flex" justify="end">
        <a-col span="auto">
          <a-button @click="resetContact" type="grey" style="margin-right:6px">{{ $t('button.reset') }}</a-button>
          <a-button @click="saveContact" type="primary">{{ $t('button.save') }}</a-button>
        </a-col>
      </a-row>
    </a-row>
  </a-card>
</template>

<script>
export default {
    data () {
        return {
            form: '',
            phone: '',
            list: [
              {
                    id: 3,
                    placeholder: 'cms.settings.about.contacts.address',
                    value: {
                    'en': '',
                    'ru': '',
                    'uz': ''
                    }
                },
                {
                    id: 1,
                    placeholder: 'cms.settings.about.contacts.phone',
                    value: ''
                },
                {
                    id: 2,
                    placeholder: 'cms.settings.about.contacts.email',
                    value: ''
                }
            ]
        }
    },
    methods: {
      callback (f) {
        console.log(f)
      },
      resetContact () {
      },
      saveContact () {
        const form = {
          created_at: 'string',
          updated_at: 'string',
          id: this.form.id,
          location: {
            'en': this.list[0].value.en,
            'ru': this.list[0].value.ru,
            'uz': this.list[0].value.uz
          },
          mail: this.list[2].value,
          phone: this.phone
        }
        console.log(form)
        this.$store.dispatch('updateContact', form).then(res => {
          console.log(res)
          alert('saved successfully')
        })
      },
      getContacts () {
        this.$store.dispatch('getContacts').then(res => {
          console.log(res)
          this.form = res
          this.phone = res.phone
          this.list[0].value.en = res.location.en
          this.list[0].value.ru = res.location.ru
          this.list[0].value.uz = res.location.uz
          this.list[2].value = res.mail
        })
      }
    },
    created () {
      this.getContacts()
    }
}
</script>

<style>

</style>
