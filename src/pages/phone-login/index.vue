<template>
  <div class="phone-login-container">
    <p class="phone-validate">手机号验证</p>
    <p class="subtitle">用于即使获取课程最新信息</p>
    <div class="content">
      <input v-model="phone" class="phone" placeholder="请输入您的手机号" type="number" />
      <div @click="getVcode" class="get_vcode" :style="{color: isCountDown ? '#ccc' : 'black'}">{{tips}}</div>
      <input v-model="vcode" class="vcode" placeholder="请输入验证码" type="number" />
    </div>
    <div class="phone-login">
      <img @click="phoneLogin" src="/static/images/phone_login@2x.png" alt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fetch } from '../../utils/fetch'
export default Vue.extend({
  data() {
    return {
      phone: '17704051019',
      vcode: '',
      tips: '获取验证码', // 提示文字
      timer: 0, // 定时器
      count: 10, // 倒计时的总秒数
      isCountDown: false // 是否正在倒计时
    }
  },
  methods: {
    // 获取验证码
    async getVcode() {
      if (this.phone.trim().length === 0) {
        uni.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 1000
        })
        return
      }

      // 正则校验
      var reg = /^1[3456789][0-9]{9}$/
      if (!reg.test(this.phone)){
        uni.showToast({
          title: '手机号不合法',
          icon: 'none',
          duration: 1000
        })
        return
      }

      // 正在倒计时
      if (this.isCountDown) return
      this.isCountDown = true
      this.tips = `${this.count}`

      this.timer = setInterval(() => {
        if (this.count <= 1) {
          this.isCountDown = false
          this.count = 10
          this.tips = '获取验证码'
          // 清除定时器
          clearInterval(this.timer)

          return
        }

        this.count--

        this.tips = `${this.count}`
      },1000)

      const result = await fetch({
        url: 'user/vcode',
        isNeedAuth: false,
        data: {
          phone: this.phone
        }
      })

      if (result.data.status === 0) {
        uni.showToast({
          title: `${result.data.vcode}`,
          icon: 'none',
          duration: 1000
        })
      }
    },
    // 手机号登录
    async phoneLogin() {
      const result = await fetch({
        method: 'POST',
        url: 'user/login',
        tip: '登录中...',
        isNeedAuth: false,
        data: {
          phone: this.phone,
          vcode: this.vcode
        }
      })

      if (result.data.status === 0) {
        // 保存token
        uni.setStorageSync('my_token', result.data.token)

        // 提示
        uni.showToast({
          title: result.data.message,
          icon: 'none',
          duration: 500
        })

        // 跳转到首页
        uni.reLaunch({
          url: '/pages/home/index'
        })
      } else {
        uni.showToast({
          title: result.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    }
  },
  onUnload(){
    clearInterval(this.timer)
  }
})
</script>

<style lang="less" scoped>
.phone-login-container {
  padding: 0rpx 68rpx;
  .phone-validate {
    margin-top: 100rpx;
    color: #393939;
    font-size: 43px;
  }
  .subtitle {
    margin-top: 20rpx;
    color: #a8a8a8;
    font-size: 30rpx;
  }
  .content {
    margin-top: 150rpx;
    height: 250rpx;
    position: relative;
    .phone {
      height: 100rpx;
      font-size: 15px;
      // background-color: green;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
    .get_vcode {
      position: absolute;
      right: 0;
      top: 20rpx;
      width: 164rpx;
      height: 56rpx;
      text-align: center;
      line-height: 56rpx;
      font-size: 24rpx;
      color: #a8a8a8;
      border: 1px solid rgba(168, 168, 168, 1);
      border-radius: 20px;
      z-index: 2;
    }
    .vcode {
      margin-top: 30px;
      height: 100rpx;
      font-size: 15px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
  }
  .phone-login {
    margin-top: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 568rpx;
      height: 98rpx;
    }
  }
}
</style>
