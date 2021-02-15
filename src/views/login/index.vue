<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()"/>
    </van-nav-bar>

    <!-- 登录表单 -->
    <!--
      表单验证：
      1、给van-field组件配置rules验证规则
        参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
      2、当表单提交的时候会自动触发表单的校验
        如果验证通过，会触发submit事件
        如果验证失败，不会触发submit
     -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        v-model="user.mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        name="code"
        v-model="user.code"
        type="number"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            slot="button"
            :time="1000 * 5"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button v-else class="send-sms-btn" round size="small" type="default" native-type="button" @click="onSendSmsCode">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, getSmsCode } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 获取验证码
    async onSendSmsCode () {
      // 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 验证通过，显示倒计时
      this.isCountDownShow = true
      // 请求发送验证码
      try {
        await getSmsCode(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后再试')
        } else {
          this.$toast('发送失败，请稍后再试')
        }
      }
    },
    async onSubmit () {
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止，默认是2s
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })
      // 提交表单请求登录
      try {
        const res = await login(user)
        // res.data.data => { refresh_token: '...', token: '...' }
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')

        // 登录成功，跳转回原来页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后再试')
        }
      }

      // 根据请求响应结果处理后续操作
    }
  }
}
</script>
<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
