<style lang="less">
@import './login.less';
</style>

<template>
  <div class="supervise-login" :style="{ backgroundImage: `url(\'${require('@/assets/images/login-bg-supervise.png')}\')` }">
    <!-- <div class="login-title"><img src="@/assets/images/logo-bigTitle.svg" /></div> -->
    <div class="supervise-login-con">
      <Card icon="log-in" :title="`监管端登录`" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" ref="loginForm"></login-form>
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
    handleSubmit (loginForm) {
      this.handleLogin(loginForm).then(res => {
        if (res.data.success) {
          const userType = res.data.body.userType

          if (userType === '1') {
            this.$config.homeName = 'superviseIndex'
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
    }
  }
}
</script>

<style></style>
