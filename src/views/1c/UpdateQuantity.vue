<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/1c">{{ $t('c1') }}</router-link>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <a-card :title="$t('update-quantity')">
      <div style="text-align:center">
        <h1>Загрузить данные</h1>
      </div>
      <a-upload-dragger
        name="file"
        :multiple="true"
        accept=".csv"
        :beforeUpload="beforeUpload"
        :customRequest="uploadCsv"
        @change="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">Щелкните или перетащите файл в эту область, чтобы загрузить</p>
        <p class="ant-upload-hint">
          Можно отправить только файл CSV
        </p>
      </a-upload-dragger>
      <div v-if="response">
        <span>Ваш запрос был обработан. Результат:</span>
        <pre>
          {{ JSON.stringify(this.response, null, 2) }}
        </pre>
      </div>
      <a-button :loading="loading" style="margin: 15px 0 0" type="primary" html-type="submit" @click.prevent="sendFile">
        {{ $t('save') }}
      </a-button>
      <p v-if="loading">Документ обрабатывается<loader/></p>
      <!-- <p class="error" v-if="error">Что-то пошло не так</p> -->
    </a-card>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      file: '',
      loading: false,
      response: null,
      error: false
    }
  },
  methods: {
    uploadCsv (e) {
      if (this.error) {
        this.error = false
      }
      const data = new FormData()
      data.append('file', e.file)
      this.file = data
    },
    beforeUpload (file) {
      console.log('file', file)
    },
    handleChange (info) {
      info.file.status = 'done'
    },
    sendFile (e) {
      if (this.file) {
        this.loading = true
        this.$message.success('Ваш запрос обрабатывается')
        axios({
          url: 'https://1c.goodzone.uz/api/stock-update',
          method: 'post',
          data: this.file,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
          console.log(res)
          this.response = res.data
          this.$message.success(this.$t('successfullyUploaded'))
        })
        .catch(err => {
          console.error(err)
          this.$message.success('Ваш запрос был обработан')
          this.error = true
        })
        .finally(() => (this.loading = false))
      } else {
        this.$message.error('Пожалуйста, выберите файл для загрузки')
      }
    }
  }
}
</script>
<style scoped>
p {
  font-size: 1.1rem;
  margin-top: 15px;
}
.error {
  color: red;
}
</style>
