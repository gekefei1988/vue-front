<style lang="less">
@import './login.less';
</style>

<template>
  <div class="company-login" :style="{ backgroundImage: `url(\'${require('@/assets/images/login-bg-company.png')}\')` }">
    <div class="company-login-con">
      <p class="header-login-wrapper">
        {{ `企业端登录` }}
      </p>
      <Card icon="log-in" title="" :bordered="true">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" ref="loginForm"> </login-form>
          <p class="footer-wrapper"><span>其他登录方式：微信扫码</span> <span class="reg" @click="turnToReg">前往注册</span></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import LoginForm from '@/components/login-form'
import { mapActions } from 'vuex'

export default {
  data () {
    return {}
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),

    /**
     * @description 企业端登录事件
     */
    handleSubmit (loginForm) {
      this.handleLogin(loginForm).then(res => {
        if (res.data.success) {
          const userType = res.data.body.userType
          if (userType === '0') {
            this.$config.homeName = 'companyIndex'
            Cookies.set('homeName', this.$config.homeName)
            this.$router.push({
              name: this.$config.homeName
            })
          } else {
            this.$Message.error('当前用户无权限登录')
          }
        } else {
          this.$Message.error(res.data.msg)
          // 如果开启验证码, 则需要清空验证码
          this.$refs['loginForm'].handleClearVCode()
        }
      })
    },

    /**
     * @description 跳转注册界面
     */
    turnToReg () {
      this.$router.replace({ name: 'company-reg' })
    }
  }
}
</script>

<style></style>
