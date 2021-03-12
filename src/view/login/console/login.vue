<style lang="less">
@import './login.less';
</style>

<template>
  <!-- <div class="login-wrapper"> -->
  <div class="console-login" :style="{ backgroundImage: `url(\'${require('@/assets/images/login-bg-console.png')}\')` }">
    <div class="console-login-con">
      <Card icon="log-in" :title="`管理端登录`" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" ref="loginForm"> </login-form>
          <!-- <p class="login-tip">请输入用户名和密码</p> -->
        </div>
      </Card>
    </div>
  </div>
  <!-- </div> -->
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
    // 提交表单
    handleSubmit (loginForm) {
      this.handleLogin(loginForm).then(res => {
        if (res.data.success) {
          this.getUserInfo().then(res => {
            if(res){
              this.$router.push({
                name: this.$config.homeName
              })
            }
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style></style>
