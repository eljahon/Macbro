<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" :tab="$t('login.form.signin')">
          <a-row type="flex" justify="center">
            <a-col span="auto" class="my-1">
              <a-radio-group v-model="userType" button-style="solid">
                <a-radio-button value="1b0444d7-79c2-42d2-b3c5-528be29506a8">
                  Администратор
                </a-radio-button>
                <a-radio-button value="4aad4651-146f-401a-b35d-20568caec65b">
                  Репетитор
                </a-radio-button>
              </a-radio-group>
            </a-col>
          </a-row>
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="ошибка при входе" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('login.form.username')"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: 'поле обязательно' }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('login.form.password')"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: 'поле обязательно' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('login.form.remember') }}</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >{{ $t('login.form.forgot') }}</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('login.form.enter') }}</a-button>
      </a-form-item>
    </a-form>

    <!-- <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha> -->
  </div>
</template>

<script>
// import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
// import { getSmsCaptcha, get2step } from '@/api/login'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 1,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      userType: '1b0444d7-79c2-42d2-b3c5-528be29506a8',
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created () {
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey
        // Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          // loginParams.password = md5(values.password)
          // console.log(loginParams, this.userType)
          const formulation = { password: loginParams.password, login: loginParams.email, client_id: this.userType }
          if (this.userType === '1b0444d7-79c2-42d2-b3c5-528be29506a8') { this.loginBySystemUser(formulation) } else if (this.userType === '4aad4651-146f-401a-b35d-20568caec65b') {
            this.loginByTutor(formulation)
            }
          // Login(loginParams)
          //   .then((res) => this.loginSuccess(res))
          //   .catch(err => this.requestFailed(err))
          //   .finally(() => {
          //     state.loginBtn = false
          //   })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginBySystemUser (formulation) {
      this.$store.dispatch('loginBySystemUser', formulation).then(res => {
              console.log(res)
              this.$store.dispatch('getUserRolePermissions', res.token.user_role_id).then(roles => {
                this.$store.commit('SET_SYS_ROLES', roles)
                this.loginSuccess(res)
              })
            }).catch(err => {
              this.requestFailed(err)
      })
    },
    loginByTutor (formulation) {
      this.$store.dispatch('loginBySystemUser', formulation).then(res => {
              console.log(res)
              this.loginSuccess(res)
            }).catch(err => {
              this.requestFailed(err)
      })
    },
    // getCaptcha (e) {
    //   e.preventDefault()
    //   const { form: { validateFields }, state } = this

    //   validateFields(['mobile'], { force: true }, (err, values) => {
    //     if (!err) {
    //       state.smsSendBtn = true

    //       const interval = window.setInterval(() => {
    //         if (state.time-- <= 0) {
    //           state.time = 60
    //           state.smsSendBtn = false
    //           window.clearInterval(interval)
    //         }
    //       }, 1000)

    //       const hide = this.$message.loading('login in login page..', 0)
    //       getSmsCaptcha({ mobile: values.mobile }).then(res => {
    //         setTimeout(hide, 2500)
    //         this.$notification['success']({
    //           message: '提示',
    //           description: '验证码获取成功，您的验证码为：' + res.result.captcha,
    //           duration: 8
    //         })
    //       }).catch(err => {
    //         setTimeout(hide, 1)
    //         clearInterval(interval)
    //         state.time = 60
    //         state.smsSendBtn = false
    //         this.requestFailed(err)
    //       })
    //     }
    //   })
    // },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      console.log(res)
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: 'Вы вошли успешно',
          description: ``
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: 'Логин или пароль неверный',
        description: ((err.response || {}).data || {}).message || 'Пожалуйста, попробуйте еще раз',
        duration: 4
      })
      setTimeout(() => {
            this.state.loginBtn = false
      }, 600)
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
